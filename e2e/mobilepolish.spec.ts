import { test, expect } from "@playwright/test";

test.describe("Mobile Polish - Form Font Sizes", () => {
  test("all inputs, textareas and selects have computed font-size >= 16px (no iOS zoom)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/trip");
    await page.waitForLoadState("domcontentloaded");

    const smallInputs = await page.evaluate(() => {
      const offenders: { selector: string; fontSize: string }[] = [];
      const controls = document.querySelectorAll<HTMLElement>(
        "input, textarea, select"
      );
      for (const ctrl of controls) {
        if (ctrl.classList.contains("sr-only") || ctrl.closest(".sr-only")) {
          continue;
        }
        const style = window.getComputedStyle(ctrl);
        const fontSizePx = parseFloat(style.fontSize);
        if (fontSizePx < 16) {
          offenders.push({
            selector: `${ctrl.tagName.toLowerCase()}#${ctrl.id || ""}.${ctrl.className.slice(0, 20)}`,
            fontSize: style.fontSize,
          });
        }
      }
      return offenders;
    });

    expect(
      smallInputs,
      `Found form controls with font size below 16px (iOS zoom risk): ${JSON.stringify(smallInputs)}`
    ).toEqual([]);
  });
});
