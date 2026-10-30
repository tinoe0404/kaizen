import { describe, it, expect } from "vitest";
import {
  normalizeWhatsappNumber,
  whatsappLink,
  buildTripMessage,
  formatDateManual,
} from "./whatsapp";
import { site } from "@/content/site";
import { derive, initialTrip, TripState } from "./trip";
import { currencies } from "@/content/currency";

describe("WhatsApp Integration", () => {
  describe("normalizeWhatsappNumber", () => {
    it("normalizes international with plus and spaces", () => {
      expect(normalizeWhatsappNumber("+263 77 123 4567")).toBe("263771234567");
    });

    it("normalizes local format starting with 0 by replacing with country code 263", () => {
      expect(normalizeWhatsappNumber("0771234567")).toBe("263771234567");
    });

    it("normalizes international starting with 00", () => {
      expect(normalizeWhatsappNumber("00263771234567")).toBe("263771234567");
    });

    it("normalizes digits-only international format", () => {
      expect(normalizeWhatsappNumber("263771234567")).toBe("263771234567");
    });

    it("normalizes formatted local with parentheses and hyphens", () => {
      expect(normalizeWhatsappNumber("(077) 123-4567")).toBe("263771234567");
    });

    it("returns null for numbers that are too short (< 9 digits)", () => {
      expect(normalizeWhatsappNumber("12345")).toBeNull();
      expect(normalizeWhatsappNumber("+263 77")).toBeNull();
    });

    it("returns null for numbers that are too long (> 15 digits)", () => {
      expect(normalizeWhatsappNumber("26377123456789012")).toBeNull();
    });

    it("returns null for letters and non-number strings", () => {
      expect(normalizeWhatsappNumber("not-a-number")).toBeNull();
    });

    it("returns null for empty strings, null, or undefined", () => {
      expect(normalizeWhatsappNumber("")).toBeNull();
      expect(normalizeWhatsappNumber(null)).toBeNull();
      expect(normalizeWhatsappNumber(undefined)).toBeNull();
    });

    it("returns null for the placeholder in /content/site.ts", () => {
      expect(normalizeWhatsappNumber(site.whatsappNumber)).toBeNull();
      expect(normalizeWhatsappNumber("[WhatsApp number]")).toBeNull();
    });
  });

  describe("formatDateManual", () => {
    it("formats YYYY-MM-DD manually without date/timezone shifts", () => {
      expect(formatDateManual("2027-03-12")).toBe("12 Mar 2027");
      expect(formatDateManual("2027-03-16")).toBe("16 Mar 2027");
      expect(formatDateManual("2026-11-01")).toBe("1 Nov 2026");
      expect(formatDateManual("2026-12-31")).toBe("31 Dec 2026");
    });

    it("returns null for invalid strings", () => {
      expect(formatDateManual("invalid")).toBeNull();
      expect(formatDateManual("")).toBeNull();
    });
  });

  describe("whatsappLink", () => {
    it("returns null when configured number is invalid or a placeholder", () => {
      expect(whatsappLink()).toBeNull();
      expect(whatsappLink("Hello")).toBeNull();
      expect(whatsappLink("Hello", "[WhatsApp number]")).toBeNull();
      expect(whatsappLink("Hello", "invalid")).toBeNull();
    });

    it("returns a correctly encoded wa.me URL for a valid number (round-trip with decodeURIComponent)", () => {
      const validNum = "+263 77 123 4567";
      const linkNoText = whatsappLink(undefined, validNum);
      expect(linkNoText).toBe("https://wa.me/263771234567");

      const message = "Hello! I want to ask about: Zimbabwe safari & tours.";
      const linkWithText = whatsappLink(message, validNum);
      expect(linkWithText).toBe(
        `https://wa.me/263771234567?text=${encodeURIComponent(message)}`
      );

      // Verify round-trip decode
      const url = new URL(linkWithText!);
      expect(url.origin + url.pathname).toBe("https://wa.me/263771234567");
      expect(decodeURIComponent(url.searchParams.get("text")!)).toBe(message);
    });
  });

  describe("buildTripMessage", () => {
    it("returns a generic greeting when trip is empty", () => {
      const emptyTrip = { ...initialTrip, ids: [] };
      const derived = derive(emptyTrip);
      expect(buildTripMessage(emptyTrip, derived)).toBe(
        "Hello Kaizen Travel and Adventures, I would like to plan a trip."
      );
    });

    it("displays 'Dates: not set yet' when dates are missing", () => {
      const trip: TripState = {
        ids: ["destination-a", "activity-a"],
        arrival: "",
        departure: "",
        guests: 3,
        currency: "USD",
      };
      const derived = derive(trip);
      const msg = buildTripMessage(trip, derived);

      expect(msg).toContain("Dates: not set yet");
      expect(msg).toContain("Guests: 3");
      expect(msg).toContain("- [Destination A]");
      expect(msg).toContain("- [Activity A]");
      expect(msg).toContain("Estimated total:");
      expect(msg).toContain("(USD)");
      expect(msg).toContain("Please let me know what is available.");
    });

    it("formats dates and night count when dates are provided", () => {
      const trip: TripState = {
        ids: ["destination-a"],
        arrival: "2027-03-12",
        departure: "2027-03-16",
        guests: 4,
        currency: "USD",
      };
      const derived = derive(trip);
      const msg = buildTripMessage(trip, derived);

      expect(msg).toContain("Dates: 12 Mar 2027 to 16 Mar 2027 (4 nights)");
      expect(msg).toContain("Guests: 4");
      expect(msg).toContain("- [Destination A]");
      expect(msg).toContain("Estimated total:");
    });

    it("names the currency code for all four supported currencies", () => {
      for (const currency of currencies) {
        const trip: TripState = {
          ids: ["destination-a", "activity-a"],
          arrival: "2027-03-12",
          departure: "2027-03-16",
          guests: 2,
          currency,
        };
        const derived = derive(trip);
        const msg = buildTripMessage(trip, derived);

        expect(msg).toContain(`(${currency})`);
      }
    });

    it("truncates very long trips with '...and N more items.' and stays under 1800 encoded characters", () => {
      // Create a trip with all 16 items repeated or duplicated in derived lines
      const allIds = [
        "destination-a", "destination-b", "destination-c", "destination-d",
        "activity-a", "activity-b", "activity-c", "activity-d",
        "lodge-a", "lodge-b", "lodge-c", "lodge-d",
        "vehicle-a", "vehicle-b", "vehicle-c", "vehicle-d",
      ];

      const trip: TripState = {
        ids: allIds,
        arrival: "2027-03-12",
        departure: "2027-03-25",
        guests: 10,
        currency: "USD",
      };

      // Mock a derived object with very long descriptions/names to force length constraint
      const baseDerived = derive(trip);
      const longLines = baseDerived.lines.map((l, i) => ({
        ...l,
        offering: {
          ...l.offering,
          name: `Super Long Deluxe Luxury Safari Tour Package Offering Item Description #${i} with Extra Details`,
        },
        breakdown: "10 guests x 13 nights x $5,000 per night deluxe inclusive package rate with guided safari excursions",
      }));

      // Repeat lines to ensure it exceeds 1800 characters
      const extremeLines = [...longLines, ...longLines, ...longLines];

      const customDerived = {
        ...baseDerived,
        lines: extremeLines,
      };

      const msg = buildTripMessage(trip, customDerived);

      // Must be under 1800 encoded characters
      expect(encodeURIComponent(msg).length).toBeLessThanOrEqual(1800);

      // Must contain overflow indication
      expect(msg).toMatch(/\.\.\.and \d+ more items\./);

      // Must retain header and total line
      expect(msg).toContain("Hello Kaizen Travel and Adventures");
      expect(msg).toContain("Estimated total:");
      expect(msg).toContain("Please let me know what is available.");
    });
  });
});
