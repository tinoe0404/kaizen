export const currencies = ["USD", "EUR", "GBP", "ZAR"] as const;

export type Currency = (typeof currencies)[number];

export const baseCurrency: Currency = "USD";

// Exchange rates against 1 USD. Update via npm run currency:update or edit directly.
export const rates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  ZAR: 18.5,
};

export const ratesUpdated: string = "2026-10-30";

