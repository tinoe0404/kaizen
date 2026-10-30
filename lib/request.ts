import { Currency, currencies } from "@/content/currency";
import { getById } from "@/lib/content";
import { derive, type TripState } from "@/lib/trip";
import { randomInt } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────

export interface RequestPayload {
  ids: string[];
  arrival: string;
  departure: string;
  guests: number;
  currency: Currency;
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string; // honeypot
  openedAt: number;
}

export interface RequestSummaryLine {
  id: string;
  name: string;
  breakdown: string;
  converted: number;
  usd: number;
}

export interface RequestSummary {
  nights: number;
  lines: RequestSummaryLine[];
  totalConverted: number;
  totalUsd: number;
  currency: Currency;
  arrival: string;
  departure: string;
  guests: number;
}

export type ValidationResult =
  | { ok: true; data: RequestPayload }
  | { ok: false; errors: Record<string, string> };

// ─── Constants & Date Helpers ────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CONTROL_OR_NEWLINE_RE = /[\r\n\x00-\x1F\x7F]/;
const MESSAGE_CONTROL_RE = /[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g;
const PHONE_CHARS_RE = /^[\d\s+\-()]+$/;

// 32-character alphabet without 0, O, 1, I to avoid ambiguous glyphs
const UNAMBIGUOUS_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/**
 * Returns today's date in Africa/Harare (UTC+2 year-round) formatted as YYYY-MM-DD.
 */
export function getHarareDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Harare",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// ─── Validation ──────────────────────────────────────────────────────────

export function validateRequest(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "Invalid request payload." } };
  }

  const raw = input as Record<string, unknown>;

  // 1. ids: 1 to 20, all must exist in content, no duplicates
  let ids: string[] = [];
  if (!Array.isArray(raw.ids) || raw.ids.length === 0) {
    errors.ids = "Add at least one item to your trip.";
  } else if (raw.ids.length > 20) {
    errors.ids = "You can add up to 20 items to your trip.";
  } else {
    const seen = new Set<string>();
    let hasInvalid = false;
    let hasDuplicate = false;

    for (const id of raw.ids) {
      if (typeof id !== "string" || !getById(id)) {
        hasInvalid = true;
        break;
      }
      if (seen.has(id)) {
        hasDuplicate = true;
        break;
      }
      seen.add(id);
    }

    if (hasInvalid) {
      errors.ids = "One or more selected items are not available.";
    } else if (hasDuplicate) {
      errors.ids = "Duplicate items are not allowed in the same trip.";
    } else {
      ids = raw.ids as string[];
    }
  }

  // 2. arrival and departure: yyyy-mm-dd, valid dates, departure > arrival, arrival not in past (Harare time)
  let arrival = "";
  let departure = "";

  if (typeof raw.arrival !== "string" || !DATE_RE.test(raw.arrival)) {
    errors.arrival = "Choose your arrival date.";
  } else {
    const [y, m, d] = raw.arrival.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (
      date.getUTCFullYear() !== y ||
      date.getUTCMonth() !== m - 1 ||
      date.getUTCDate() !== d
    ) {
      errors.arrival = "Enter a valid arrival date.";
    } else {
      arrival = raw.arrival;
    }
  }

  if (typeof raw.departure !== "string" || !DATE_RE.test(raw.departure)) {
    errors.departure = "Choose your departure date.";
  } else {
    const [y, m, d] = raw.departure.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    if (
      date.getUTCFullYear() !== y ||
      date.getUTCMonth() !== m - 1 ||
      date.getUTCDate() !== d
    ) {
      errors.departure = "Enter a valid departure date.";
    } else {
      departure = raw.departure;
    }
  }

  if (arrival && departure) {
    const todayHarare = getHarareDate();
    if (arrival < todayHarare) {
      errors.arrival = "Arrival date cannot be in the past.";
    }
    if (departure <= arrival) {
      errors.departure = "Departure must be after arrival.";
    }
  }

  // 3. guests: integer 1 to 30
  let guests = 2;
  if (
    typeof raw.guests !== "number" ||
    !Number.isInteger(raw.guests) ||
    raw.guests < 1 ||
    raw.guests > 30
  ) {
    errors.guests = "Choose between 1 and 30 guests.";
  } else {
    guests = raw.guests;
  }

  // 4. currency: one of the four
  let currency: Currency = "USD";
  if (
    typeof raw.currency !== "string" ||
    !currencies.includes(raw.currency as Currency)
  ) {
    errors.currency = "Choose a valid currency.";
  } else {
    currency = raw.currency as Currency;
  }

  // 5. name: required, trimmed, 2 to 100 chars, no control chars or line breaks
  let name = "";
  if (typeof raw.name !== "string" || raw.name.trim().length === 0) {
    errors.name = "Enter your name.";
  } else if (CONTROL_OR_NEWLINE_RE.test(raw.name)) {
    errors.name = "Name contains invalid characters.";
  } else {
    const trimmed = raw.name.trim();
    if (trimmed.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (trimmed.length > 100) {
      errors.name = "Name must be 100 characters or fewer.";
    } else {
      name = trimmed;
    }
  }

  // 6. email: required, max 254, pattern check (one @, a dot in domain, no spaces), no control/newlines
  let email = "";
  if (typeof raw.email !== "string" || raw.email.trim().length === 0) {
    errors.email = "Enter your email address so we can reach you.";
  } else if (CONTROL_OR_NEWLINE_RE.test(raw.email)) {
    errors.email = "Email contains invalid characters.";
  } else {
    const trimmed = raw.email.trim();
    if (trimmed.length > 254) {
      errors.email = "Email address is too long.";
    } else {
      // Check simple pattern: one @, dot in domain, no spaces
      const parts = trimmed.split("@");
      if (
        parts.length !== 2 ||
        !parts[0] ||
        !parts[1] ||
        trimmed.includes(" ") ||
        !parts[1].includes(".") ||
        parts[1].startsWith(".") ||
        parts[1].endsWith(".")
      ) {
        errors.email = "Enter a valid email address.";
      } else {
        email = trimmed;
      }
    }
  }

  // 7. phone: optional, max 30 chars, only digits, spaces, + - ( ), no control/newlines
  let phone = "";
  if (raw.phone !== undefined && raw.phone !== null && raw.phone !== "") {
    if (typeof raw.phone !== "string") {
      errors.phone = "Enter a valid phone number.";
    } else if (CONTROL_OR_NEWLINE_RE.test(raw.phone)) {
      errors.phone = "Phone number contains invalid characters.";
    } else {
      const trimmed = raw.phone.trim();
      if (trimmed.length > 30) {
        errors.phone = "Phone number must be 30 characters or fewer.";
      } else if (!PHONE_CHARS_RE.test(trimmed)) {
        errors.phone = "Phone number may only contain digits, spaces, +, -, and parentheses.";
      } else {
        phone = trimmed;
      }
    }
  }

  // 8. message: optional, max 1000 chars, strip other control characters but keep newlines
  let message = "";
  if (raw.message !== undefined && raw.message !== null && raw.message !== "") {
    if (typeof raw.message !== "string") {
      errors.message = "Message must be a string.";
    } else {
      const stripped = raw.message.replace(MESSAGE_CONTROL_RE, "");
      if (stripped.length > 1000) {
        errors.message = "Message must be 1,000 characters or fewer.";
      } else {
        message = stripped;
      }
    }
  }

  // 9. website (honeypot)
  const website = typeof raw.website === "string" ? raw.website : "";

  // 10. openedAt
  const openedAt = typeof raw.openedAt === "number" ? raw.openedAt : 0;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      ids,
      arrival,
      departure,
      guests,
      currency,
      name,
      email,
      phone,
      message,
      website,
      openedAt,
    },
  };
}

// ─── Summary (server-side recomputation) ─────────────────────────────────

export function computeRequestSummary(data: RequestPayload): RequestSummary {
  const tripState: TripState = {
    ids: data.ids,
    arrival: data.arrival,
    departure: data.departure,
    guests: data.guests,
    currency: data.currency,
  };

  const derived = derive(tripState);

  const lines: RequestSummaryLine[] = derived.lines.map((l) => ({
    id: l.offering.id,
    name: l.offering.name,
    breakdown: l.breakdown,
    converted: l.converted,
    usd: l.usd,
  }));

  const totalUsd = derived.lines.reduce((sum, line) => sum + line.usd, 0);

  return {
    nights: derived.nights,
    lines,
    totalConverted: derived.totalConverted,
    totalUsd,
    currency: data.currency,
    arrival: data.arrival,
    departure: data.departure,
    guests: data.guests,
  };
}

// ─── Reference Code ──────────────────────────────────────────────────────

const recentReferences = new Set<string>();

export function makeReference(): string {
  const dateStr = getHarareDate();
  const yymmdd =
    dateStr.slice(2, 4) + dateStr.slice(5, 7) + dateStr.slice(8, 10);

  let ref = "";
  // Ensure uniqueness in running process
  do {
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += UNAMBIGUOUS_ALPHABET[randomInt(0, UNAMBIGUOUS_ALPHABET.length)];
    }
    ref = `KZ-${yymmdd}-${code}`;
  } while (recentReferences.has(ref));

  recentReferences.add(ref);
  if (recentReferences.size > 20000) {
    const first = recentReferences.values().next().value;
    if (first) recentReferences.delete(first);
  }

  return ref;
}

