import { describe, it, expect } from "vitest";
import {
  initialTrip,
  tripReducer,
  sanitizeTrip,
  derive,
  TripState,
} from "./trip";
import { getAll } from "./content";

describe("Trip Logic (/lib/trip.ts)", () => {
  const allOfferings = getAll();
  const validId1 = allOfferings[0].id;
  const validId2 = allOfferings[1].id;
  const lodgeId = allOfferings.find((o) => o.category === "lodge")!.id;
  const vehicleId = allOfferings.find((o) => o.category === "vehicle")!.id;

  describe("tripReducer actions", () => {
    it("add: adds valid ID, ignores duplicates and unknown IDs", () => {
      let state = { ...initialTrip };
      state = tripReducer(state, { type: "ADD", id: validId1 });
      expect(state.ids).toEqual([validId1]);

      // Duplicate
      state = tripReducer(state, { type: "ADD", id: validId1 });
      expect(state.ids).toEqual([validId1]);

      // Unknown ID
      state = tripReducer(state, { type: "ADD", id: "non-existent-id" });
      expect(state.ids).toEqual([validId1]);
    });

    it("remove: removes existing ID, ignores non-existent", () => {
      let state = { ...initialTrip, ids: [validId1, validId2] };
      state = tripReducer(state, { type: "REMOVE", id: validId1 });
      expect(state.ids).toEqual([validId2]);

      state = tripReducer(state, { type: "REMOVE", id: "not-there" });
      expect(state.ids).toEqual([validId2]);
    });

    it("toggle: adds if absent, removes if present", () => {
      let state = { ...initialTrip };
      state = tripReducer(state, { type: "TOGGLE", id: validId1 });
      expect(state.ids).toEqual([validId1]);

      state = tripReducer(state, { type: "TOGGLE", id: validId1 });
      expect(state.ids).toEqual([]);

      // Toggle unknown ID does nothing
      state = tripReducer(state, { type: "TOGGLE", id: "unknown" });
      expect(state.ids).toEqual([]);
    });

    it("setDates: updates arrival and departure", () => {
      const state = tripReducer(initialTrip, {
        type: "SET_DATES",
        arrival: "2026-11-01",
        departure: "2026-11-06",
      });
      expect(state.arrival).toBe("2026-11-01");
      expect(state.departure).toBe("2026-11-06");
    });

    it("setGuests: clamps to 1-30 integer", () => {
      let state = tripReducer(initialTrip, { type: "SET_GUESTS", guests: 0 });
      expect(state.guests).toBe(1);

      state = tripReducer(initialTrip, { type: "SET_GUESTS", guests: 45 });
      expect(state.guests).toBe(30);

      state = tripReducer(initialTrip, { type: "SET_GUESTS", guests: 5.8 });
      expect(state.guests).toBe(5);
    });

    it("setCurrency: updates valid currency, ignores invalid", () => {
      let state = tripReducer(initialTrip, {
        type: "SET_CURRENCY",
        currency: "EUR",
      });
      expect(state.currency).toBe("EUR");

      // @ts-expect-error testing invalid currency
      state = tripReducer(state, { type: "SET_CURRENCY", currency: "CAD" });
      expect(state.currency).toBe("EUR");
    });

    it("clear: resets ids to empty array", () => {
      const state = tripReducer(
        { ...initialTrip, ids: [validId1, validId2] },
        { type: "CLEAR" }
      );
      expect(state.ids).toEqual([]);
    });
  });

  describe("sanitizeTrip", () => {
    it("handles null, undefined, primitive, or array input gracefully", () => {
      expect(sanitizeTrip(null)).toEqual(initialTrip);
      expect(sanitizeTrip(undefined)).toEqual(initialTrip);
      expect(sanitizeTrip("garbage string")).toEqual(initialTrip);
      expect(sanitizeTrip(123)).toEqual(initialTrip);
      expect(sanitizeTrip([1, 2, 3])).toEqual(initialTrip);
    });

    it("sanitizes IDs: filters out unknown IDs, non-strings, and deduplicates", () => {
      const input = {
        ids: [validId1, "unknown-id", 42, validId1, validId2, null],
      };
      const sanitized = sanitizeTrip(input);
      expect(sanitized.ids).toEqual([validId1, validId2]);
    });

    it("sanitizes dates: accepts valid ISO yyyy-mm-dd, rejects others", () => {
      expect(
        sanitizeTrip({ arrival: "2026-11-01", departure: "invalid" })
      ).toMatchObject({
        arrival: "2026-11-01",
        departure: "",
      });

      expect(
        sanitizeTrip({ arrival: "11/01/2026", departure: "2026-11-05" })
      ).toMatchObject({
        arrival: "",
        departure: "2026-11-05",
      });
    });

    it("sanitizes guests: clamps 1-30, defaults invalid numbers", () => {
      expect(sanitizeTrip({ guests: -5 }).guests).toBe(1);
      expect(sanitizeTrip({ guests: 100 }).guests).toBe(30);
      expect(sanitizeTrip({ guests: "five" }).guests).toBe(initialTrip.guests);
      expect(sanitizeTrip({ guests: NaN }).guests).toBe(initialTrip.guests);
    });

    it("sanitizes currency: accepts only USD, EUR, GBP, ZAR", () => {
      expect(sanitizeTrip({ currency: "EUR" }).currency).toBe("EUR");
      expect(sanitizeTrip({ currency: "JPY" }).currency).toBe("USD");
      expect(sanitizeTrip({ currency: null }).currency).toBe("USD");
    });
  });

  describe("derive calculations", () => {
    it("computes dateError properly", () => {
      // Missing dates -> no error
      expect(derive({ ...initialTrip }).dateError).toBe("");
      expect(
        derive({ ...initialTrip, arrival: "2026-11-01", departure: "" })
          .dateError
      ).toBe("");

      // Valid range -> no error
      expect(
        derive({
          ...initialTrip,
          arrival: "2026-11-01",
          departure: "2026-11-05",
        }).dateError
      ).toBe("");

      // Same day or departure before arrival -> error
      expect(
        derive({
          ...initialTrip,
          arrival: "2026-11-05",
          departure: "2026-11-05",
        }).dateError
      ).toBe("Departure must be after arrival.");

      expect(
        derive({
          ...initialTrip,
          arrival: "2026-11-05",
          departure: "2026-11-02",
        }).dateError
      ).toBe("Departure must be after arrival.");
    });

    it("computes needsDates correctly", () => {
      // Empty trip -> false
      expect(derive({ ...initialTrip }).needsDates).toBe(false);

      // Only per_person or per_group items -> false even with 0 nights
      const destId = allOfferings.find((o) => o.category === "destination")!.id;
      expect(
        derive({ ...initialTrip, ids: [destId], arrival: "", departure: "" })
          .needsDates
      ).toBe(false);

      // Lodge (per_group_per_night) with 0 nights -> true
      expect(
        derive({ ...initialTrip, ids: [lodgeId], arrival: "", departure: "" })
          .needsDates
      ).toBe(true);

      // Vehicle (per_group_per_day) with 0 nights -> true
      expect(
        derive({ ...initialTrip, ids: [vehicleId], arrival: "", departure: "" })
          .needsDates
      ).toBe(true);

      // Lodge with valid dates (>0 nights) -> false
      expect(
        derive({
          ...initialTrip,
          ids: [lodgeId],
          arrival: "2026-11-01",
          departure: "2026-11-04",
        }).needsDates
      ).toBe(false);
    });

    it("invariant: the sum of displayed line amounts ALWAYS equals totalConverted for all four currencies", () => {
      const state: TripState = {
        ids: [validId1, validId2, lodgeId, vehicleId],
        arrival: "2026-11-01",
        departure: "2026-11-04", // 3 nights
        guests: 4,
        currency: "USD",
      };

      const currencies = ["USD", "EUR", "GBP", "ZAR"] as const;

      for (const cur of currencies) {
        const derived = derive({ ...state, currency: cur });
        const sumOfLines = derived.lines.reduce(
          (sum, line) => sum + line.converted,
          0
        );

        expect(sumOfLines).toBe(derived.totalConverted);
      }
    });
  });
});

