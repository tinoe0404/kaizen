import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/trip", "/destinations/destination-a"];

test.describe("Tap targets at 360px viewport", () => {
  for (const route of ROUTES) {
    test(`all interactive elements meet 44px min tap target on ${route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      const offenders = await page.evaluate(() => {
        const issues: {
          tag: string;
          selector: string;
          text: string;
          width: number;
          height: number;
          reason: string;
        }[] = [];

        // Check if an element is hidden or sr-only
        function isHidden(el: HTMLElement) {
          if (el.classList.contains("sr-only")) return true;
          if (el.closest(".sr-only")) return true;
          if (el.getAttribute("aria-hidden") === "true") return true;

          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return true;
          }

          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return true;

          return false;
        }

        // Check if a link is an inline link inside a sentence/paragraph
        function isInlineLink(el: HTMLAnchorElement) {
          const parent = el.parentElement;
          if (!parent) return false;

          const style = window.getComputedStyle(el);
          if (style.display === "inline") {
            return true;
          }

          // If inside a paragraph/sentence that has substantial other text
          const parentTag = parent.tagName.toLowerCase();
          if (["p", "span", "li"].includes(parentTag)) {
            const parentText = (parent.textContent || "").trim();
            const elText = (el.textContent || "").trim();
            if (parentText.length > elText.length + 8) {
              return true;
            }
          }

          return false;
        }

        // Check if a control is icon-only (no readable text content, only SVG/symbols)
        function isIconOnly(el: HTMLElement) {
          // If child contains svg and trimmed text is short (<= 1 char like ×, +, −) or empty
          const text = (el.textContent || "").trim();
          if (text.length <= 1) return true;
          return false;
        }

        // Gather all candidates
        const candidates = document.querySelectorAll<HTMLElement>(
          "button, a, input, textarea, select"
        );

        for (const el of candidates) {
          if (isHidden(el)) continue;

          const tag = el.tagName.toLowerCase();

          // If it is an anchor, check if inline inside sentence
          if (tag === "a" && isInlineLink(el as HTMLAnchorElement)) {
            continue;
          }

          const rect = el.getBoundingClientRect();
          const text = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30);
          const id = el.id ? `#${el.id}` : "";
          const classes =
            el.className && typeof el.className === "string"
              ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
              : "";
          const selector = `${tag}${id}${classes}`;

          const iconOnly = isIconOnly(el);

          // Height must be >= 44px (allowing 0.5px subpixel tolerance)
          if (rect.height < 43.5) {
            issues.push({
              tag,
              selector,
              text,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              reason: `Height ${Math.round(rect.height)}px is less than 44px`,
            });
            continue;
          }

          // Icon-only controls must also have width >= 44px
          if (iconOnly && rect.width < 43.5) {
            issues.push({
              tag,
              selector,
              text,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              reason: `Icon-only control width ${Math.round(rect.width)}px is less than 44px`,
            });
          }
        }

        return issues;
      });

      expect(
        offenders,
        `Found ${offenders.length} tap target issues on ${route} at 360px:\n` +
          offenders
            .map(
              (o) =>
                `  - [${o.selector}] "${o.text}": ${o.width}x${o.height}px (${o.reason})`
            )
            .join("\n")
      ).toEqual([]);
    });
  }
});

