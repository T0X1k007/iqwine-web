import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// ─── Config / constants ───
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_CELLAR_SIZES = new Set([
  '1-50',
  '51-200',
  '201-500',
  '501-1500',
  '1500+',
]);

const LIMITS = {
  company: 200,
  email: 254, // RFC 5321
  cellarSize: 20,
  note: 2000,
  maxBodyBytes: 16 * 1024,
} as const;

// ─── In-memory rate limiter (per-IP, 5 req / hour) ───
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of rateBuckets.entries()) {
      if (now > bucket.resetAt) rateBuckets.delete(ip);
    }
  }, RATE_LIMIT_WINDOW_MS);
}

// ─── Sanitizers ───
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripCRLF(text: string): string {
  return text.replace(/[\r\n]+/g, ' ').trim();
}

function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

// ─── Turnstile verification ───
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn('iQWine signup: TURNSTILE_SECRET_KEY not set, skipping CAPTCHA');
    return true;
  }
  if (!token || typeof token !== 'string' || token.length > 2048) {
    return false;
  }
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip && ip !== 'unknown') formData.append('remoteip', ip);

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verify error:', err);
    return false;
  }
}

// ─── Handler ───
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type.' },
        { status: 415 }
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > LIMITS.maxBodyBytes) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const rate = checkRateLimit(clientIp);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rate.retryAfter
            ? { 'Retry-After': String(rate.retryAfter) }
            : {},
        }
      );
    }

    // The form sends `company` (= name), `email`, `mspSize` (= cellar size), `note`.
    const {
      company: name,
      email,
      mspSize: cellarSize,
      note,
      website,
      captchaToken,
    } = body;

    if (typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      const tokenStr = typeof captchaToken === 'string' ? captchaToken : '';
      const captchaOk = await verifyTurnstile(tokenStr, clientIp);
      if (!captchaOk) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed. Please try again.' },
          { status: 403 }
        );
      }
    }

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      name.length > LIMITS.company
    ) {
      return NextResponse.json(
        { error: 'Name is required (max 200 chars).' },
        { status: 400 }
      );
    }

    if (
      typeof email !== 'string' ||
      email.length > LIMITS.email ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json(
        { error: 'A valid email is required.' },
        { status: 400 }
      );
    }

    if (
      typeof cellarSize !== 'string' ||
      cellarSize.length > LIMITS.cellarSize ||
      !ALLOWED_CELLAR_SIZES.has(cellarSize.trim())
    ) {
      return NextResponse.json(
        {
          error:
            'Cellar size is required and must be one of the allowed values.',
        },
        { status: 400 }
      );
    }

    if (note !== undefined && note !== null) {
      if (typeof note !== 'string' || note.length > LIMITS.note) {
        return NextResponse.json(
          { error: 'Note must be a string (max 2000 chars).' },
          { status: 400 }
        );
      }
    }

    const safeNameRaw = stripCRLF(name).slice(0, LIMITS.company);
    const safeEmailRaw = email.trim().toLowerCase();
    const safeCellarSizeRaw = cellarSize.trim();
    const safeNoteRaw =
      typeof note === 'string' ? note.trim().slice(0, LIMITS.note) : '';

    const safeName = escapeHtml(safeNameRaw);
    const safeEmail = escapeHtml(safeEmailRaw);
    const safeCellarSize = escapeHtml(safeCellarSizeRaw);
    const safeNote = escapeHtml(safeNoteRaw);
    const timestamp = new Date().toISOString();

    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.BETA_NOTIFICATION_EMAIL;
    const fromAddress = process.env.BETA_FROM_EMAIL || 'onboarding@resend.dev';

    if (!resendApiKey || !notificationEmail) {
      console.error('iQWine signup: missing env vars');
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendApiKey);

    const htmlBody = `
      <div style="font-family: 'Cormorant Garamond', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #1B1512; color: #F3ECE7;">
        <h2 style="color: #C8A977; margin-top: 0; font-style: italic; font-weight: 500;">A new request — Founders Circle</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C; color: #B8AAA0; width: 140px;"><strong>Name</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C; color: #B8AAA0;"><strong>Email</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C;"><a href="mailto:${safeEmail}" style="color: #C8A977;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C; color: #B8AAA0;"><strong>Cellar size</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #2B211C;">${safeCellarSize} bottles</td>
          </tr>
          ${
            safeNote
              ? `<tr>
                  <td style="padding: 12px; border-bottom: 1px solid #2B211C; color: #B8AAA0; vertical-align: top;"><strong>Note</strong></td>
                  <td style="padding: 12px; border-bottom: 1px solid #2B211C; white-space: pre-wrap;">${safeNote}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="padding: 12px; color: #B8AAA0;"><strong>Received</strong></td>
            <td style="padding: 12px; color: #B8AAA0; font-size: 12px;">${timestamp}</td>
          </tr>
        </table>
        <p style="margin-top: 28px; font-size: 12px; color: #B8AAA0; font-style: italic;">iQWine — The digital sommelier.</p>
      </div>
    `;

    const textBody = [
      'New iQWine — Founders Circle request',
      '',
      `Name: ${safeNameRaw}`,
      `Email: ${safeEmailRaw}`,
      `Cellar size: ${safeCellarSizeRaw} bottles`,
      safeNoteRaw ? `Note: ${safeNoteRaw}` : '',
      '',
      `Received: ${timestamp}`,
    ]
      .filter(Boolean)
      .join('\n');

    const safeSubject = stripCRLF(
      `iQWine Founders request — ${safeNameRaw}`
    ).slice(0, 200);

    const { error: resendError } = await resend.emails.send({
      from: `iQWine Sommelier <${fromAddress}>`,
      to: [notificationEmail],
      replyTo: safeEmailRaw,
      subject: safeSubject,
      html: htmlBody,
      text: textBody,
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('iQWine signup error:', err);
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
