import { test, expect } from "@playwright/test";

test.describe("Mobile Menu Keyboard and Focus Behavior at 390px", () => {
  test("open, focus first link, Tab trap, Escape close, focus return, and route change", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const menuBtn = page.locator('button[aria-controls="mobile-navigation"]');
    await expect(menuBtn).toBeVisible();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    await expect(menuBtn).toHaveAttribute("aria-label", "Open menu");

    // Click or trigger open
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    await expect(menuBtn).toHaveAttribute("aria-label", "Close menu");

    // Body scroll locked
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe("hidden");

    // Focus automatically moves to the first link inside panel
    const firstLink = page
      .locator("#mobile-navigation")
      .getByRole("link", { name: "Destinations" });
    await expect(firstLink).toBeFocused();

    // Tab through all items and verify focus stays inside
    // Panel items: 4 NAV_LINKS, 2 MOBILE_EXTRA_LINKS, 1 "Plan your trip" button, plus menu button
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const isInside = await page.evaluate(() => {
        const active = document.activeElement;
        const panel = document.getElementById("mobile-navigation");
        const btn = document.querySelector('button[aria-controls="mobile-navigation"]');
        return panel?.contains(active) || active === btn;
      });
      expect(isInside).toBe(true);
    }

    // Press Escape -> closes panel
    await page.keyboard.press("Escape");
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);

    // Focus returned to menu button
    await expect(menuBtn).toBeFocused();

    // Body scroll restored
    const restoredOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(restoredOverflow).not.toBe("hidden");

    // Open again and click a link -> closes on route change
    await menuBtn.click();
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    const aboutLink = page
      .locator("#mobile-navigation")
      .getByRole("link", { name: "About" });
    await aboutLink.click();
    await page.waitForURL("/about");
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });
});
