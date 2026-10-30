import { test, expect } from "@playwright/test";

test.describe("Sticky Trip Bar at 390px viewport", () => {
  test("full flow: empty, add item, trip bar appearance, navigation, scroll, and no overlap", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Step 1: Start with empty trip on home page
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    const tripBar = page.locator('nav[aria-label="Trip summary"]');
    await expect(tripBar).toHaveCount(0);

    // Step 2: Navigate to a detail page
    await page.goto("/destinations/destination-a");
    await page.waitForLoadState("domcontentloaded");

    // Bar should not be visible before adding an item
    await expect(tripBar).toHaveCount(0);

    // Click "Add to trip"
    const addBtn = page.getByRole("button", { name: "Add to trip" }).first();
    await addBtn.click();

    // Bar appears with "1 item"
    await expect(tripBar).toBeVisible();
    await expect(tripBar).toContainText("1 item");

    // Bar button on detail page should say "Review trip"
    const reviewTripBtn = tripBar.getByRole("link", { name: "Review trip" });
    await expect(reviewTripBtn).toBeVisible();

    // Check that WhatsApp float button sits above the sticky bar
    const whatsAppFloat = page.locator('a[aria-label="Chat on WhatsApp"]');
    if ((await whatsAppFloat.count()) > 0) {
      await expect(whatsAppFloat).toBeVisible();
      const floatBox = await whatsAppFloat.boundingBox();
      const barBox = await tripBar.boundingBox();
      if (floatBox && barBox) {
        expect(
          floatBox.y + floatBox.height,
          `WhatsApp floating button (bottom: ${floatBox.y + floatBox.height}px) should be above the sticky trip bar (top: ${barBox.y}px)`
        ).toBeLessThanOrEqual(barBox.y + 1);
      }
    }

    // Step 3: Click "Review trip" to go to /trip
    await reviewTripBtn.click();
    await page.waitForURL("/trip");
    await page.waitForLoadState("domcontentloaded");

    // On /trip:
    // 1. WhatsApp floating button must be hidden
    await expect(page.locator('a[aria-label="Chat on WhatsApp"]')).toHaveCount(0);

    // 2. Bar button now says "Review request"
    const reviewRequestBtn = tripBar.getByRole("button", {
      name: "Review request",
    });
    await expect(reviewRequestBtn).toBeVisible();

    // 3. Click "Review request" -> scrolls to #trip-summary and focuses its heading
    await reviewRequestBtn.click();
    const tripSummary = page.locator("#trip-summary");
    await expect(tripSummary).toBeVisible();

    const summaryHeading = tripSummary.locator("h2");
    await expect(summaryHeading).toBeFocused();

    // Step 4: Scroll to bottom of /trip page and verify no overlap
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Wait brief moment for smooth scroll / rendering
    await page.waitForTimeout(300);

    const currentBarBox = await tripBar.boundingBox();
    expect(currentBarBox).not.toBeNull();
    const barTop = currentBarBox!.y;

    // Check submit button does not sit behind bar
    const submitBtn = page.getByRole("button", {
      name: "Send booking request",
    });
    const submitBox = await submitBtn.boundingBox();
    if (submitBox) {
      expect(
        submitBox.y + submitBox.height,
        `Submit button (bottom: ${submitBox.y + submitBox.height}px) must be above sticky bar top (${barTop}px)`
      ).toBeLessThanOrEqual(barTop + 1);
    }

    // Check footer links do not sit behind bar
    const footerLinks = page.locator("footer a");
    const count = await footerLinks.count();
    for (let i = 0; i < count; i++) {
      const link = footerLinks.nth(i);
      const isVisible = await link.isVisible();
      if (isVisible) {
        const linkBox = await link.boundingBox();
        if (linkBox) {
          expect(
            linkBox.y + linkBox.height,
            `Footer link ${i} (bottom: ${linkBox.y + linkBox.height}px) must be above sticky bar top (${barTop}px)`
          ).toBeLessThanOrEqual(barTop + 1);
        }
      }
    }
  });
});

