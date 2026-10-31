import { test, expect } from "@playwright/test";

/**
 * SEO smoke tests. Requires the production build with:
 *   VERCEL_ENV=production  NEXT_PUBLIC_SITE_URL=http://127.0.0.1:<port>
 *
 * Detail pages with placeholder content (names starting with "[") are
 * expected to fail placeholder checks pre-launch. The no-placeholder
 * assertion is skipped for those pages — the check:launch script
 * catches them instead.
 */

const STATIC_ROUTES = [
  "/",
  "/destinations",
  "/activities",
  "/lodges",
  "/vehicle-hire",
  "/about",
  "/contact",
  "/privacy",
];

const DETAIL_ROUTES = [
  "/destinations/destination-a",
  "/activities/activity-a",
  "/lodges/lodge-a",
  "/vehicle-hire/vehicle-a",
];

const ALL_ROUTES = [...STATIC_ROUTES, ...DETAIL_ROUTES];

// ── Per-page checks ─────────────────────────────────────────────────

test.describe("SEO: per-page", () => {
  for (const route of ALL_ROUTES) {
    const isDetail = DETAIL_ROUTES.includes(route);

    test(`${route}: title, description, h1, canonical, no placeholders`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      // ── Title ──
      const title = await page.title();
      expect(title.length, `title too long on ${route}`).toBeLessThanOrEqual(70);
      expect(title.length, `title too short on ${route}`).toBeGreaterThan(0);

      // Placeholder check: only enforce on static routes (detail pages
      // use offering names that are placeholders pre-launch)
      if (!isDetail) {
        expect(title, `title contains placeholder on ${route}`).not.toContain("[");
      }

      // ── Meta description ──
      const descEl = page.locator('meta[name="description"]');
      const desc = await descEl.getAttribute("content");
      expect(desc, `missing description on ${route}`).toBeTruthy();
      if (desc) {
        expect(desc.length, `description too short on ${route}`).toBeGreaterThanOrEqual(20);
        expect(desc.length, `description too long on ${route}`).toBeLessThanOrEqual(160);
        if (!isDetail) {
          expect(desc, `description contains placeholder on ${route}`).not.toContain("[");
        }
      }

      // ── Single <h1> ──
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `should have exactly one h1 on ${route}`).toBe(1);

      // ── Canonical ──
      const canonicalEl = page.locator('link[rel="canonical"]');
      const canonical = await canonicalEl.getAttribute("href");
      expect(canonical, `missing canonical on ${route}`).toBeTruthy();

      // ── No "[" in JSON-LD ──
      const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      for (const ld of ldScripts) {
        expect(ld, `JSON-LD contains placeholder on ${route}`).not.toContain("[");
      }
    });
  }
});

// ── Sitemap ─────────────────────────────────────────────────────────

test.describe("SEO: sitemap.xml", () => {
  test("lists all detail pages but not /trip", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();

    // Must include detail page URLs
    expect(body).toContain("/destinations/destination-a");
    expect(body).toContain("/activities/activity-a");
    expect(body).toContain("/lodges/lodge-a");
    expect(body).toContain("/vehicle-hire/vehicle-a");

    // Must NOT include /trip
    expect(body).not.toMatch(/\/trip<\/loc>/);
  });
});

// ── Robots ──────────────────────────────────────────────────────────

test.describe("SEO: robots.txt", () => {
  test("production: allows crawling, has sitemap", async ({ request }) => {
    // The test server should run with VERCEL_ENV=production
    const isProduction = process.env.VERCEL_ENV === "production";
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();

    if (isProduction) {
      expect(body).toContain("Allow: /");
      expect(body).toContain("sitemap");
      expect(body).toContain("Disallow: /trip");
      expect(body).toContain("Disallow: /api/");
    } else {
      expect(body).toContain("Disallow: /");
    }
  });
});
