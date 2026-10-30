import { site } from "../content/site";
import { destinations } from "../content/destinations";
import { activities } from "../content/activities";
import { lodges } from "../content/lodges";
import { vehicles } from "../content/vehicles";
import { ratesUpdated } from "../content/currency";
import type { Offering } from "../content/types";

function normalizeWhatsappNumber(raw: string | undefined | null): string | null {
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

const issues: string[] = [];

// 1. Check site.ts for placeholders and valid WhatsApp number
function checkSiteString(key: string, value: unknown) {
  if (typeof value === "string") {
    if (value.includes("[")) {
      issues.push(`site.${key} contains placeholder: "${value}"`);
    }
  } else if (typeof value === "object" && value !== null) {
    for (const [subKey, subVal] of Object.entries(value)) {
      checkSiteString(`${key}.${subKey}`, subVal);
    }
  }
}

for (const [key, value] of Object.entries(site)) {
  checkSiteString(key, value);
}

if (!normalizeWhatsappNumber(site.whatsappNumber)) {
  issues.push(
    `site.whatsappNumber is missing or invalid: "${site.whatsappNumber}"`
  );
}

// 2. Check offerings for placeholder names, zero price, and zero photos
const allOfferings: Offering[] = [
  ...destinations,
  ...activities,
  ...lodges,
  ...vehicles,
];

for (const item of allOfferings) {
  if (item.name.startsWith("[")) {
    issues.push(
      `Offering "${item.id}" (${item.category}) has placeholder name: "${item.name}"`
    );
  }

  if (item.pricing.amountUsd === 0) {
    issues.push(
      `Offering "${item.id}" ("${item.name}") has zero price: $0 USD`
    );
  }

  if (!item.photos || item.photos.length === 0) {
    issues.push(
      `Offering "${item.id}" ("${item.name}") has zero photos`
    );
  }
}

// 3. Check ratesUpdated older than 90 days
const updatedDate = new Date(ratesUpdated);
const now = new Date();
const diffMs = now.getTime() - updatedDate.getTime();
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

if (isNaN(updatedDate.getTime())) {
  issues.push(`Invalid ratesUpdated date format: "${ratesUpdated}"`);
} else if (diffDays > 90) {
  issues.push(
    `Exchange rates date (${ratesUpdated}) is ${diffDays} days old (exceeds 90 days)`
  );
}

// 4. Report results
if (issues.length > 0) {
  console.error(`\n❌ Launch check found ${issues.length} unfinished item(s):\n`);
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  console.error(
    "\nPlease resolve all unfinished items and placeholders before production launch.\n"
  );
  process.exit(1);
} else {
  console.log(
    `✓ Launch check passed: verified 0 placeholders, all offerings priced with photos, and currency rates are up to date.`
  );
  process.exit(0);
}
