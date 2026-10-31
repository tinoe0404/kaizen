/**
 * Helpers for building structured data.
 * Guarantees that no string containing "[" (placeholder) is ever published
 * in schema.org JSON-LD scripts, preventing SEO indexing of draft placeholders.
 */

/** Returns the value only if it is a non-empty, non-placeholder string. */
export function safeStr(value: string | undefined | null): string | undefined {
  if (!value || typeof value !== "string" || value.includes("[")) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Recursively cleans an object or array, stripping undefined values and placeholders. */
export function deepClean<T>(input: T): T | undefined {
  if (typeof input === "string") {
    return safeStr(input) !== undefined ? input : undefined;
  }

  if (Array.isArray(input)) {
    const cleaned = input
      .map(deepClean)
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
    return cleaned.length > 0 ? (cleaned as unknown as T) : undefined;
  }

  if (typeof input === "object" && input !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      const cleaned = deepClean(value);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }
    return Object.keys(result).length > 0 ? (result as T) : undefined;
  }

  return input;
}

/** Strips undefined values from an object. */
export function stripUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const cleaned = deepClean(obj);
  return (cleaned || {}) as Partial<T>;
}
