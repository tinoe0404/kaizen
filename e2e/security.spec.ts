import { test, expect } from "@playwright/test";
import { clearReceivedEmails, getReceivedEmails, waitForEmails } from "./smtp-sink/client";

test.describe("Security and Spam Protections", () => {
  test.beforeEach(async () => {
    await clearReceivedEmails();
  });

  test("honeypot filled: shows success to bot but delivers 0 emails", async ({
    page,
  }) => {
    await page.goto("/trip", { waitUntil: "networkidle" });

    // Add destination
    const addBtn = page.locator('button:has-text("Add to trip")').first();
    await addBtn.click();

    // Fill valid dates
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];
    await page.fill("#trip-arrival", arr);
    await page.fill("#trip-departure", dep);

    // Fill visible fields
    await page.fill("#request-name", "Bot Spammer");
    await page.fill("#request-email", "spammer@bot.test");

    // Fill the hidden honeypot field using fill to trigger React's onChange
    await page.locator("#request-website").fill("https://spam-link.bot");

    // Wait > 3 seconds so time honeypot alone is not what triggers it
    await page.waitForTimeout(3500);

    // Submit
    await page.click('button:has-text("Send booking request")');

    // UI shows success to trick bot
    await expect(page.locator('h2:has-text("Request sent")')).toBeVisible({ timeout: 5000 });

    // Verify 0 emails received by sink
    await page.waitForTimeout(1000);
    const emails = await getReceivedEmails();
    expect(emails.length).toBe(0);
  });

  test("submitting within 3 seconds: shows success to speed-bot but delivers 0 emails", async ({
    page,
  }) => {
    await page.goto("/trip", { waitUntil: "networkidle" });

    // Rapidly add and fill
    await page.click('button:has-text("Add to trip")');

    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];
    await page.fill("#trip-arrival", arr);
    await page.fill("#trip-departure", dep);

    await page.fill("#request-name", "Fast Bot");
    await page.fill("#request-email", "fastbot@bot.test");

    // Click submit immediately without waiting (<3 seconds)
    await page.click('button:has-text("Send booking request")');

    // Bot receives 200 success
    await expect(page.locator('h2:has-text("Request sent")')).toBeVisible({ timeout: 5000 });

    // Verify 0 emails sent
    await page.waitForTimeout(1000);
    const emails = await getReceivedEmails();
    expect(emails.length).toBe(0);
  });

  test("forged POST with fake price and fake total: server ignores them and recomputes total", async ({
    request,
  }) => {
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];

    const forgedPayload = {
      ids: ["destination-a"],
      arrival: arr,
      departure: dep,
      guests: 2,
      currency: "USD",
      name: "Price Tamperer",
      email: "tamperer@example.test",
      phone: "+263 77 999 8888",
      message: "Trying to forge price",
      website: "",
      openedAt: Date.now() - 5000,
      // Injected fake totals and prices:
      amountUsd: 1,
      price: 1,
      total: 1,
      totalUsd: 1,
      totalConverted: 1,
    };

    const res = await request.post("/api/request", {
      headers: {
        "x-forwarded-for": "10.0.1.1",
      },
      data: forgedPayload,
    });
    expect(res.status()).toBe(200);

    // Wait for the team email
    const emails = await waitForEmails(2, 5000);
    const teamEmail = emails.find((e) => e.subject.includes("New trip request"));
    expect(teamEmail).toBeDefined();

    // Destination A fixture is $100 per person * 2 guests = $200 USD
    // The server MUST compute $200 and NOT $1
    expect(teamEmail!.text).toContain("Estimated Total (USD): $200");
    expect(teamEmail!.text).toContain("Total (USD): $200");
    expect(teamEmail!.text).not.toContain("Total (USD): $1\n");
  });

  test("name with line break returns 400", async ({ request }) => {
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];

    const res = await request.post("/api/request", {
      headers: {
        "x-forwarded-for": "10.0.1.2",
      },
      data: {
        ids: ["destination-a"],
        arrival: arr,
        departure: dep,
        guests: 2,
        currency: "USD",
        name: "LineBreak\nAttacker",
        email: "legit@example.test",
        website: "",
        openedAt: Date.now() - 5000,
      },
    });

    expect(res.status()).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.errors.name).toBeTruthy();
  });

  test("wrong Origin header returns 403 Forbidden", async ({ request }) => {
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];

    const res = await request.post("/api/request", {
      headers: {
        "x-forwarded-for": "10.0.1.3",
        Origin: "https://malicious-site.example.com",
      },
      data: {
        ids: ["destination-a"],
        arrival: arr,
        departure: dep,
        guests: 2,
        currency: "USD",
        name: "Origin Test",
        email: "origin@example.test",
        website: "",
        openedAt: Date.now() - 5000,
      },
    });

    expect(res.status()).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Forbidden origin");
  });

  test("6th request from the same client within the window returns 429 Too Many Requests", async ({
    request,
  }) => {
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const arr = futureDate.toISOString().split("T")[0];
    const dep = new Date(futureDate.getTime() + 2 * 86400000).toISOString().split("T")[0];

    // Use a fresh unique IP for this rate limit test
    const testIp = "10.99.99.1";

    const makeCall = () =>
      request.post("/api/request", {
        headers: {
          "x-forwarded-for": testIp,
        },
        data: {
          ids: ["destination-a"],
          arrival: arr,
          departure: dep,
          guests: 2,
          currency: "USD",
          name: "Rate Limit Tester",
          email: "rate@example.test",
          website: "",
          openedAt: Date.now() - 5000,
        },
      });

    // Fire 5 requests (allowed limit)
    for (let i = 0; i < 5; i++) {
      const res = await makeCall();
      expect([200, 400]).toContain(res.status());
    }

    // 6th request MUST be rate limited with 429
    const sixthRes = await makeCall();
    expect(sixthRes.status()).toBe(429);
    const data = await sixthRes.json();
    expect(data.error).toContain("Too many requests");
  });
});
