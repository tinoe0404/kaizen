import { describe, it, expect } from "vitest";
import {
  getOgImage,
  getCategoryMetadata,
  getOfferingMetadata,
  getPackageMetadata,
  getGuideMetadata,
} from "./og";

describe("og metadata helpers", () => {
  it("returns exact image dimensions from photo-meta.json for known assets", () => {
    expect(
      getOgImage({ src: "/images/activities/bunji-1.jpg", alt: "Bungee jump" })
    ).toEqual({
      url: "/images/activities/bunji-1.jpg",
      width: 1600,
      height: 1069,
      alt: "Bungee jump",
    });

    // Portrait image should retain portrait dimensions rather than 1200x630
    expect(
      getOgImage({ src: "/images/activities/bridge-tour-1.jpg", alt: "Bridge tour" })
    ).toEqual({
      url: "/images/activities/bridge-tour-1.jpg",
      width: 1333,
      height: 2000,
      alt: "Bridge tour",
    });
  });

  it("falls back to /opengraph-image (1200x630) when photo is missing", () => {
    expect(getOgImage(undefined, "Fallback Alt")).toEqual({
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt: "Fallback Alt",
    });
  });

  it("builds category metadata with verified dimensions", () => {
    const meta = getCategoryMetadata("activity");
    expect(meta.alternates?.canonical).toBe("/activities");
    expect(meta.openGraph?.images).toEqual([
      {
        url: "/images/activities/bunji-1.jpg",
        width: 1600,
        height: 1069,
        alt: "Adventure activities at Victoria Falls with Kaizen Travel",
      },
    ]);
  });

  it("builds offering metadata with verified dimensions and returns empty for unknown slug", () => {
    const meta = getOfferingMetadata("lodge", "victoria-falls-safari-lodge");
    expect(meta.alternates?.canonical).toBe("/lodges/victoria-falls-safari-lodge");
    expect(meta.openGraph?.images).toEqual([
      {
        url: "/images/lodges/victoria-falls-safari-lodge-1.jpg",
        width: 2000,
        height: 1333,
        alt: "Victoria Falls Safari Lodge overlooking the Zambezi National Park waterhole at sunset",
      },
    ]);

    expect(getOfferingMetadata("lodge", "non-existent")).toEqual({});
  });

  it("builds package metadata with canonical URL and verified dimensions", () => {
    const meta = getPackageMetadata("vic-falls-chobe-combo");
    expect(meta.alternates?.canonical).toBe("/packages/vic-falls-chobe-combo");
    expect(meta.title).toContain("Best of Victoria Falls & Chobe Wildlife Combo");
    expect(meta.openGraph?.url).toBe("/packages/vic-falls-chobe-combo");
    expect(getPackageMetadata("non-existent")).toEqual({});
  });

  it("builds guide metadata with canonical URL and verified dimensions", () => {
    const meta = getGuideMetadata("best-time-to-visit-victoria-falls");
    expect(meta.alternates?.canonical).toBe(
      "/guides/best-time-to-visit-victoria-falls"
    );
    expect(meta.openGraph?.url).toBe(
      "/guides/best-time-to-visit-victoria-falls"
    );
    expect(getGuideMetadata("non-existent")).toEqual({});
  });
});
