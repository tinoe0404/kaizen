"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTrip } from "./TripProvider";
import { validateRequest, RequestPayload } from "@/lib/request";
import { trackEvent } from "@/lib/analytics";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { buildBookingConfirmationMessage, whatsappLink } from "@/lib/whatsapp";

interface SuccessInfo {
  reference: string;
  confirmationSent: boolean;
  whatsappUrl: string | null;
}

export function RequestForm() {
  const { state, derived, clear } = useTrip();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const openedAtRef = useRef<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // Record openedAt timestamp on mount without re-rendering
  useEffect(() => {
    openedAtRef.current = Date.now();
  }, []);

  // Shift focus to success heading once request succeeds
  useEffect(() => {
    if (successInfo && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [successInfo]);

  // Determine if the trip is incomplete
  const hasItems = state.ids.length > 0;
  const hasDates = Boolean(state.arrival && state.departure);
  const hasValidDates = hasDates && derived.nights > 0 && !derived.dateError;

  let missingReason = "";
  if (!hasItems) {
    missingReason = "Add at least one item";
  } else if (!hasValidDates) {
    missingReason = "Choose your dates";
  }

  const isTripIncomplete = !hasItems || !hasValidDates;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload: RequestPayload = {
      ids: state.ids,
      arrival: state.arrival,
      departure: state.departure,
      guests: state.guests,
      currency: state.currency,
      name,
      email,
      phone,
      message: notes,
      website,
      openedAt: openedAtRef.current,
    };

    // Client-side validation using the same pure validateRequest function
    const validation = validateRequest(payload);
    if (!validation.ok) {
      setFieldErrors(validation.errors);

      // Focus the first invalid field
      if (validation.errors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (validation.errors.email && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (validation.errors.phone && phoneInputRef.current) {
        phoneInputRef.current.focus();
      } else if (validation.errors.message && notesInputRef.current) {
        notesInputRef.current.focus();
      }
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        trackEvent("trip_request_submit", {
          itemCount: state.ids.length,
          currency: state.currency,
        });
      }

      if (!res.ok) {
        if (data.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors);
          setServerError("Please correct the errors in the form.");
        } else {
          setServerError(
            data.error ||
              "We could not send your request. Please try again or message us on WhatsApp."
          );
        }
        return;
      }

      // Generate direct WhatsApp link with the submitted booking details
      const whatsappMsg = buildBookingConfirmationMessage({
        reference: data.reference,
        name,
        email,
        phone,
        message: notes,
        trip: state,
        derived,
      });
      const whatsappUrl = whatsappLink(whatsappMsg);

      // Auto-open WhatsApp handoff
      if (whatsappUrl && typeof window !== "undefined") {
        try {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        } catch {
          // Silently handle if popup is blocked
        }
      }

      // Success
      setSuccessInfo({
        reference: data.reference,
        confirmationSent: data.confirmationSent,
        whatsappUrl,
      });

      // Clear the trip state
      clear();
    } catch {
      setServerError(
        "A network error occurred. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Panel ───────────────────────────────────────────────────────
  if (successInfo) {
    return (
      <div
        className="rounded-[8px] bg-sand/60 border border-sand p-6 text-ink animate-in fade-in duration-200"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-heading font-bold text-2xl text-forest focus:outline-none"
          >
            Request sent
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-xs tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
            STEP 2 OF 2: WHATSAPP CONFIRMATION REQUIRED
          </span>
        </div>

        <div className="font-heading font-semibold text-lg text-ink mb-3">
          Provisional Reference: <span className="text-sun font-bold">{successInfo.reference}</span>
        </div>
        <p className="text-base text-ink mb-4 leading-relaxed">
          Your trip request has been logged. To protect availability and confirm your booking with our local safari guides and lodges, <strong>you must confirm your request via WhatsApp</strong>.
        </p>

        {successInfo.whatsappUrl && (
          <div className="bg-white border-2 border-[#25D366] rounded-[8px] p-5 mb-4 shadow-md">
            <div className="flex items-start gap-2.5 mb-2">
              <span className="text-2xl shrink-0" aria-hidden="true">📲</span>
              <div>
                <h3 className="font-heading font-bold text-base text-forest">
                  Action Required: Send WhatsApp Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-ink/80 mt-1 leading-relaxed">
                  Sending your booking details to our official WhatsApp ({site.whatsappNumber}) is <strong>mandatory</strong> to lock in availability.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-[6px] text-xs text-amber-900 mb-4">
              ⏰ <strong>24-Hour Expiration:</strong> Provisional holds are kept for 24 hours. Unconfirmed email requests are automatically released.
            </div>

            <a
              href={successInfo.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white font-heading font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all select-none text-center cursor-pointer"
            >
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Complete Booking on WhatsApp
            </a>
            <p className="text-center text-xs text-ink/60 mt-2">
              Opens WhatsApp with your booking reference #{successInfo.reference} pre-loaded. Simply tap Send!
            </p>
          </div>
        )}

        {!successInfo.confirmationSent && (
          <div className="p-3 bg-bone rounded-[6px] border border-ink/10 text-sm text-ink/80 mb-4 leading-normal">
            We could not email you a confirmation, but your provisional reference is saved. Please ensure you tap above to complete your booking on WhatsApp.
          </div>
        )}

        <div className="pt-2 border-t border-ink/10 text-sm text-ink/70">
          Direct WhatsApp operations line:{" "}
          <span className="font-semibold text-forest">{site.whatsappNumber}</span>
        </div>
      </div>
    );
  }

  // ─── Form View ───────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border border-red-200 rounded-[8px] text-red-900 text-sm font-medium"
        >
          {serverError}
        </div>
      )}

      {/* Honeypot field (hidden from sighted users and screen readers) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="request-website">Website</label>
        <input
          id="request-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="request-name"
          className="block font-heading font-semibold text-sm text-ink mb-1"
        >
          Name <span className="text-forest">*</span>
        </label>
        <input
          ref={nameInputRef}
          id="request-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors((prev) => ({ ...prev, name: "" }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
          className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
            fieldErrors.name ? "border-red-600 bg-red-50/20" : "border-ink/20"
          }`}
        />
        {fieldErrors.name && (
          <p id="name-error" className="text-red-700 text-sm mt-1">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="request-email"
          className="block font-heading font-semibold text-sm text-ink mb-1"
        >
          Email <span className="text-forest">*</span>
        </label>
        <input
          ref={emailInputRef}
          id="request-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
          className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
            fieldErrors.email ? "border-red-600 bg-red-50/20" : "border-ink/20"
          }`}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-red-700 text-sm mt-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* WhatsApp Phone Number (Required) */}
      <div>
        <label
          htmlFor="request-phone"
          className="block font-heading font-semibold text-sm text-ink mb-1"
        >
          WhatsApp Phone Number <span className="text-forest">*</span>
        </label>
        <p className="text-xs text-ink/65 mb-1.5">
          Required with country code (e.g. +263 71 ... or +1 ...). Bookings must be confirmed via WhatsApp to lock in dates.
        </p>
        <input
          ref={phoneInputRef}
          id="request-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="+263 71 234 5678"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (fieldErrors.phone) {
              setFieldErrors((prev) => ({ ...prev, phone: "" }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
          className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
            fieldErrors.phone ? "border-red-600 bg-red-50/20" : "border-ink/20"
          }`}
        />
        {fieldErrors.phone && (
          <p id="phone-error" className="text-red-700 text-sm mt-1">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      {/* Notes / Message */}
      <div>
        <label
          htmlFor="request-notes"
          className="block font-heading font-semibold text-sm text-ink mb-1"
        >
          Notes <span className="font-normal text-ink/60">(optional)</span>
        </label>
        <textarea
          ref={notesInputRef}
          id="request-notes"
          name="notes"
          rows={4}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (fieldErrors.message) {
              setFieldErrors((prev) => ({ ...prev, message: "" }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "notes-error" : undefined}
          style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
          className={`w-full px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors resize-y ${
            fieldErrors.message
              ? "border-red-600 bg-red-50/20"
              : "border-ink/20"
          }`}
        />
        {fieldErrors.message && (
          <p id="notes-error" className="text-red-700 text-sm mt-1">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Privacy Line */}
      <p className="text-sm text-ink/60 leading-normal">
        {site.privacyNotice || "We use your details only to answer this request."}{" "}
        <Link
          href="/privacy"
          className="underline hover:text-forest focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
        >
          Read our privacy notice.
        </Link>
      </p>

      {/* Submit Button & Incomplete Trip Hint */}
      <div>
        <Button
          variant="primary"
          type="submit"
          disabled={isTripIncomplete || isSubmitting}
          aria-busy={isSubmitting}
          className="w-full justify-center text-base min-h-[48px] py-3"
        >
          {isSubmitting ? "Sending..." : "Send booking request"}
        </Button>

        {isTripIncomplete && missingReason && (
          <p className="text-sm text-center text-ink/60 mt-2 font-medium">
            {missingReason}
          </p>
        )}
      </div>
    </form>
  );
}
