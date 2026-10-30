import fs from "node:fs";
import path from "node:path";
import { destinations } from "../content/destinations";
import { activities } from "../content/activities";
import { lodges } from "../content/lodges";
import { vehicles } from "../content/vehicles";
import { currencies, rates } from "../content/currency";
import { Offering, Category } from "../content/types";

const errors: string[] = [];

const categories: { name: Category; items: Offering[] }[] = [
  { name: "destination", items: destinations },
  { name: "activity", items: activities },
  { name: "lodge", items: lodges },
  { name: "vehicle", items: vehicles },
];

const allOfferings: Offering[] = [
  ...destinations,
  ...activities,
  ...lodges,
  ...vehicles,
];

// 1. Check ID uniqueness across all categories
const seenIds = new Map<string, string>();
for (const item of allOfferings) {
  if (seenIds.has(item.id)) {
    errors.push(
      `Duplicate ID "${item.id}" found in category "${item.category}" (${item.name}). Already used by "${seenIds.get(item.id)}".`
    );
  } else {
    seenIds.set(item.id, `${item.category}:${item.name}`);
  }
}

// 2. Check Slug uniqueness within each category
for (const { name: catName, items } of categories) {
  const seenSlugs = new Set<string>();
  for (const item of items) {
    if (seenSlugs.has(item.slug)) {
      errors.push(
        `Duplicate slug "${item.slug}" within category "${catName}" (item: "${item.name}").`
      );
    } else {
      seenSlugs.add(item.slug);
    }
  }
}

// Set of valid destination slugs for destinationSlug checks
const validDestinationSlugs = new Set(destinations.map((d) => d.slug));

// 3. Item fields, pricing, destinationSlug, and photo checks
const publicDir = path.join(process.cwd(), "public");

for (const item of allOfferings) {
  // Check empty name, summary, description
  if (!item.name || item.name.trim() === "") {
    errors.push(`Item ID "${item.id}" (${item.category}) has an empty name.`);
  }
  if (!item.summary || item.summary.trim() === "") {
    errors.push(`Item ID "${item.id}" (${item.name}) has an empty summary.`);
  }
  if (!item.description || item.description.trim() === "") {
    errors.push(
      `Item ID "${item.id}" (${item.name}) has an empty description.`
    );
  }

  // Pricing amount checks
  const amount = item.pricing?.amountUsd;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    errors.push(
      `Item ID "${item.id}" (${item.name}) has an invalid or negative amount: ${amount}.`
    );
  } else if (amount === 0) {
    // Allow amountUsd of 0 only for items whose name starts with "["
    if (!item.name.startsWith("[")) {
      errors.push(
        `Item ID "${item.id}" ("${item.name}") has amountUsd of 0. Only placeholders (names starting with "[") may have a price of 0.`
      );
    }
  }

  // destinationSlug check
  if (item.destinationSlug) {
    if (!validDestinationSlugs.has(item.destinationSlug)) {
      errors.push(
        `Item ID "${item.id}" (${item.name}) has destinationSlug "${item.destinationSlug}" which does not point to an existing destination.`
      );
    }
  }

  // Photos check: src must exist under /public
  if (Array.isArray(item.photos)) {
    for (const photo of item.photos) {
      if (!photo.src || photo.src.trim() === "") {
        errors.push(
          `Item ID "${item.id}" (${item.name}) has a photo with an empty src.`
        );
        continue;
      }
      const cleanSrc = photo.src.startsWith("/") ? photo.src.slice(1) : photo.src;
      const photoPath = path.join(publicDir, cleanSrc);
      if (!fs.existsSync(photoPath)) {
        errors.push(
          `Item ID "${item.id}" (${item.name}) references photo "${photo.src}" which does not exist under /public (${photoPath}).`
        );
      }
    }
  }
}

// 4. Currency rates check: any rate is missing or not positive
for (const cur of currencies) {
  const rate = rates[cur];
  if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
    errors.push(
      `Currency "${cur}" has a missing or non-positive rate: ${rate}`
    );
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Content check failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error("");
  process.exit(1);
} else {
  console.log(
    `✓ Content check passed: verified ${allOfferings.length} offerings across 4 categories and all currency rates.`
  );
  process.exit(0);
}

