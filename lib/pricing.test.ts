import { describe, it, expect } from "vitest";
import {
  nightsBetween,
  lineTotalUsd,
  tripTotalUsd,
  convertFromUsd,
  formatMoney,
  unitLabel,
  priceLine,
} from "./pricing";
import { Offering, PricingUnit } from "@/content/types";

function makeOffering(unit: PricingUnit, amountUsd: number): Offering {
  return {
    id: `test-${unit}`,
    slug: `test-${unit}`,
    category: "activity",
    name: "Test Offering",
    summary: "Summary",
    description: "Description",
    pricing: {
      unit,
      amountUsd,
    },
    photos: [],
  };
}

describe("Pricing Logic", () => {
  describe("nightsBetween", () => {
    it("returns correct count for positive ranges", () => {
      expect(nightsBetween("2026-11-01", "2026-11-02")).toBe(1);
      expect(nightsBetween("2026-11-01", "2026-11-06")).toBe(5);
      expect(nightsBetween("2026-11-01", "2026-11-15")).toBe(14);
    });

    it("returns 0 for same-day or negative ranges", () => {
      expect(nightsBetween("2026-11-05", "2026-11-05")).toBe(0);
      expect(nightsBetween("2026-11-05", "2026-11-01")).toBe(0);
    });

    it("returns 0 for invalid date formats or missing inputs", () => {
      expect(nightsBetween("", "2026-11-05")).toBe(0);
      expect(nightsBetween("2026-11-01", "")).toBe(0);
      expect(nightsBetween("not-a-date", "2026-11-05")).toBe(0);
      expect(nightsBetween("2026/11/01", "2026/11-05")).toBe(0);
      expect(nightsBetween("2026-02-31", "2026-03-05")).toBe(0); // non-standard month overflow or invalid
    });
  });

  describe("lineTotalUsd across all PricingUnits, nights (0, 1, 5) and guests (1, 6)", () => {
    const units: PricingUnit[] = [
      "per_person",
      "per_group",
      "per_person_per_night",
      "per_group_per_night",
      "per_group_per_day",
    ];

    it("covers every PricingUnit", () => {
      expect(units).toHaveLength(5);
    });

    describe("per_person", () => {
      const offering = makeOffering("per_person", 100);

      it("calculates amount * guests, independent of nights", () => {
        // Guests = 1, nights = 0, 1, 5
        expect(lineTotalUsd(offering, { guests: 1, nights: 0 })).toBe(100);
        expect(lineTotalUsd(offering, { guests: 1, nights: 1 })).toBe(100);
        expect(lineTotalUsd(offering, { guests: 1, nights: 5 })).toBe(100);

        // Guests = 6, nights = 0, 1, 5
        expect(lineTotalUsd(offering, { guests: 6, nights: 0 })).toBe(600);
        expect(lineTotalUsd(offering, { guests: 6, nights: 1 })).toBe(600);
        expect(lineTotalUsd(offering, { guests: 6, nights: 5 })).toBe(600);
      });
    });

    describe("per_group", () => {
      const offering = makeOffering("per_group", 250);

      it("returns flat amount regardless of guests or nights", () => {
        expect(lineTotalUsd(offering, { guests: 1, nights: 0 })).toBe(250);
        expect(lineTotalUsd(offering, { guests: 1, nights: 1 })).toBe(250);
        expect(lineTotalUsd(offering, { guests: 1, nights: 5 })).toBe(250);
        expect(lineTotalUsd(offering, { guests: 6, nights: 0 })).toBe(250);
        expect(lineTotalUsd(offering, { guests: 6, nights: 1 })).toBe(250);
        expect(lineTotalUsd(offering, { guests: 6, nights: 5 })).toBe(250);
      });
    });

    describe("per_person_per_night", () => {
      const offering = makeOffering("per_person_per_night", 50);

      it("calculates amount * guests * max(nights, 1)", () => {
        // Guests = 1
        expect(lineTotalUsd(offering, { guests: 1, nights: 0 })).toBe(50); // max(0, 1) = 1
        expect(lineTotalUsd(offering, { guests: 1, nights: 1 })).toBe(50);
        expect(lineTotalUsd(offering, { guests: 1, nights: 5 })).toBe(250);

        // Guests = 6
        expect(lineTotalUsd(offering, { guests: 6, nights: 0 })).toBe(300); // 50 * 6 * 1
        expect(lineTotalUsd(offering, { guests: 6, nights: 1 })).toBe(300); // 50 * 6 * 1
        expect(lineTotalUsd(offering, { guests: 6, nights: 5 })).toBe(1500); // 50 * 6 * 5
      });
    });

    describe("per_group_per_night", () => {
      const offering = makeOffering("per_group_per_night", 200);

      it("calculates amount * max(nights, 1)", () => {
        // Guests = 1
        expect(lineTotalUsd(offering, { guests: 1, nights: 0 })).toBe(200);
        expect(lineTotalUsd(offering, { guests: 1, nights: 1 })).toBe(200);
        expect(lineTotalUsd(offering, { guests: 1, nights: 5 })).toBe(1000);

        // Guests = 6 (group price remains same regardless of guests)
        expect(lineTotalUsd(offering, { guests: 6, nights: 0 })).toBe(200);
        expect(lineTotalUsd(offering, { guests: 6, nights: 1 })).toBe(200);
        expect(lineTotalUsd(offering, { guests: 6, nights: 5 })).toBe(1000);
      });
    });

    describe("per_group_per_day", () => {
      const offering = makeOffering("per_group_per_day", 150);

      it("calculates amount * (nights + 1)", () => {
        // Nights = 0 -> 1 inclusive day
        expect(lineTotalUsd(offering, { guests: 1, nights: 0 })).toBe(150);
        expect(lineTotalUsd(offering, { guests: 6, nights: 0 })).toBe(150);

        // Nights = 1 -> 2 inclusive days
        expect(lineTotalUsd(offering, { guests: 1, nights: 1 })).toBe(300);
        expect(lineTotalUsd(offering, { guests: 6, nights: 1 })).toBe(300);

        // Nights = 5 -> 6 inclusive days
        expect(lineTotalUsd(offering, { guests: 1, nights: 5 })).toBe(900);
        expect(lineTotalUsd(offering, { guests: 6, nights: 5 })).toBe(900);
      });
    });
  });

  describe("tripTotalUsd", () => {
    it("sums multiple offerings correctly", () => {
      const selected = [
        makeOffering("per_person", 100), // 100 * 2 = 200
        makeOffering("per_group_per_night", 150), // 150 * 3 = 450
        makeOffering("per_group_per_day", 80), // 80 * (3 + 1) = 320
      ];
      const total = tripTotalUsd(selected, { guests: 2, nights: 3 });
      expect(total).toBe(200 + 450 + 320);
    });

    it("returns 0 for empty selection", () => {
      expect(tripTotalUsd([], { guests: 2, nights: 3 })).toBe(0);
    });
  });

  describe("convertFromUsd and rounding", () => {
    it("converts and rounds to the nearest whole unit", () => {
      // USD -> USD (1:1)
      expect(convertFromUsd(100, "USD")).toBe(100);

      // USD -> EUR (rate 0.92)
      // 100 * 0.92 = 92
      expect(convertFromUsd(100, "EUR")).toBe(92);
      // 15 * 0.92 = 13.8 -> 14
      expect(convertFromUsd(15, "EUR")).toBe(14);
      // 11 * 0.92 = 10.12 -> 10
      expect(convertFromUsd(11, "EUR")).toBe(10);

      // USD -> GBP (rate 0.79)
      // 100 * 0.79 = 79
      expect(convertFromUsd(100, "GBP")).toBe(79);
      // 15 * 0.79 = 11.85 -> 12
      expect(convertFromUsd(15, "GBP")).toBe(12);
      // 14 * 0.79 = 11.06 -> 11
      expect(convertFromUsd(14, "GBP")).toBe(11);

      // USD -> ZAR (rate 18.5)
      // 100 * 18.5 = 1850
      expect(convertFromUsd(100, "ZAR")).toBe(1850);
      // 11 * 18.5 = 203.5 -> 204
      expect(convertFromUsd(11, "ZAR")).toBe(204);
    });
  });

  describe("formatMoney for all four currencies", () => {
    it("formats USD with standard formatting", () => {
      const formatted = formatMoney(1000, "USD", "en-US");
      expect(formatted).toContain("$");
      expect(formatted).toContain("1,000");
    });

    it("formats EUR with standard formatting", () => {
      const formatted = formatMoney(1000, "EUR", "en-US");
      expect(formatted).toContain("€");
      expect(formatted).toContain("920"); // 1000 * 0.92
    });

    it("formats GBP with standard formatting", () => {
      const formatted = formatMoney(1000, "GBP", "en-US");
      expect(formatted).toContain("£");
      expect(formatted).toContain("790"); // 1000 * 0.79
    });

    it("formats ZAR with standard formatting", () => {
      const formatted = formatMoney(100, "ZAR", "en-US");
      expect(formatted).toMatch(/ZAR|R/);
      expect(formatted).toContain("1,850"); // 100 * 18.5
    });
  });

  describe("unitLabel", () => {
    it("returns human-readable labels for each unit", () => {
      expect(unitLabel("per_person")).toBe("per person");
      expect(unitLabel("per_group")).toBe("per group");
      expect(unitLabel("per_person_per_night")).toBe("per person, per night");
      expect(unitLabel("per_group_per_night")).toBe("per group, per night");
      expect(unitLabel("per_group_per_day")).toBe("per group, per day");
    });
  });

  describe("priceLine", () => {
    it("returns '[PRICE] <unit>' when amountUsd is 0", () => {
      const offering = makeOffering("per_person", 0);
      expect(priceLine(offering)).toBe("[PRICE] per person");
    });

    it("returns 'From $<amount> <unit>' when amountUsd is greater than 0", () => {
      const offering = makeOffering("per_person", 120);
      expect(priceLine(offering)).toBe("From $120 per person");
    });
  });
});

