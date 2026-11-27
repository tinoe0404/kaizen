// ─── Sliding-Window Rate Limiting & Idempotency ─────────────────────────────
// 5 requests per IP per 10 minutes with RFC-compliant headers & automatic GC
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_REQUESTS_PER_WINDOW = 5;

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export interface CachedResponse {
  reference: string;
  confirmationSent: boolean;
  timestamp: number;
}

const ipRequestsMap = new Map<string, number[]>();
const idempotencyMap = new Map<string, CachedResponse>();

export function _resetRateLimitForTesting(): void {
  ipRequestsMap.clear();
  idempotencyMap.clear();
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const timestamps = ipRequestsMap.get(ip) || [];

  // Prune entries older than the window
  const validTimestamps = timestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  );

  // Periodic garbage collection to prevent memory leaks in long-running instances
  if (ipRequestsMap.size > 1000) {
    for (const [key, list] of ipRequestsMap.entries()) {
      if (list.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRequestsMap.delete(key);
      }
    }
  }

  const oldestTime = validTimestamps[0] || now;
  const resetSeconds = Math.max(
    1,
    Math.ceil((oldestTime + RATE_LIMIT_WINDOW_MS - now) / 1000)
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestsMap.set(ip, validTimestamps);
    return {
      allowed: false,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: 0,
      resetSeconds,
    };
  }

  validTimestamps.push(now);
  ipRequestsMap.set(ip, validTimestamps);
  return {
    allowed: true,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - validTimestamps.length),
    resetSeconds,
  };
}

export function getIdempotentResponse(key: string): CachedResponse | undefined {
  return idempotencyMap.get(key);
}

export function setIdempotentResponse(key: string, cached: CachedResponse): void {
  idempotencyMap.set(key, cached);
}
