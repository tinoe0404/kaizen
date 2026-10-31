/**
 * Helpers for building structured data. Skips any string value
 * containing "[" (placeholder) to prevent publishing fake content.
 */

/** Returns the value only if it's a non-placeholder string. */
export function safeStr(value: string | undefined): string | undefined {
  if (!value || value.includes("[")) return undefined;
  return value;
}

/** Strips undefined values from an object (one level deep). */
export function stripUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as Partial<T>;
}

