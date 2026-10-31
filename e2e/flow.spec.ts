import { test, expect } from "@playwright/test";
import {
  clearReceivedEmails,
  waitForEmails,
} from "./smtp-sink/client";

test.use({
  viewport: { width: 390, height: 844 },
});

test.describe("Full Trip Booking Flow", () => {
  test.beforeEach(async () => {
    await clearReceivedEmails();
  });

  test("adds items, selects dates/guests/ZAR, submits request and verifies emails", async ({
    page,
  }) => {
    // 1. Navigate to Trip Builder page
    await page.goto("/trip", { waitUntil: "networkidle" });

    // 2. Add one item of each category via the UI
    const categories = [
      "Destinations",
      "Activities",
      "Lodges",
      "Vehicle hire",
    ];

    for (const cat of categories) {
      // Switch category tab
      const tab = page.locator(`button[role="tab"]:has-text("${cat}")`);
      await tab.click();

      // Find the "Add to trip" button in the active offerings grid
      const addButton = page
        .locator('button:has-text("Add to trip")')
        .first();
      await expect(addButton).toBeVisible();
      await addButton.click();

      // Wait for it to become "Added"
      await expect(
        page.locator('button:has-text("Added")').first()
      ).toBeVisible();
    }

    // 3. Set dates 3 nights apart (future dates to avoid Harare past date error)
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arrStr = futureDate.toISOString().split("T")[0];
    const depDate = new Date(futureDate.getTime() + 3 * 86400000);
    const depStr = depDate.toISOString().split("T")[0];

    await page.fill("#trip-arrival", arrStr);
    await page.fill("#trip-departure", depStr);

    // 4. Set guests to 4 (default is 2, click "+" twice)
    const plusBtn = page.locator('button[aria-label="More guests"]');
    await plusBtn.click();
    await plusBtn.click();
    await expect(page.locator('span[aria-live="polite"]:has-text("4")')).toBeVisible();

    // 5. Select currency ZAR
    const zarBtn = page.locator('button:has-text("ZAR")');
    await zarBtn.click();
    await expect(zarBtn).toHaveAttribute("aria-pressed", "true");

    // 6. Fill the request form
    const guestEmail = "guest@example.test";
    const guestName = "Test Traveler";

    await page.fill("#request-name", guestName);
    await page.fill("#request-email", guestEmail);
    await page.fill("#request-phone", "+263 77 111 2222");
    await page.fill("#request-notes", "Special safari booking request for automated tests.");

    // Wait at least 3.5 seconds so client openedAt is > 3000ms ago (avoid bot honeypot trigger)
    await page.waitForTimeout(3500);

    // 7. Submit the form
    const submitBtn = page.locator('button:has-text("Send booking request")');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 8. Assert: Success panel with reference matching KZ-yymmdd-XXXX
    const successHeading = page.locator('h2:has-text("Request sent")');
    await expect(successHeading).toBeVisible({ timeout: 10000 });

    const refElement = page.locator("text=/KZ-\\d{6}-[2-9A-HJ-NP-Z]{4}/");
    await expect(refElement).toBeVisible();
    const refText = await refElement.textContent();
    const match = refText?.match(/KZ-\d{6}-[2-9A-HJ-NP-Z]{4}/);
    expect(match).toBeTruthy();
    const reference = match![0];

    // 9. Assert: The sink received exactly 2 emails
    const emails = await waitForEmails(2, 8000);
    expect(emails.length).toBe(2);

    // 10. Assert: Team email details
    // Team email subject: `New trip request ${reference}: ...`
    const teamEmail = emails.find((e) => e.subject.includes("New trip request"));
    expect(teamEmail).toBeDefined();
    expect(teamEmail!.to).toContain("team@example.test");
    expect(teamEmail!.replyTo).toBe(guestEmail);
    expect(teamEmail!.subject).toContain(reference);
    expect(teamEmail!.text).toContain(reference);

    // Assert every item name is in the team email
    expect(teamEmail!.text).toContain("Safari Destination A");
    expect(teamEmail!.text).toContain("Safari Activity A");
    expect(teamEmail!.text).toContain("Safari Lodge A");
    expect(teamEmail!.text).toContain("Safari Vehicle A");

    // Compute total independently inside the test without importing app code:
    // Destination: 100 * 4 guests = $400 USD -> 400 * 18.5 = 7,400 ZAR
    // Activity: 150 flat group = $150 USD -> 150 * 18.5 = 2,775 ZAR
    // Lodge: 200 * 4 guests * 3 nights = $2,400 USD -> 2400 * 18.5 = 44,400 ZAR
    // Vehicle: 250 * (3 nights + 1 day = 4 days) = $1,000 USD -> 1000 * 18.5 = 18,500 ZAR
    // Total ZAR: 7,400 + 2,775 + 44,400 + 18,500 = 73,075 ZAR
    const expectedIndependentTotalZar = "73,075";
    expect(teamEmail!.text).toContain(expectedIndependentTotalZar);

    // 11. Assert: Guest email details
    const guestEmailMsg = emails.find((e) =>
      e.subject.includes("We received your trip request")
    );
    expect(guestEmailMsg).toBeDefined();
    expect(guestEmailMsg!.to).toContain(guestEmail);
    expect(guestEmailMsg!.subject).toContain(reference);
    expect(guestEmailMsg!.text).toContain(reference);
    expect(guestEmailMsg!.text).toContain(
      "This is a request, not a booking."
    );

    // 12. Assert: Trip is cleared afterwards
    await expect(page.locator("text=Your trip is empty.")).toBeVisible();
  });
});

