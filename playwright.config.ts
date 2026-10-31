import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT || "3456";
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXT_PUBLIC_CONTENT_FIXTURES: "1",
      NEXT_PUBLIC_SITE_URL: BASE_URL,
      SMTP_HOST: "127.0.0.1",
      SMTP_PORT: "2525",
      SMTP_SECURE: "false",
      SMTP_USER: "noreply@kaizentravel.co.zw",
      SMTP_PASS: "test-pass",
      MAIL_FROM_NAME: "Kaizen Travel and Adventures",
      BOOKING_EMAIL: "team@example.test",
      MAIL_DRY_RUN: "false",
    },
  },
});
