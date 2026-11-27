import { site } from "@/content/site";

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

/**
 * Builds verified TravelAgency JSON-LD from `content/site.ts` without inventing
 * unverified business credentials, ratings, or registration numbers.
 */
export function buildTravelAgencyJsonLd(
  siteUrl?: string
): Record<string, unknown> {
  const sameAs = Object.values(site.social || {}).filter(
    (url): url is string => Boolean(safeStr(url))
  );

  return stripUndefined({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: safeStr(site.name),
    description: safeStr(site.tagline),
    url: safeStr(siteUrl),
    email: safeStr(site.bookingEmail),
    telephone: safeStr(site.phoneNumber || site.whatsappNumber),
    address: safeStr(site.address),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }) as Record<string, unknown>;
}
