import { NextRequest, NextResponse } from "next/server";
import {
  validateRequest,
  computeRequestSummary,
  makeReference,
} from "@/lib/request";
import { buildTeamEmail, buildGuestEmail } from "@/lib/emails";
import { sendMail, getBookingEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Maximum allowed payload size (20 KB)
const MAX_BODY_BYTES = 20 * 1024;

// ─── In-memory Rate Limiting ─────────────────────────────────────────────
// Best-effort in-memory rate limit: 5 requests per IP per 10 minutes.
// NOTE: On serverless infrastructure (e.g. Vercel), instances are ephemeral,
// so this rate limiter acts as a best-effort defense layer per instance.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const ipRequestsMap = new Map<string, number[]>();

export function _resetRateLimitForTesting(): void {
  ipRequestsMap.clear();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestsMap.get(ip) || [];

  // Filter out timestamps older than the window
  const validTimestamps = timestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestsMap.set(ip, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  ipRequestsMap.set(ip, validTimestamps);
  return true;
}

// ─── POST Handler ────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // a) Content-Type must be application/json and body under 20 KB
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { error: "Unsupported media type. Request must be application/json." },
      { status: 415 }
    );
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Body must be under 20 KB." },
      { status: 413 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json(
      { error: "Failed to read request body." },
      { status: 400 }
    );
  }

  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload too large. Body must be under 20 KB." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  // b) Same-origin check: if an Origin header exists its host must match request Host
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost =
        req.headers.get("x-forwarded-host") || req.headers.get("host");

      if (!requestHost || originHost !== requestHost) {
        return NextResponse.json(
          { error: "Forbidden origin." },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Forbidden origin." },
        { status: 403 }
      );
    }
  }

  // c) Best-effort in-memory rate limit: 5 requests per IP per 10 minutes
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait a few minutes before trying again or message us on WhatsApp.",
      },
      { status: 429 }
    );
  }

  // d) Honeypot: if "website" is non-empty, or submitted < 3 seconds after openedAt
  const rawObj =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const isHoneypotTriggered =
    (typeof rawObj.website === "string" && rawObj.website.trim().length > 0) ||
    (typeof rawObj.openedAt === "number" &&
      Date.now() - rawObj.openedAt < 3000);

  if (isHoneypotTriggered) {
    // Return normal 200 success WITHOUT sending anything
    const dummyRef = makeReference();
    return NextResponse.json(
      { ok: true, reference: dummyRef, confirmationSent: true },
      { status: 200 }
    );
  }

  // e) validateRequest (400 with errors map)
  const validation = validateRequest(body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    );
  }

  const payload = validation.data;

  // f) computeRequestSummary, makeReference
  const summary = computeRequestSummary(payload);
  const reference = makeReference();

  // g) Send the TEAM email first and await it
  const teamEmail = buildTeamEmail(summary, payload, reference);

  try {
    const bookingInbox = getBookingEmail();
    await sendMail({
      to: bookingInbox,
      replyTo: payload.email,
      subject: teamEmail.subject,
      text: teamEmail.text,
      html: teamEmail.html,
    });
  } catch (err: unknown) {
    const errorCode =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code: unknown }).code)
        : "TEAM_MAIL_FAIL";
    // Never log personal info. Only reference and error code.
    console.error(`[REQUEST_ERR] Ref: ${reference}, Code: ${errorCode}`);

    return NextResponse.json(
      {
        error:
          "We could not send your request. Please try again or message us on WhatsApp.",
      },
      { status: 500 }
    );
  }

  // h) Then send the GUEST confirmation and await it
  const guestEmail = buildGuestEmail(summary, payload, reference);
  let confirmationSent = false;

  try {
    await sendMail({
      to: payload.email,
      subject: guestEmail.subject,
      text: guestEmail.text,
      html: guestEmail.html,
    });
    confirmationSent = true;
  } catch (err: unknown) {
    const errorCode =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code: unknown }).code)
        : "GUEST_MAIL_FAIL";
    // Log reference and error code only
    console.error(`[REQUEST_WARN] Ref: ${reference}, Code: ${errorCode}`);
    confirmationSent = false;
  }

  return NextResponse.json(
    {
      ok: true,
      reference,
      confirmationSent,
    },
    { status: 200 }
  );
}

