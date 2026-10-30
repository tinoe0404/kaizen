import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, _resetRateLimitForTesting } from "./route";
import { NextRequest } from "next/server";
import * as mailModule from "@/lib/mail";

vi.mock("@/lib/mail", () => ({
  sendMail: vi.fn(),
  getBookingEmail: vi.fn(() => "bookings@kaizentravel.com"),
}));

function createJsonRequest(
  body: unknown,
  options: {
    headers?: Record<string, string>;
    rawBody?: string;
  } = {}
): NextRequest {
  const bodyString = options.rawBody !== undefined ? options.rawBody : JSON.stringify(body);
  const headers = new Headers({
    "content-type": "application/json",
    host: "localhost:3000",
    ...options.headers,
  });

  return new NextRequest("http://localhost:3000/api/request", {
    method: "POST",
    headers,
    body: bodyString,
  });
}

function makeValidBody() {
  return {
    ids: ["destination-a", "activity-a"],
    arrival: "2026-11-10",
    departure: "2026-11-15",
    guests: 2,
    currency: "USD",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+263 71 111 2222",
    message: "Excited for safari!",
    website: "",
    openedAt: Date.now() - 5000, // 5s ago (past 3s threshold)
  };
}

describe("POST /api/request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    _resetRateLimitForTesting();
  });

  it("returns 415 when Content-Type is not application/json", async () => {
    const req = new NextRequest("http://localhost:3000/api/request", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        host: "localhost:3000",
      },
      body: "plain text body",
    });

    const res = await POST(req);
    expect(res.status).toBe(415);
    const data = await res.json();
    expect(data.error).toContain("Unsupported media type");
  });

  it("returns 413 when body exceeds 20 KB", async () => {
    const largeString = "a".repeat(21 * 1024);
    const req = createJsonRequest(
      {},
      { rawBody: JSON.stringify({ large: largeString }) }
    );

    const res = await POST(req);
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toContain("Payload too large");
  });

  it("returns 403 when Origin header does not match Host", async () => {
    const req = createJsonRequest(makeValidBody(), {
      headers: {
        origin: "https://malicious-site.com",
        host: "kaizen-travel.vercel.app",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Forbidden");
  });

  it("allows request when Origin header matches Host", async () => {
    vi.mocked(mailModule.sendMail).mockResolvedValue(undefined);

    const req = createJsonRequest(makeValidBody(), {
      headers: {
        origin: "https://kaizen-travel.vercel.app",
        host: "kaizen-travel.vercel.app",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 with errors map when request validation fails", async () => {
    const invalidBody = makeValidBody();
    invalidBody.name = ""; // Missing name
    invalidBody.email = "not-an-email";

    const req = createJsonRequest(invalidBody);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.errors).toBeDefined();
    expect(data.errors.name).toBeDefined();
    expect(data.errors.email).toBeDefined();
  });

  it("honeypot: returns 200 without calling mail transport if website field is filled", async () => {
    const botBody = makeValidBody();
    botBody.website = "https://spamsite.com";

    const req = createJsonRequest(botBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.reference).toBeDefined();

    // Must NOT call email transport
    expect(mailModule.sendMail).not.toHaveBeenCalled();
  });

  it("honeypot: returns 200 without calling mail transport if submitted in under 3 seconds", async () => {
    const fastBody = makeValidBody();
    fastBody.openedAt = Date.now() - 1000; // 1s ago (< 3s)

    const req = createJsonRequest(fastBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);

    expect(mailModule.sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 when team email sending fails", async () => {
    vi.mocked(mailModule.sendMail).mockRejectedValueOnce(
      new Error("SMTP connection failed")
    );

    const req = createJsonRequest(makeValidBody());
    const res = await POST(req);

    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe(
      "We could not send your request. Please try again or message us on WhatsApp."
    );

    expect(mailModule.sendMail).toHaveBeenCalledTimes(1);
  });

  it("returns 200 with confirmationSent: false when guest email sending fails", async () => {
    // First call (team email) succeeds
    vi.mocked(mailModule.sendMail).mockResolvedValueOnce(undefined);
    // Second call (guest email) fails
    vi.mocked(mailModule.sendMail).mockRejectedValueOnce(
      new Error("Guest inbox unavailable")
    );

    const req = createJsonRequest(makeValidBody());
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.reference).toBeDefined();
    expect(data.confirmationSent).toBe(false);

    expect(mailModule.sendMail).toHaveBeenCalledTimes(2);
  });

  it("success: calls mail transport exactly twice and returns 200 with confirmationSent: true", async () => {
    vi.mocked(mailModule.sendMail).mockResolvedValue(undefined);

    const validBody = makeValidBody();
    const req = createJsonRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.reference).toMatch(/^KZ-\d{6}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/);
    expect(data.confirmationSent).toBe(true);

    expect(mailModule.sendMail).toHaveBeenCalledTimes(2);

    // Call 1: to booking inbox, replyTo is guest
    const teamCall = vi.mocked(mailModule.sendMail).mock.calls[0][0];
    expect(teamCall.to).toBe("bookings@kaizentravel.com");
    expect(teamCall.replyTo).toBe(validBody.email);

    // Call 2: to guest
    const guestCall = vi.mocked(mailModule.sendMail).mock.calls[1][0];
    expect(guestCall.to).toBe(validBody.email);
  });

  it("ignores forged prices or totals in request body and recomputes only from ids", async () => {
    vi.mocked(mailModule.sendMail).mockResolvedValue(undefined);

    const forgedBody = {
      ...makeValidBody(),
      total: 0.01,
      totalUsd: 1,
      prices: { "destination-a": 0, "activity-a": 0 },
    };

    const req = createJsonRequest(forgedBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mailModule.sendMail).toHaveBeenCalledTimes(2);

    const teamCall = vi.mocked(mailModule.sendMail).mock.calls[0][0];
    // Must not contain forged $0.01 or $1 totals
    expect(teamCall.text).not.toContain("$0.01");
  });
});
