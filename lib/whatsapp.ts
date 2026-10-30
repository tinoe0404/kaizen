import { site } from "../content/site";
import type { TripState, DerivedTrip } from "./trip";
import { formatCurrencyAmount } from "./pricing";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Normalizes a raw phone number into WhatsApp international digits format.
 * - Strips all non-digit characters.
 * - Strips leading "00".
 * - Replaces a leading local "0" with Zimbabwe country code 263.
 * - Valid only if 9 to 15 digits; otherwise returns null.
 * - Bracketed placeholders return null.
 */
export function normalizeWhatsappNumber(
  raw: string | undefined | null
): string | null {
  if (!raw || typeof raw !== "string") return null;
  if (raw.includes("[") || raw.includes("]")) return null;

  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("0")) {
    digits = "263" + digits.slice(1);
  }

  if (digits.length >= 9 && digits.length <= 15) {
    return digits;
  }

  return null;
}

/**
 * Builds a direct WhatsApp click-to-chat URL.
 * Returns null if the configured number is invalid or a placeholder.
 */
export function whatsappLink(
  text?: string,
  rawNumber?: string
): string | null {
  const num = rawNumber !== undefined ? rawNumber : site.whatsappNumber;
  const digits = normalizeWhatsappNumber(num);
  if (!digits) {
    return null;
  }

  if (text) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${digits}`;
}

/**
 * Formats a YYYY-MM-DD date string manually without Date object or timezone shifts.
 * Returns "12 Mar 2027" or null if invalid.
 */
export function formatDateManual(iso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, mStr, dStr] = iso.split("-");
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/**
 * Builds a formatted plain-text WhatsApp message representing a trip.
 */
export function buildTripMessage(
  trip: TripState,
  derived: DerivedTrip
): string {
  if (!trip.ids.length || !derived.lines.length) {
    return "Hello Kaizen Travel and Adventures, I would like to plan a trip.";
  }

  let datesLine = "Dates: not set yet";
  const arrFormatted = formatDateManual(trip.arrival);
  const depFormatted = formatDateManual(trip.departure);

  if (arrFormatted && depFormatted && derived.nights > 0) {
    datesLine = `Dates: ${arrFormatted} to ${depFormatted} (${derived.nights} ${
      derived.nights === 1 ? "night" : "nights"
    })`;
  }

  const header = `Hello Kaizen Travel and Adventures, I would like to ask about this trip:\n\n${datesLine}\nGuests: ${trip.guests}\n\n`;

  const totalFormatted = formatCurrencyAmount(
    derived.totalConverted,
    trip.currency
  );
  const footer = `\n\nEstimated total: ${totalFormatted} (${trip.currency})\n\nPlease let me know what is available.`;

  const items = derived.lines.map(
    (line) => `- ${line.offering.name} (${line.breakdown})`
  );

  // Check length constraint (under ~1800 encoded characters)
  const fullText = header + items.join("\n") + footer;
  if (encodeURIComponent(fullText).length <= 1800) {
    return fullText;
  }

  // Truncate items list if too long
  let includedCount = items.length;
  while (includedCount > 0) {
    includedCount--;
    const remaining = items.length - includedCount;
    const itemsPart = items.slice(0, includedCount).join("\n");
    const overflowNote =
      includedCount > 0
        ? `\n...and ${remaining} more items.`
        : `...and ${remaining} items.`;
    const candidate = header + itemsPart + overflowNote + footer;

    if (encodeURIComponent(candidate).length <= 1800) {
      return candidate;
    }
  }

  return header + `...and ${items.length} items.` + footer;
}
