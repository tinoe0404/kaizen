/**
 * scripts/update-rates.ts
 *
 * Operational utility to synchronize exchange rates against USD
 * and stamp today's date in content/currency.ts.
 *
 * Usage:
 *   npm run currency:update
 */

import fs from "node:fs";
import path from "node:path";

const CURRENCY_FILE = path.join(process.cwd(), "content", "currency.ts");

async function fetchRates(): Promise<Record<string, number>> {
  // Using open.er-api.com (free, open, reliable, no API key required)
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) {
    throw new Error(`Failed to fetch exchange rates: ${res.status}`);
  }
  const data = await res.json();
  if (data.result !== "success" || !data.rates) {
    throw new Error("Invalid response from exchange rate provider");
  }
  return data.rates;
}

async function run() {
  console.log("Fetching live exchange rates against USD...");
  let liveRates: Record<string, number>;

  try {
    liveRates = await fetchRates();
  } catch (err: unknown) {
    console.error("Could not fetch remote rates:", (err as Error).message);
    console.log("To update manually, edit content/currency.ts directly.");
    process.exit(1);
  }

  const eur = Number((liveRates.EUR || 0.92).toFixed(4));
  const gbp = Number((liveRates.GBP || 0.79).toFixed(4));
  const zar = Number((liveRates.ZAR || 18.5).toFixed(2));

  const today = new Date().toISOString().split("T")[0];

  const content = `export const currencies = ["USD", "EUR", "GBP", "ZAR"] as const;

export type Currency = (typeof currencies)[number];

export const baseCurrency: Currency = "USD";

// Exchange rates against 1 USD (Updated via npm run currency:update)
export const rates: Record<Currency, number> = {
  USD: 1,
  EUR: ${eur},
  GBP: ${gbp},
  ZAR: ${zar},
};

export const ratesUpdated: string = "${today}";
`;

  fs.writeFileSync(CURRENCY_FILE, content, "utf-8");

  console.log(`\n✓ Successfully updated content/currency.ts:`);
  console.log(`  - EUR: ${eur}`);
  console.log(`  - GBP: ${gbp}`);
  console.log(`  - ZAR: ${zar}`);
  console.log(`  - ratesUpdated: ${today}\n`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

