import { apiError, apiJson, applyCors, corsPreflight, getClientIp, rateLimit } from '@/lib/api';

const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 10;
const FALLBACK_BASE = 36761;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`visitor:${ip}`, LIMIT, WINDOW_MS);

  if (!limit.allowed) {
    return applyCors(
      request,
      apiError(429, 'Visitor counter rate limit exceeded. Please try again later.', {
        retryAfter: new Date(limit.resetTime).toISOString(),
      })
    );
  }

  try {
    const url =
      process.env.COUNT_API_URL || 'https://api.countapi.xyz/hit/codeREDxbt-portfolio/visitors';
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    const count = Number(data?.value);
    if (!Number.isFinite(count)) throw new Error('Invalid counter response');
    return applyCors(request, apiJson({ status: 'success', count, cached: false }));
  } catch {
    return applyCors(request, apiJson({ status: 'success', count: FALLBACK_BASE, fallback: true }));
  }
}

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export function GET(request: Request) {
  return applyCors(request, apiError(405, 'Method not allowed'));
}
