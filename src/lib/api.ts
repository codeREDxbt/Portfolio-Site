import { NextResponse } from "next/server";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetTime: number;
};

const buckets = new Map<string, { count: number; resetTime: number }>();

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key) ?? { count: 0, resetTime: now + windowMs };

  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetTime: current.resetTime,
  };
}

export function applyApiHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export function apiJson(body: unknown, init?: ResponseInit) {
  return applyApiHeaders(NextResponse.json(body, init));
}

export function apiError(status: number, message: string, details?: unknown) {
  return apiJson({ status: "error", statusCode: status, message, details }, { status });
}

const allowedOrigins = new Set(
  [
    "https://coderedxbt.dev",
    "https://www.coderedxbt.dev",
    "https://coderedxbt.vercel.app",
    // localhost origins only exist for local development
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000", "http://127.0.0.1:3000"] : []),
  ],
);

export function applyCors(request: Request, response: NextResponse) {
  const origin = request.headers.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function corsPreflight(request: Request) {
  return applyCors(request, applyApiHeaders(new NextResponse(null, { status: 200 })));
}
