import { describe, it, expect } from "vitest";
import { safeStr, deepClean, stripUndefined, buildTravelAgencyJsonLd } from "./structured-data";

describe("structured-data", () => {
  it("safeStr filters out placeholders and returns clean strings", () => {
    expect(safeStr("[Placeholder]")).toBeUndefined();
    expect(safeStr("Valid Name")).toBe("Valid Name");
    expect(safeStr("")).toBeUndefined();
    expect(safeStr(undefined)).toBeUndefined();
  });

  it("deepClean recursively scrubs placeholders from nested objects and arrays", () => {
    const raw = {
      name: "Kaizen Travel",
      tagline: "[Placeholder Tagline]",
      nested: {
        address: "Harare, Zimbabwe",
        country: "[Country]",
      },
      items: ["Item 1", "[Placeholder Item]", "Item 3"],
    };

    const cleaned = deepClean(raw);
    expect(cleaned).toEqual({
      name: "Kaizen Travel",
      nested: {
        address: "Harare, Zimbabwe",
      },
      items: ["Item 1", "Item 3"],
    });
  });

  it("stripUndefined handles empty or completely placeholder objects gracefully", () => {
    const allPlaceholders = {
      a: "[A]",
      b: "[B]",
    };

    expect(stripUndefined(allPlaceholders)).toEqual({});
  });

  it("buildTravelAgencyJsonLd builds verified TravelAgency schema with telephone and sameAs", () => {
    const schema = buildTravelAgencyJsonLd("https://kaizentravel.co.zw");
    expect(schema["@type"]).toBe("TravelAgency");
    expect(schema.name).toBe("Kaizen Travel and Adventures");
    expect(schema.url).toBe("https://kaizentravel.co.zw");
    expect(schema.telephone).toBeTruthy();
    expect(Array.isArray(schema.sameAs)).toBe(true);
    expect((schema.sameAs as string[]).length).toBeGreaterThan(0);
  });
});

