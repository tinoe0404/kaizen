import { describe, it, expect } from "vitest";
import {
  validateRequest,
  computeRequestSummary,
  makeReference,
  getHarareDate,
  RequestPayload,
} from "./request";
import { derive } from "./trip";
import { Currency, currencies } from "@/content/currency";

function makeValidPayload(overrides: Partial<RequestPayload> = {}): RequestPayload {
  return {
    ids: ["destination-a", "activity-a"],
    arrival: "2026-11-10",
    departure: "2026-11-15",
    guests: 2,
    currency: "USD",
    name: "John Doe",
    email: "john@example.com",
    phone: "+263 71 234 5678",
    message: "Looking forward to the trip!",
    website: "",
    openedAt: Date.now() - 5000,
    ...overrides,
  };
}

describe("Request Logic", () => {
  describe("validateRequest", () => {
    it("accepts a completely valid request payload", () => {
      const payload = makeValidPayload();
      const result = validateRequest(payload);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
        expect(result.data.ids).toEqual(["destination-a", "activity-a"]);
      }
    });

    it("rejects non-object or null input", () => {
      expect(validateRequest(null).ok).toBe(false);
      expect(validateRequest(undefined).ok).toBe(false);
      expect(validateRequest([]).ok).toBe(false);
      expect(validateRequest("string").ok).toBe(false);
    });

    describe("ids validation", () => {
      it("rejects empty ids", () => {
        const res = validateRequest(makeValidPayload({ ids: [] }));
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.ids).toBeDefined();
      });

      it("rejects more than 20 items", () => {
        const tooMany = Array.from({ length: 21 }, () => "destination-a");
        const res = validateRequest(makeValidPayload({ ids: tooMany }));
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.ids).toContain("20 items");
      });

      it("rejects unknown offering IDs", () => {
        const res = validateRequest(
          makeValidPayload({ ids: ["non-existent-id"] })
        );
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.ids).toContain("not available");
      });

      it("rejects duplicate offering IDs", () => {
        const res = validateRequest(
          makeValidPayload({ ids: ["destination-a", "destination-a"] })
        );
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.ids).toContain("Duplicate");
      });
    });

    describe("arrival & departure validation", () => {
      it("rejects invalid date formats", () => {
        const res1 = validateRequest(makeValidPayload({ arrival: "10-11-2026" }));
        expect(res1.ok).toBe(false);

        const res2 = validateRequest(makeValidPayload({ departure: "invalid" }));
        expect(res2.ok).toBe(false);
      });

      it("rejects arrival date in the past relative to Harare", () => {
        const res = validateRequest(makeValidPayload({ arrival: "2020-01-01" }));
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.arrival).toContain("past");
      });

      it("rejects departure that is on or before arrival", () => {
        const resSame = validateRequest(
          makeValidPayload({ arrival: "2026-11-10", departure: "2026-11-10" })
        );
        expect(resSame.ok).toBe(false);
        if (!resSame.ok) expect(resSame.errors.departure).toContain("after arrival");

        const resBefore = validateRequest(
          makeValidPayload({ arrival: "2026-11-10", departure: "2026-11-09" })
        );
        expect(resBefore.ok).toBe(false);
        if (!resBefore.ok) expect(resBefore.errors.departure).toContain("after arrival");
      });

      it("rejects non-existent calendar dates", () => {
        const res = validateRequest(
          makeValidPayload({ arrival: "2026-02-31" })
        );
        expect(res.ok).toBe(false);
      });
    });

    describe("guests & currency validation", () => {
      it("rejects non-integer, zero, negative, or > 30 guests", () => {
        expect(validateRequest(makeValidPayload({ guests: 0 })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ guests: -1 })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ guests: 31 })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ guests: 2.5 })).ok).toBe(false);
      });

      it("accepts guests boundary values 1 and 30", () => {
        expect(validateRequest(makeValidPayload({ guests: 1 })).ok).toBe(true);
        expect(validateRequest(makeValidPayload({ guests: 30 })).ok).toBe(true);
      });

      it("rejects unsupported currencies", () => {
        const res = validateRequest(
          makeValidPayload({ currency: "JPY" as unknown as Currency })
        );
        expect(res.ok).toBe(false);
        if (!res.ok) expect(res.errors.currency).toBeDefined();
      });

      it("accepts all four supported currencies", () => {
        for (const cur of currencies) {
          const res = validateRequest(makeValidPayload({ currency: cur }));
          expect(res.ok).toBe(true);
        }
      });
    });

    describe("name validation", () => {
      it("rejects empty or whitespace-only name", () => {
        expect(validateRequest(makeValidPayload({ name: "" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ name: "   " })).ok).toBe(false);
      });

      it("rejects name under 2 characters or over 100 characters", () => {
        expect(validateRequest(makeValidPayload({ name: "A" })).ok).toBe(false);
        expect(
          validateRequest(makeValidPayload({ name: "A".repeat(101) })).ok
        ).toBe(false);
      });

      it("rejects line breaks in name (header injection prevention)", () => {
        const res1 = validateRequest(
          makeValidPayload({ name: "John\nDoe" })
        );
        expect(res1.ok).toBe(false);
        if (!res1.ok) expect(res1.errors.name).toContain("invalid characters");

        const res2 = validateRequest(
          makeValidPayload({ name: "John\rDoe" })
        );
        expect(res2.ok).toBe(false);
      });

      it("rejects ASCII control characters in name", () => {
        const res = validateRequest(
          makeValidPayload({ name: "John\x00Doe" })
        );
        expect(res.ok).toBe(false);
      });
    });

    describe("email validation", () => {
      it("rejects empty or missing email", () => {
        expect(validateRequest(makeValidPayload({ email: "" })).ok).toBe(false);
      });

      it("rejects email without @ or domain dot or with spaces", () => {
        expect(validateRequest(makeValidPayload({ email: "invalid" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ email: "test@domain" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ email: "test @domain.com" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ email: "test@@domain.com" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ email: "@domain.com" })).ok).toBe(false);
        expect(validateRequest(makeValidPayload({ email: "test@.com" })).ok).toBe(false);
      });

      it("rejects line breaks in email (header injection)", () => {
        const res = validateRequest(
          makeValidPayload({ email: "john@example.com\nCc: spam@victim.com" })
        );
        expect(res.ok).toBe(false);
      });

      it("rejects email longer than 254 chars", () => {
        const longEmail = "a".repeat(245) + "@example.com";
        expect(validateRequest(makeValidPayload({ email: longEmail })).ok).toBe(false);
      });

      it("accepts clean standard email", () => {
        expect(
          validateRequest(makeValidPayload({ email: "guest.safari@example.co.uk" })).ok
        ).toBe(true);
      });
    });

    describe("phone validation", () => {
      it("accepts empty or missing phone as it is optional", () => {
        expect(validateRequest(makeValidPayload({ phone: "" })).ok).toBe(true);
      });

      it("rejects letters or illegal symbols in phone", () => {
        const res = validateRequest(makeValidPayload({ phone: "+263 71 234 ABC" }));
        expect(res.ok).toBe(false);
      });

      it("rejects line breaks in phone", () => {
        const res = validateRequest(
          makeValidPayload({ phone: "+263 71\n234" })
        );
        expect(res.ok).toBe(false);
      });

      it("rejects phone longer than 30 characters", () => {
        const res = validateRequest(
          makeValidPayload({ phone: "+1234567890123456789012345678901" })
        );
        expect(res.ok).toBe(false);
      });

      it("accepts valid phone with +, -, (), spaces and digits", () => {
        expect(
          validateRequest(makeValidPayload({ phone: "+1 (555) 234-5678" })).ok
        ).toBe(true);
      });
    });

    describe("message validation", () => {
      it("accepts empty message as it is optional", () => {
        expect(validateRequest(makeValidPayload({ message: "" })).ok).toBe(true);
      });

      it("preserves newlines in message while stripping control characters", () => {
        const result = validateRequest(
          makeValidPayload({ message: "Line 1\nLine 2\r\nLine 3\x00\x08" })
        );
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.data.message).toContain("Line 1\nLine 2");
          expect(result.data.message).not.toContain("\x00");
          expect(result.data.message).not.toContain("\x08");
        }
      });

      it("rejects messages longer than 1000 characters", () => {
        const res = validateRequest(
          makeValidPayload({ message: "x".repeat(1001) })
        );
        expect(res.ok).toBe(false);
      });
    });
  });

  describe("computeRequestSummary server-side recomputation", () => {
    it("matches derive() for all four currencies", () => {
      for (const currency of currencies) {
        const payload = makeValidPayload({
          currency,
          ids: ["destination-a", "lodge-a", "activity-a"],
          arrival: "2026-11-10",
          departure: "2026-11-14",
          guests: 3,
        });

        const summary = computeRequestSummary(payload);
        const derived = derive({
          ids: payload.ids,
          arrival: payload.arrival,
          departure: payload.departure,
          guests: payload.guests,
          currency: payload.currency,
        });

        expect(summary.nights).toBe(derived.nights);
        expect(summary.totalConverted).toBe(derived.totalConverted);
        expect(summary.lines.length).toBe(derived.lines.length);

        for (let i = 0; i < summary.lines.length; i++) {
          expect(summary.lines[i].name).toBe(derived.lines[i].offering.name);
          expect(summary.lines[i].breakdown).toBe(derived.lines[i].breakdown);
          expect(summary.lines[i].converted).toBe(derived.lines[i].converted);
          expect(summary.lines[i].usd).toBe(derived.lines[i].usd);
        }
      }
    });
  });

  describe("makeReference", () => {
    it("matches the KZ-YYMMDD-XXXX format", () => {
      const ref = makeReference();
      const harareDate = getHarareDate();
      const yymmdd =
        harareDate.slice(2, 4) + harareDate.slice(5, 7) + harareDate.slice(8, 10);

      expect(ref).toMatch(
        new RegExp(`^KZ-${yymmdd}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$`)
      );
      // Ensure no ambiguous chars 0, O, 1, I in the 4-char suffix
      const suffix = ref.split("-")[2];
      expect(suffix).not.toMatch(/[0O1I]/);
    });

    it("ensures uniqueness over 1000 calls", () => {
      const set = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        const ref = makeReference();
        set.add(ref);
      }
      expect(set.size).toBe(1000);
    });
  });
});
