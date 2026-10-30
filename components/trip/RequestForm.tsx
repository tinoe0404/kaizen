"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTrip } from "./TripProvider";
import { validateRequest, RequestPayload } from "@/lib/request";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

interface SuccessInfo {
  reference: string;
  confirmationSent: boolean;
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

      // Success
      setSuccessInfo({
        reference: data.reference,
        confirmationSent: data.confirmationSent,
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
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="font-heading font-bold text-2xl text-forest mb-2 focus:outline-none"
        >
          Request sent
        </h2>
        <div className="font-heading font-semibold text-lg text-ink mb-3">
          Reference: <span className="text-sun font-bold">{successInfo.reference}</span>
        </div>
        <p className="text-base text-ink mb-4 leading-relaxed">
          We will check availability and contact you to confirm the details and payment.
        </p>

        {!successInfo.confirmationSent && (
          <div className="p-3 bg-bone rounded-[6px] border border-ink/10 text-sm text-ink/80 mb-4 leading-normal">
            We could not email you a confirmation, but we did receive your request. Please keep your reference.
          </div>
        )}

        <div className="pt-2 border-t border-ink/10 text-sm text-ink/70">
          Have an urgent question? Message us on WhatsApp:{" "}
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
          className={`w-full px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
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
          className={`w-full px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
            fieldErrors.email ? "border-red-600 bg-red-50/20" : "border-ink/20"
          }`}
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-red-700 text-sm mt-1">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Phone or WhatsApp */}
      <div>
        <label
          htmlFor="request-phone"
          className="block font-heading font-semibold text-sm text-ink mb-1"
        >
          Phone or WhatsApp{" "}
          <span className="font-normal text-ink/60">(optional)</span>
        </label>
        <input
          ref={phoneInputRef}
          id="request-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (fieldErrors.phone) {
              setFieldErrors((prev) => ({ ...prev, phone: "" }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          className={`w-full px-3.5 py-2.5 rounded-[8px] bg-white border font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest transition-colors ${
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
      <p className="text-xs text-ink/60 leading-normal">
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
          className="w-full justify-center text-base py-3"
        >
          {isSubmitting ? "Sending..." : "Send booking request"}
        </Button>

        {isTripIncomplete && missingReason && (
          <p className="text-xs text-center text-ink/60 mt-2 font-medium">
            {missingReason}
          </p>
        )}
      </div>
    </form>
  );
}
