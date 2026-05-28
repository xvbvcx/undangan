// Lightweight in-memory rate limiter. Good enough for single-instance Vercel
// functions and prevents the most obvious abuse. For multi-region production
// traffic this should be swapped for Upstash / Redis without changing callers.

type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; remaining: number; resetMs: number };

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.updatedAt > windowMs) {
    buckets.set(key, { tokens: limit - 1, updatedAt: now });
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (bucket.tokens <= 0) {
    return { allowed: false, remaining: 0, resetMs: windowMs - (now - bucket.updatedAt) };
  }

  bucket.tokens -= 1;
  return { allowed: true, remaining: bucket.tokens, resetMs: windowMs - (now - bucket.updatedAt) };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "anonymous";
}

// Periodically prune stale buckets to avoid memory growth on long-lived processes.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.updatedAt > 60 * 60 * 1000) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();
