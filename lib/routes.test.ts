import { describe, it, expect } from "vitest";
import { categoryPath, offeringHref, packageHref, guideHref } from "./routes";
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

  it("packageHref generates correct href", () => {
    expect(packageHref({ slug: "vic-falls-chobe-combo" })).toBe(
      "/packages/vic-falls-chobe-combo"
    );
  });

  it("guideHref generates correct href", () => {
    expect(guideHref({ slug: "best-time-to-visit-victoria-falls" })).toBe(
      "/guides/best-time-to-visit-victoria-falls"
    );
  });
});

