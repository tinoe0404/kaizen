import { describe, it, expect } from "vitest";
import { categoryPath, offeringHref } from "./routes";
import { Offering } from "@/content/types";

describe("routes", () => {
  it("categoryPath maps all 4 categories correctly", () => {
    expect(categoryPath.destination).toBe("/destinations");
    expect(categoryPath.activity).toBe("/activities");
    expect(categoryPath.lodge).toBe("/lodges");
    expect(categoryPath.vehicle).toBe("/vehicle-hire");
  });

  it("offeringHref generates correct href", () => {
    const dummyOffering: Offering = {
      id: "dest-test",
      slug: "serengeti-plains",
      category: "destination",
      name: "Serengeti",
      summary: "Summary",
      description: "Description",
      pricing: { unit: "per_person", amountUsd: 100 },
      photos: [],
    };

    expect(offeringHref(dummyOffering)).toBe("/destinations/serengeti-plains");
  });
});

