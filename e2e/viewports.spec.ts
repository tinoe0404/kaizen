import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/destinations",
  "/packages",
  "/activities",
  "/lodges",
  "/vehicle-hire",
  "/trip",
  "/contact",
  "/about",
  "/privacy",
  "/destinations/destination-a",
  "/activities/activity-a",
  "/lodges/lodge-a",
  "/vehicle-hire/vehicle-a",
];

const VIEWPORT_WIDTHS = [320, 360, 390, 412, 768];

for (const width of VIEWPORT_WIDTHS) {
  test.describe(`Viewport ${width}px`, () => {
    for (const route of ROUTES) {
      test(`no horizontal overflow on ${route} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        await page.waitForLoadState("domcontentloaded");

        const result = await page.evaluate(() => {
          const innerWidth = window.innerWidth;
          const offenders: { selector: string; right: number; width: number }[] = [];

          const all = document.querySelectorAll("*");
          for (const el of all) {
            // Ignore script, style, meta, head, sr-only
            const tag = el.tagName.toLowerCase();
            if (["script", "style", "meta", "head", "title", "link"].includes(tag)) {
              continue;
            }

            const style = window.getComputedStyle(el);
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.opacity === "0" ||
              el.classList.contains("sr-only")
            ) {
              continue;
            }

            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
              continue;
            }

            // Exclude fixed or sticky overlay elements designed to stretch or float
            // But verify normal in-flow content doesn't push past innerWidth
            if (rect.right > innerWidth + 1) {
              const id = el.id ? `#${el.id}` : "";
              const classes =
                el.className && typeof el.className === "string"
                  ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
                  : "";
              offenders.push({
                selector: `${tag}${id}${classes}`,
                right: Math.round(rect.right),
                width: Math.round(rect.width),
              });
            }
          }

          return {
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth,
            offenders,
          };
        });

        expect(
          result.offenders,
          `Route ${route} at ${width}px has elements overflowing the viewport (innerWidth: ${result.innerWidth}px):\n` +
            result.offenders.map((o) => `  - ${o.selector}: right=${o.right}px, width=${o.width}px`).join("\n")
        ).toEqual([]);

        expect(
          result.scrollWidth,
          `Route ${route} at ${width}px has horizontal scroll (scrollWidth: ${result.scrollWidth}px > innerWidth: ${result.innerWidth}px)`
        ).toBeLessThanOrEqual(result.innerWidth);
      });
    }
  });
}

