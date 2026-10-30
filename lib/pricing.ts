import { Offering, PricingUnit } from "@/content/types";
import { Currency, rates } from "@/content/currency";

export interface PricingContext {
  guests: number;
  nights: number;
}

/**
 * Calculates number of nights between arrival and departure ISO dates (YYYY-MM-DD).
 * Returns 0 for missing, invalid, or non-positive ranges.
 */
export function nightsBetween(arrival: string, departure: string): number {
  if (!arrival || !departure) {
    return 0;
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(arrival) || !isoDateRegex.test(departure)) {
    return 0;
  }

  const [arrYear, arrMonth, arrDay] = arrival.split("-").map(Number);
  const [depYear, depMonth, depDay] = departure.split("-").map(Number);

  const arrTime = Date.UTC(arrYear, arrMonth - 1, arrDay);
  const depTime = Date.UTC(depYear, depMonth - 1, depDay);

  const arrDate = new Date(arrTime);
  const depDate = new Date(depTime);

  if (
    isNaN(arrTime) ||
    isNaN(depTime) ||
    arrDate.getUTCFullYear() !== arrYear ||
    arrDate.getUTCMonth() !== arrMonth - 1 ||
    arrDate.getUTCDate() !== arrDay ||
    depDate.getUTCFullYear() !== depYear ||
    depDate.getUTCMonth() !== depMonth - 1 ||
    depDate.getUTCDate() !== depDay
  ) {
    return 0;
  }

  const diffMs = depTime - arrTime;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculates the line total in USD for a single offering given guest count and nights.
 */
export function lineTotalUsd(
  offering: Offering,
  ctx: PricingContext
): number {
  const amount = offering.pricing.amountUsd;
  const guests = ctx.guests;
  const nights = ctx.nights;

  switch (offering.pricing.unit) {
    case "per_person":
      return amount * guests;

    case "per_group":
      return amount;

    case "per_person_per_night":
      return amount * guests * Math.max(nights, 1);

    case "per_group_per_night":
      return amount * Math.max(nights, 1);

    case "per_group_per_day":
      // days are inclusive. CONFIRM with client.
      return amount * (nights + 1);

    default: {
      const _exhaustiveCheck: never = offering.pricing.unit;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Calculates total USD cost for all selected offerings.
 */
export function tripTotalUsd(
  selected: Offering[],
  ctx: PricingContext
): number {
  return selected.reduce((sum, item) => sum + lineTotalUsd(item, ctx), 0);
}

/**
 * Converts a USD amount to the target currency, rounded to the nearest whole unit.
 */
export function convertFromUsd(amountUsd: number, currency: Currency): number {
  const rate = rates[currency] ?? 1;
  return Math.round(amountUsd * rate);
}

/**
 * Formats a USD amount in the target currency using Intl.NumberFormat.
 */
export function formatMoney(
  amountUsd: number,
  currency: Currency,
  locale = "en-US"
): string {
  const converted = convertFromUsd(amountUsd, currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(converted);
}

/**
 * Generates a human-readable price line for an offering.
 * e.g. "From $120 per person". If amountUsd is 0, returns "[PRICE] <unitLabel>".
 */
export function priceLine(offering: Offering): string {
  const unit = unitLabel(offering.pricing.unit);
  if (offering.pricing.amountUsd === 0) {
    return `[PRICE] ${unit}`;
  }
  return `From ${formatMoney(offering.pricing.amountUsd, "USD")} ${unit}`;
}

/**
 * Returns human-readable label for a pricing unit.
 */
export function unitLabel(unit: PricingUnit): string {
  switch (unit) {
    case "per_person":
      return "per person";
    case "per_group":
      return "per group";
    case "per_person_per_night":
      return "per person, per night";
    case "per_group_per_night":
      return "per group, per night";
    case "per_group_per_day":
      return "per group, per day";
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}
