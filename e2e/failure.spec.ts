import { test, expect } from "@playwright/test";
import {
  clearReceivedEmails,
  stopSmtpServer,
  startSmtpServer,
  waitForEmails,
} from "./smtp-sink/client";

test.describe("Failure and Recovery Handling", () => {
  test.beforeEach(async () => {
    await clearReceivedEmails();
    // Ensure SMTP server is running
    await startSmtpServer();
  });

  test.afterEach(async () => {
    // Ensure SMTP server is restarted for subsequent tests
    await startSmtpServer();
  });

  test("when mail transport fails: friendly error shown, inputs & trip retained, resubmit succeeds after recovery", async ({
    page,
  }) => {
    await page.goto("/trip", { waitUntil: "networkidle" });

    // 1. Add destination to trip
    const addBtn = page.locator('button:has-text("Add to trip")').first();
    await addBtn.click();
    await expect(page.locator('button:has-text("Added")').first()).toBeVisible();

    // 2. Set valid dates
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 3 * 86400000).toISOString().split("T")[0];
    await page.fill("#trip-arrival", arr);
    await page.fill("#trip-departure", dep);

    // 3. Fill typed fields
    const testName = "Recovery Traveler";
    const testEmail = "recovery@example.test";
    const testPhone = "+263 77 333 4444";
    const testNotes = "Testing network retry after mail outage.";

    await page.fill("#request-name", testName);
    await page.fill("#request-email", testEmail);
    await page.fill("#request-phone", testPhone);
    await page.fill("#request-notes", testNotes);

    // 4. STOP THE SINK to simulate SMTP outage / failure
    await stopSmtpServer();

    // Wait > 3 seconds so time honeypot is passed
    await page.waitForTimeout(3500);

    // 5. Submit while mail server is down
    const submitBtn = page.locator('button:has-text("Send booking request")');
    await submitBtn.click();

    // 6. Assert: Friendly error is shown
    const errorAlert = page.locator('form div[role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 15000 });
    await expect(errorAlert).toContainText(
      "We could not send your request. Please try again or message us on WhatsApp."
    );

    // Assert: Typed fields are retained
    await expect(page.locator("#request-name")).toHaveValue(testName);
    await expect(page.locator("#request-email")).toHaveValue(testEmail);
    await expect(page.locator("#request-phone")).toHaveValue(testPhone);
    await expect(page.locator("#request-notes")).toHaveValue(testNotes);

    // Assert: Trip is retained (not cleared) in the summary panel
    await expect(
      page.locator("#trip-summary").getByRole("link", { name: "Safari Destination A" })
    ).toBeVisible();
    await expect(page.locator("text=Your trip is empty.")).not.toBeVisible();

    // Assert: Submit button is usable again (not stuck in disabled/loading)
    await expect(submitBtn).toBeEnabled();
    await expect(submitBtn).toHaveText("Send booking request");

    // 7. RESTART THE SINK
    await startSmtpServer();

    // 8. Resubmit successfully
    await submitBtn.click();

    // Assert: Success panel appears
    await expect(page.locator('h2:has-text("Request sent")')).toBeVisible({
      timeout: 10000,
    });

    // Assert: Trip is now cleared
    await expect(page.locator("text=Your trip is empty.")).toBeVisible();

    // Assert: Emails received by sink
    const emails = await waitForEmails(2, 5000);
    expect(emails.length).toBe(2);
  });
});
