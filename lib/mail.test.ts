import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendMail, getBookingEmail, resetMailTransporter } from "./mail";

describe("Mail Transport", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    resetMailTransporter();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    process.env = originalEnv;
  });

  it("throws a clear error naming missing environment variable", () => {
    delete process.env.BOOKING_EMAIL;
    expect(() => getBookingEmail()).toThrow(
      "Missing required environment variable: BOOKING_EMAIL"
    );
  });

  it("in dry-run mode, logs to console and resolves without throwing", async () => {
    vi.stubEnv("MAIL_DRY_RUN", "true");
    vi.stubEnv("NODE_ENV", "test");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await expect(
      sendMail({
        to: "recipient@example.com",
        replyTo: "guest@example.com",
        subject: "Test Dry Run Email",
        text: "This is a test dry run body",
        html: "<p>This is a test dry run body</p>",
      })
    ).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalledWith("=== [MAIL DRY RUN] ===");
    expect(consoleSpy).toHaveBeenCalledWith("To: recipient@example.com");
    expect(consoleSpy).toHaveBeenCalledWith("Reply-To: guest@example.com");
    expect(consoleSpy).toHaveBeenCalledWith("Subject: Test Dry Run Email");
    expect(consoleSpy).toHaveBeenCalledWith("This is a test dry run body");

    consoleSpy.mockRestore();
  });

  it("prints full team and guest emails to console in dry-run mode for a full request", async () => {
    vi.stubEnv("MAIL_DRY_RUN", "true");
    vi.stubEnv("NODE_ENV", "test");

    const { validateRequest, computeRequestSummary, makeReference } =
      await import("./request");
    const { buildTeamEmail, buildGuestEmail } = await import("./emails");

    const payload = {
      ids: ["destination-a", "activity-a"],
      arrival: "2026-11-10",
      departure: "2026-11-15",
      guests: 2,
      currency: "USD" as const,
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+263 71 111 2222",
      message: "Looking forward to our safari!",
      website: "",
      openedAt: Date.now() - 5000,
    };

    const validation = validateRequest(payload);
    expect(validation.ok).toBe(true);
    if (!validation.ok) return;

    const summary = computeRequestSummary(validation.data);
    const ref = makeReference();

    const team = buildTeamEmail(summary, validation.data, ref);
    const guest = buildGuestEmail(summary, validation.data, ref);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await sendMail({
      to: "bookings@kaizentravel.com",
      replyTo: validation.data.email,
      subject: team.subject,
      text: team.text,
      html: team.html,
    });

    await sendMail({
      to: validation.data.email,
      subject: guest.subject,
      text: guest.text,
      html: guest.html,
    });

    expect(consoleSpy).toHaveBeenCalledWith("=== [MAIL DRY RUN] ===");
    expect(consoleSpy).toHaveBeenCalledWith("To: bookings@kaizentravel.com");
    expect(consoleSpy).toHaveBeenCalledWith("To: jane@example.com");

    consoleSpy.mockRestore();
  });
});
