import { Currency, currencies } from "@/content/currency";
import { Offering } from "@/content/types";
import { getById } from "@/lib/content";
import {
  nightsBetween,
  lineTotalUsd,
  convertFromUsd,
  formatMoney,
} from "@/lib/pricing";

export interface TripState {
  ids: string[];
  arrival: string;
  departure: string;
  guests: number;
  currency: Currency;
}

export const initialTrip: TripState = {
  ids: [],
  arrival: "",
  departure: "",
  guests: 2,
  currency: "USD",
};

export type TripAction =
  | { type: "ADD"; id: string }
  | { type: "ADD_MANY"; ids: string[] }
  | { type: "REMOVE"; id: string }
  | { type: "TOGGLE"; id: string }
  | { type: "SET_DATES"; arrival: string; departure: string }
  | { type: "SET_GUESTS"; guests: number }
  | { type: "SET_CURRENCY"; currency: Currency }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: TripState };

export interface TripLine {
  offering: Offering;
  usd: number;
  converted: number;
  breakdown: string;
}

export interface DerivedTrip {
  nights: number;
  lines: TripLine[];
  totalConverted: number;
  dateError: string;
  needsDates: boolean;
}

function clampGuests(n: number): number {
  if (typeof n !== "number" || !Number.isFinite(n) || isNaN(n)) {
    return initialTrip.guests;
  }
  const integer = Math.floor(n);
  return Math.max(1, Math.min(30, integer));
}

function isValidIsoDate(str: unknown): str is string {
  return typeof str === "string" && /^\d{4}-\d{2}-\d{2}$/.test(str);
}

function isValidCurrency(cur: unknown): cur is Currency {
  return typeof cur === "string" && currencies.includes(cur as Currency);
}

/**
 * Pure trip reducer handling state transitions.
 */
export function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "ADD": {
      const offering = getById(action.id);
      if (!offering || state.ids.includes(action.id)) {
        return state;
      }
      return {
        ...state,
        ids: [...state.ids, action.id],
      };
    }

    case "ADD_MANY": {
      const existing = new Set(state.ids);
      const toAdd: string[] = [];
      for (const id of action.ids) {
        if (!existing.has(id) && Boolean(getById(id))) {
          existing.add(id);
          toAdd.push(id);
        }
      }
      if (toAdd.length === 0) return state;
      return {
        ...state,
        ids: [...state.ids, ...toAdd],
      };
    }

    case "REMOVE": {
      if (!state.ids.includes(action.id)) {
        return state;
      }
      return {
        ...state,
        ids: state.ids.filter((id) => id !== action.id),
      };
    }

    case "TOGGLE": {
      if (state.ids.includes(action.id)) {
        return {
          ...state,
          ids: state.ids.filter((id) => id !== action.id),
        };
      }
      const offering = getById(action.id);
      if (!offering) {
        return state;
      }
      return {
        ...state,
        ids: [...state.ids, action.id],
      };
    }

    case "SET_DATES": {
      return {
        ...state,
        arrival: action.arrival,
        departure: action.departure,
      };
    }

    case "SET_GUESTS": {
      return {
        ...state,
        guests: clampGuests(action.guests),
      };
    }

    case "SET_CURRENCY": {
      if (!isValidCurrency(action.currency)) {
        return state;
      }
      return {
        ...state,
        currency: action.currency,
      };
    }

    case "CLEAR": {
      return {
        ...state,
        ids: [],
      };
    }

    case "HYDRATE": {
      return action.state;
    }

    default:
      return state;
  }
}

/**
 * Validates and sanitizes unknown input from localStorage into a clean TripState.
 * Never throws; invalid fields safely fall back to initial values.
 */
export function sanitizeTrip(input: unknown): TripState {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ...initialTrip };
  }

  const raw = input as Record<string, unknown>;

  // Validate IDs: array of strings that exist in content, deduplicated
  let validIds: string[] = [];
  if (Array.isArray(raw.ids)) {
    const set = new Set<string>();
    for (const item of raw.ids) {
      if (typeof item === "string" && getById(item)) {
        set.add(item);
      }
    }
    validIds = Array.from(set);
  }

  // Validate dates
  const arrival = isValidIsoDate(raw.arrival) ? raw.arrival : initialTrip.arrival;
  const departure = isValidIsoDate(raw.departure)
    ? raw.departure
    : initialTrip.departure;

  // Validate guests
  const guests = typeof raw.guests === "number" ? clampGuests(raw.guests) : initialTrip.guests;

  // Validate currency
  const currency = isValidCurrency(raw.currency)
    ? raw.currency
    : initialTrip.currency;

  return {
    ids: validIds,
    arrival,
    departure,
    guests,
    currency,
  };
}

/**
 * Generates human-readable breakdown string showing unit cost in the selected currency.
 */
function formatBreakdown(
  offering: Offering,
  guests: number,
  nights: number,
  currency: Currency
): string {
  const unitFormatted = formatMoney(offering.pricing.amountUsd, currency);

  switch (offering.pricing.unit) {
    case "per_person":
      return `${guests} ${guests === 1 ? "guest" : "guests"} x ${unitFormatted}`;

    case "per_group":
      return "Flat rate";

    case "per_person_per_night": {
      const effNights = Math.max(nights, 1);
      return `${guests} ${guests === 1 ? "guest" : "guests"} x ${effNights} ${effNights === 1 ? "night" : "nights"} x ${unitFormatted}`;
    }

    case "per_group_per_night": {
      const effNights = Math.max(nights, 1);
      return `${effNights} ${effNights === 1 ? "night" : "nights"} x ${unitFormatted}`;
    }

    case "per_group_per_day": {
      const effDays = nights + 1;
      return `${effDays} ${effDays === 1 ? "day" : "days"} x ${unitFormatted}`;
    }

    default:
      return "Flat rate";
  }
}

/**
 * Derives calculated values (nights, lines with breakdown, converted total, errors, needsDates).
 */
export function derive(state: TripState): DerivedTrip {
  const nights = nightsBetween(state.arrival, state.departure);

  const lines: TripLine[] = [];
  let needsDates = false;

  for (const id of state.ids) {
    const offering = getById(id);
    if (!offering) continue;

    const usd = lineTotalUsd(offering, {
      guests: state.guests,
      nights,
    });

    const converted = convertFromUsd(usd, state.currency);
    const breakdown = formatBreakdown(
      offering,
      state.guests,
      nights,
      state.currency
    );

    lines.push({
      offering,
      usd,
      converted,
      breakdown,
    });

    if (
      (offering.pricing.unit === "per_person_per_night" ||
        offering.pricing.unit === "per_group_per_night" ||
        offering.pricing.unit === "per_group_per_day") &&
      nights === 0
    ) {
      needsDates = true;
    }
  }

  // The lines shown must always add up to the total shown
  const totalConverted = lines.reduce((sum, line) => sum + line.converted, 0);

  let dateError = "";
  if (
    state.arrival &&
    state.departure &&
    nightsBetween(state.arrival, state.departure) <= 0
  ) {
    dateError = "Departure must be after arrival.";
  }

  return {
    nights,
    lines,
    totalConverted,
    dateError,
    needsDates,
  };
}
