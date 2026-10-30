"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTrip } from "@/components/trip/TripProvider";
import { buildTripMessage, normalizeWhatsappNumber } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { site } from "@/content/site";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const { state, derived, isReady } = useTrip();

  // Hidden on /trip and when number is invalid / placeholder
  if (pathname === "/trip") {
    return null;
  }

  if (!normalizeWhatsappNumber(site.whatsappNumber)) {
    return null;
  }

  const hasItems = isReady && state.ids.length > 0;
  const message = hasItems
    ? buildTripMessage(state, derived)
    : "Hello Kaizen Travel and Adventures, I would like to plan a trip.";

  return (
    <div
      className="fixed right-4 md:right-6 z-40"
      style={{ bottom: "var(--float-bottom, 16px)" }}
    >
      <WhatsAppLink
        message={message}
        aria-label="Chat on WhatsApp"
        className="inline-flex items-center justify-center min-h-[48px] px-4 py-2.5 rounded-full bg-forest text-bone border-2 border-bone font-heading font-semibold text-sm shadow-lg hover:bg-[#163920] active:bg-[#102b18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest transition-colors select-none"
      >
        <svg
          className="w-5 h-5 mr-2 shrink-0"
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
        <span>WhatsApp</span>
      </WhatsAppLink>
    </div>
  );
}

