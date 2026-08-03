import { NextResponse } from 'next/server';

/**
 * POST /api/contact — formulaire « Contactez-nous / Démonstration / Partenariat »
 * du site iqwine.ai. Forward best-effort vers l'app cellier-vin
 * (POST /api/contact) qui persiste la demande + notifie l'admin. Aucune adresse
 * courriel publique exposée.
 *
 * Mirroir du pattern beta-signup (validation + rate-limit IP + forward app).
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Catégories SITE acceptées (alignées sur l'app cellier-vin).
const ALLOWED_CATEGORIES = new Set(['CONTACT', 'DEMO', 'PARTNERSHIP', 'BETA']);
// Bascule du 2026-08-02. Un POST vers l'ancien hôte survivrait au 308 (qui
// préserve la méthode et le corps), mais il traverserait une redirection à
// chaque envoi de formulaire — et le jour où elle tombera, le formulaire de
// contact cessera de fonctionner sans qu'aucun test ne l'annonce.
const IQWINE_APP_URL = process.env.IQWINE_APP_URL || 'https://app.iqwine.ai';
const FORWARD_TIMEOUT_MS = 4000;
const LIMITS = { name: 200, email: 254, message: 5000, maxBodyBytes: 16 * 1024 } as const;

// Rate-limit mémoire (par IP, 5 req / heure).
//
// ⚠️ LIMITE CONNUE ET ASSUMÉE (audit 2026-07-28) : sur Vercel, les instances
// sont éphémères et réparties — cette `Map` se réinitialise, donc ce plafond est
// un ralentisseur, pas une barrière. Le VRAI plafond vit côté application
// (`checkAndIncrementContactIp`, seau Redis dédié et fail-closed) : c'est lui
// qui protège la réputation d'envoi. On garde celui-ci pour absorber les
// rafales triviales sans aller-retour réseau, et on PURGE les entrées mortes
// pour qu'une IP usurpée ne fasse plus croître le tas indéfiniment (avant, la
// Map n'évinçait que sur répétition de la même clé → fuite mémoire).
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  // Purge des entrées expirées : borne la mémoire quelle que soit la cardinalité
  // des clés (une IP usurpée par requête créait sinon une entrée immortelle).
  if (buckets.size > 500) {
    for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
  }
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_MAX) return false;
  b.count += 1;
  return true;
}

/**
 * IP du client, telle que Vercel la garantit.
 *
 * AUDIT 2026-07-28 — on lisait le PREMIER élément de `x-forwarded-for`, qui est
 * précisément la partie ÉCRITE PAR LE CLIENT. `curl -H 'X-Forwarded-For: 1.2.3.4'`
 * en incrémentant l'octet donnait donc une identité neuve à chaque requête, et
 * le plafond de 5/heure ne plafonnait rien. C'est l'erreur que l'application a
 * corrigée de son côté (P50) ; ce relais était resté en arrière.
 *
 * Sur Vercel, `x-vercel-forwarded-for` est posé par la plateforme et n'est pas
 * falsifiable ; le DERNIER élément de `x-forwarded-for` est le repli correct —
 * c'est celui qu'ajoute le proxy de confiance, pas celui qu'envoie le client.
 */
function getClientIp(req: Request): string {
  const vercel = req.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0]!.trim();
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const parts = fwd.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]!;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  try {
    if (!(request.headers.get('content-type') || '').toLowerCase().includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type.' }, { status: 415 });
    }
    const raw = await request.text();
    if (raw.length > LIMITS.maxBodyBytes) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
    }
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const ip = getClientIp(request);
    if (!checkRate(ip)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }

    // Honeypot : champ caché « website » → si rempli, bot. On répond 200 sans rien faire.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true });
    }

    const category = String(body.category ?? '');
    const email = String(body.email ?? '').trim().toLowerCase();
    const message = String(body.message ?? '').trim();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, LIMITS.name) : '';

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email) || email.length > LIMITS.email) {
      return NextResponse.json({ error: 'Courriel invalide.' }, { status: 400 });
    }
    if (message.length < 5 || message.length > LIMITS.message) {
      return NextResponse.json({ error: 'Message requis (5–5000 caractères).' }, { status: 400 });
    }

    // Forward vers l'app cellier-vin (persiste + notifie l'admin).
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
    try {
      const res = await fetch(`${IQWINE_APP_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: 'https://iqwine.ai' },
        body: JSON.stringify({ category, email, message, name: name || null, sourceUrl: 'iqwine.ai/contact' }),
        signal: controller.signal,
      });
      if (!res.ok) {
        /**
         * Le corps de la réponse amont est LU puis JOURNALISÉ côté serveur,
         * jamais renvoyé.
         *
         * `detail` avait été retiré de la réponse (audit 2026-07-28) parce
         * qu'il exposait jusqu'à 120 caractères de l'erreur INTERNE de
         * l'application à un appelant anonyme. Mais la lecture était restée
         * sans emploi : on payait le coût de lire le corps pour le jeter, et
         * un 502 ne laissait plus AUCUNE trace exploitable. On perdait le
         * diagnostic sans rien gagner de plus en confidentialité.
         *
         * Ici, le détail va dans les journaux du serveur — là où il est utile
         * et où l'appelant ne le voit pas.
         */
        const detail = await res.text().catch(() => '');
        console.error('[contact] relais amont en échec', {
          status: res.status,
          detail: detail.slice(0, 300),
        });
        return NextResponse.json(
          { error: 'Envoi impossible pour le moment. Réessayez.' },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inconnue.' },
      { status: 500 },
    );
  }
}
