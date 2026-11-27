import { describe, it, expect } from "vitest";
import { getGuides, getGuideBySlug } from "./content";

describe("travel guides content", () => {
  it("provides at least 5 unique, non-empty travel guides", () => {
    const guides = getGuides();
    expect(guides.length).toBeGreaterThanOrEqual(5);

    const slugs = new Set<string>();
    const titles = new Set<string>();

    for (const guide of guides) {
      expect(guide.slug).toBeTruthy();
      expect(guide.title).toBeTruthy();
      expect(guide.metaDescription.length).toBeGreaterThanOrEqual(50);
      expect(guide.metaDescription.length).toBeLessThanOrEqual(165);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(guide.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(guide.relatedLinks.length).toBeGreaterThanOrEqual(2);
      expect(slugs.has(guide.slug)).toBe(false);
      expect(titles.has(guide.title)).toBe(false);
      slugs.add(guide.slug);
      titles.add(guide.title);
    }
  });

  it("retrieves a guide by slug and returns undefined for unknown slugs", () => {
    const guide = getGuideBySlug("best-time-to-visit-victoria-falls");
    expect(guide).toBeDefined();
    expect(guide?.title).toContain("Victoria Falls");
    expect(getGuideBySlug("non-existent-guide")).toBeUndefined();
  });
});
