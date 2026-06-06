import { NextResponse } from 'next/server';

/**
 * POST /api/contact — formulaire « Contactez-nous / Démonstration / Partenariat »
 * du site iqwine.ca. Forward best-effort vers l'app cellier-vin
 * (POST /api/contact) qui persiste la demande + notifie l'admin. Aucune adresse
 * courriel publique exposée.
 *
 * Mirroir du pattern beta-signup (validation + rate-limit IP + forward app).
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Catégories SITE acceptées (alignées sur l'app cellier-vin).
const ALLOWED_CATEGORIES = new Set(['CONTACT', 'DEMO', 'PARTNERSHIP']);
const IQWINE_APP_URL = process.env.IQWINE_APP_URL || 'https://app.iqwine.ca';
const FORWARD_TIMEOUT_MS = 4000;
const LIMITS = { name: 200, email: 254, message: 5000, maxBodyBytes: 16 * 1024 } as const;

// Rate-limit mémoire (par IP, 5 req / heure) — même pattern que beta-signup.
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_MAX) return false;
  b.count += 1;
  return true;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
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
        headers: { 'Content-Type': 'application/json', Origin: 'https://iqwine.ca' },
        body: JSON.stringify({ category, email, message, name: name || null, sourceUrl: 'iqwine.ca/contact' }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return NextResponse.json(
          { error: 'Envoi impossible pour le moment. Réessayez.', detail: text.slice(0, 120) },
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
