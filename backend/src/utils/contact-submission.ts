import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

export const SUBMISSION_TIMEFRAME_MS = 2 * 60 * 1000;
export const GLOBAL_SUBMISSION_WINDOW_MS = 60 * 1000;
const configuredLimit = process.env.CONTACT_GLOBAL_SUBMISSION_LIMIT?.trim() || '120';
if (
  !/^\d+$/.test(configuredLimit) ||
  Number(configuredLimit) < 1 ||
  Number(configuredLimit) > 1000
) {
  throw new Error('CONTACT_GLOBAL_SUBMISSION_LIMIT must be an integer between 1 and 1000.');
}
export const GLOBAL_SUBMISSION_LIMIT = Number(configuredLimit);

export function normalizeIP(value: string): string {
  const ip = value.trim();
  if (ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4) return ip.slice(7);
  if (isIP(ip) === 6) return new URL(`http://[${ip}]`).hostname.slice(1, -1);
  return isIP(ip) === 4 ? ip : '';
}

export function getClientIP(peer: string, forwarded: string, trustedProxies: string[]): string {
  const trusted = new Set(trustedProxies.map(normalizeIP).filter(Boolean));
  let ip = normalizeIP(peer);
  // Walk from the socket towards the client; never trust hops beyond an untrusted peer.
  for (const hop of forwarded.split(',').reverse()) {
    if (!trusted.has(ip)) break;
    const next = normalizeIP(hop);
    if (!next) break;
    ip = next;
  }
  return ip;
}

export function validateContact(data: Record<string, unknown>): Record<string, string> {
  if (data.lastName !== undefined && (typeof data.lastName !== 'string' || data.lastName !== '')) {
    throw new Error('Unable to accept this message.');
  }
  const result: Record<string, string> = {};
  for (const [field, min, max] of [
    ['name', 1, 100],
    ['email', 3, 254],
    ['phone', 0, 50],
    ['message', 21, 500]
  ] as const) {
    const value = field === 'phone' && data[field] === undefined ? '' : data[field];
    if (typeof value !== 'string' || value.trim().length < min || value.length > max) {
      throw new Error(`${field} must contain ${min}–${max} characters.`);
    }
    result[field] = value.trim();
  }
  result.email = result.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) {
    throw new Error('Enter a valid email address.');
  }
  return result;
}

export function createSubmissionLimiter() {
  const deadlines = new Map<string, number>();
  let attempts: number[] = [];
  return (ip: string, now = Date.now()): number => {
    for (const [key, deadline] of deadlines) {
      if (deadline <= now) deadlines.delete(key);
    }
    const remaining = (deadlines.get(ip) ?? 0) - now;
    if (remaining > 0) return Math.ceil(remaining / 1000);
    attempts = attempts.filter((time) => time > now - GLOBAL_SUBMISSION_WINDOW_MS);
    if (attempts.length >= GLOBAL_SUBMISSION_LIMIT) {
      return Math.ceil((attempts[0] + GLOBAL_SUBMISSION_WINDOW_MS - now) / 1000);
    }
    attempts.push(now);
    // Unverified email addresses cannot reserve another person's submission slot.
    deadlines.set(ip, now + SUBMISSION_TIMEFRAME_MS);
    return 0;
  };
}

// --- Spam protection ---

const LINK = /(https?:\/\/|www\.)\S+/gi;

// Words of 8+ letters that flip from lower to upper case 3+ times read as
// generated noise ("MbiXMuXHJcVfosjDkfYVHGPI"); real names and words rarely do.
function looksRandom(text: string): boolean {
  return text.split(/\s+/).some((word) => {
    if (!/^[A-Za-z]{8,}$/.test(word)) return false;
    return (word.match(/[a-z][A-Z]/g) ?? []).length >= 3;
  });
}

/**
 * Why a validated contact message looks like spam, or null. Callers drop spam
 * silently (answering as if accepted) so bots get no signal to adapt to.
 */
export function spamReason(data: { name: string; email: string; message: string }): string | null {
  if (data.message.trim().split(/\s+/).length < 3) return 'message has fewer than 3 words';
  if (looksRandom(data.name) || looksRandom(data.message)) return 'random-case text';
  const [local, domain] = data.email.split('@');
  if (/^(gmail|googlemail)\.com$/.test(domain) && (local.match(/\./g) ?? []).length >= 3) {
    return 'dot-padded Gmail address';
  }
  if ((data.message.match(LINK) ?? []).length >= 2) return 'two or more links';
  return null;
}

// Form tokens: the site issues `<timestamp>.<HMAC>` when the form loads; the
// API accepts a message only with a valid, unexpired token, and treats a
// submission within a few seconds of loading the form as automated.
export const FORM_TOKEN_MIN_AGE_MS = 3 * 1000;
export const FORM_TOKEN_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function sign(secret: string, timestamp: string): string {
  return createHmac('sha256', secret).update(`contact-form:${timestamp}`).digest('base64url');
}

export function createFormToken(secret: string, now = Date.now()): string {
  return `${now}.${sign(secret, String(now))}`;
}

export function checkFormToken(
  token: unknown,
  secret: string,
  now = Date.now()
): 'ok' | 'missing' | 'invalid' | 'too-fast' | 'expired' {
  if (typeof token !== 'string' || !token) return 'missing';
  const match = /^(\d{10,16})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return 'invalid';
  const expected = Buffer.from(sign(secret, match[1]));
  const given = Buffer.from(match[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return 'invalid';
  const age = now - Number(match[1]);
  if (age < -60 * 1000 || age > FORM_TOKEN_MAX_AGE_MS) return 'expired';
  if (age < FORM_TOKEN_MIN_AGE_MS) return 'too-fast';
  return 'ok';
}
