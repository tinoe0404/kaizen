"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTrip } from "./TripProvider";
import { RequestForm } from "./RequestForm";
import { getAll, getById } from "@/lib/content";
import { Offering } from "@/content/types";
import { currencies, Currency, ratesUpdated } from "@/content/currency";
import { formatCurrencyAmount } from "@/lib/pricing";
import { offeringHref } from "@/lib/routes";
import { normalizeWhatsappNumber, buildTripMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { OfferingCard } from "@/components/OfferingCard";
import { AddToTripButton } from "@/components/trip/AddToTripButton";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface TransferMetaItem {
  icon: string;
  badge: string;
  pickup: string;
  dropoff: string;
  rates: { label: string; price: string }[];
  features: string[];
}

const TRANSFER_META: Record<string, TransferMetaItem> = {
  "vehicle-vic-falls-airport": {
    icon: "✈️",
    badge: "Airport Meet & Greet",
    pickup: "Victoria Falls Airport (VFA)",
    dropoff: "Victoria Falls Town / Lodges",
    rates: [
      { label: "Private Taxi (1–4 pax)", price: "$30 / vehicle" },
      { label: "Private Taxi (5–7 pax)", price: "$40 / vehicle" },
      { label: "Shared Shuttle", price: "$15 / person (min 2)" },
      { label: "Group Bus (15+ pax)", price: "$120 / bus" },
    ],
    features: ["Live Flight Tracking", "Meet & Greet", "Luggage Assist", "A/C Comfort"],
  },
  "vehicle-inter-hotel": {
    icon: "🚕",
    badge: "Town & Dining Taxis",
    pickup: "Your Lodge / Hotel",
    dropoff: "Town Center, Rainforest Gate, Lookout Café, Boma",
    rates: [
      { label: "Lodges to Town (1–4 pax)", price: "$5 / vehicle" },
      { label: "To Lookout / Border / Boma (1–4 pax)", price: "$7 / vehicle" },
      { label: "To Lookout / Border / Boma (5–7 pax)", price: "$10 / vehicle" },
      { label: "To A'Zambezi / Safari Lodge", price: "$10 / vehicle" },
      { label: "Shared Shuttle", price: "$6 / person (min 3)" },
      { label: "Group Bus (15+ pax)", price: "$60 / bus" },
    ],
    features: ["On-Demand Dispatch", "All Lodges Covered", "Door-to-Door"],
  },
  "vehicle-livingstone": {
    icon: "🇿🇲",
    badge: "Cross-Border Zambia",
    pickup: "Victoria Falls (Zimbabwe)",
    dropoff: "Livingstone Town & Airport (LVI)",
    rates: [
      { label: "Private Taxi to Town (1–4 pax)", price: "$40 / vehicle" },
      { label: "Private Taxi to Airport (1–4 pax)", price: "$60 / vehicle" },
      { label: "Shared Shuttle", price: "$20 / person (min 4)" },
    ],
    features: ["Victoria Falls Bridge Crossing", "Immigration Assistance", "Air-Conditioned"],
  },
  "vehicle-kasane-chobe": {
    icon: "🇧🇼",
    badge: "Cross-Border Botswana",
    pickup: "Victoria Falls (Zimbabwe)",
    dropoff: "Kazungula Border / Kasane Town & Chobe Lodges",
    rates: [
      { label: "Private Taxi to Kazungula (1–4 pax)", price: "$80 / vehicle" },
      { label: "Private Taxi to Kasane Town (1–4 pax)", price: "$120 / vehicle" },
      { label: "Shared Shuttle to Kazungula", price: "$25 / person (min 4)" },
      { label: "Shared Shuttle to Kasane Town", price: "$35 / person (min 4)" },
      { label: "Group Bus to Kazungula (15+ pax)", price: "$230 / bus" },
      { label: "Group Bus to Kasane Town (15+ pax)", price: "$420 / bus" },
    ],
    features: ["Chobe Safari Gateway", "Kazungula Clearance Support", "Luggage Handling"],
  },
  "vehicle-hwange": {
    icon: "🐘",
    badge: "Safari Highway Shuttle",
    pickup: "Victoria Falls",
    dropoff: "Hwange National Park Safari Lodges",
    rates: [
      { label: "Shared Shuttle Rack Rate", price: "$60 / person (min 4)" },
      { label: "Group Bus Charter (15+ pax)", price: "$600 / bus" },
    ],
    features: ["2.5hr Highway Drive", "Complimentary Water", "Spacious Minibus"],
  },
  "vehicle-private-chauffeur": {
    icon: "🚐",
    badge: "Full-Day Charter",
    pickup: "Your Accommodation",
    dropoff: "Custom Full-Day Itinerary (Unlimited Local Mileage)",
    rates: [
      { label: "Full Day Private Charter (up to 10 pax)", price: "$150 / day" },
    ],
    features: ["Dedicated Driver-Guide", "Flexible Day Itinerary", "Fuel & Water Included"],
  },
};

const TRANSFER_MATRIX_ROWS = [
  { route: "Victoria Falls Airport Transfer", type: "Per Bus (15+ Pax)", rate: "$120.00 / bus", id: "vehicle-vic-falls-airport" },
  { route: "Inter-Hotel Transfer", type: "Per Bus (15+ Pax)", rate: "$60.00 / bus", id: "vehicle-inter-hotel" },
  { route: "Kazungula Border Transfer", type: "Per Bus (15+ Pax)", rate: "$230.00 / bus", id: "vehicle-kasane-chobe" },
  { route: "Kasane Transfer (Botswana)", type: "Per Bus (15+ Pax)", rate: "$420.00 / bus", id: "vehicle-kasane-chobe" },
  { route: "Hwange National Park Transfer", type: "Per Bus (15+ Pax)", rate: "$600.00 / bus", id: "vehicle-hwange" },
  { route: "Victoria Falls Airport Shuttle", type: "Per Person (Min 2)", rate: "$15.00 / person", id: "vehicle-vic-falls-airport" },
  { route: "Inter-Hotel Shuttle Transfer", type: "Per Person (Min 3)", rate: "$6.00 / person", id: "vehicle-inter-hotel" },
  { route: "Kazungula Border Shuttle", type: "Per Person (Min 4)", rate: "$25.00 / person", id: "vehicle-kasane-chobe" },
  { route: "Kasane Town Shuttle", type: "Per Person (Min 4)", rate: "$35.00 / person", id: "vehicle-kasane-chobe" },
  { route: "Hwange National Park Shuttle", type: "Per Person (Min 4)", rate: "$60.00 / person", id: "vehicle-hwange" },
  { route: "Livingstone Airport Shuttle (Zambia)", type: "Per Person (Min 4)", rate: "$20.00 / person", id: "vehicle-livingstone" },
  { route: "VF Airport to Town Taxi", type: "Private Taxi (1–4 Pax)", rate: "$30.00 / vehicle", id: "vehicle-vic-falls-airport" },
  { route: "VF Airport to Town Taxi", type: "Private Taxi (5–7 Pax)", rate: "$40.00 / vehicle", id: "vehicle-vic-falls-airport" },
  { route: "Lodges to Town Transfer", type: "Private Taxi (1–4 Pax)", rate: "$5.00 / vehicle", id: "vehicle-inter-hotel" },
  { route: "Lodges to Border / Lookout / Boma", type: "Private Taxi (1–4 Pax)", rate: "$7.00 / vehicle", id: "vehicle-inter-hotel" },
  { route: "Lodges to Border / Lookout / Boma", type: "Private Taxi (5–7 Pax)", rate: "$10.00 / vehicle", id: "vehicle-inter-hotel" },
  { route: "Lodges to A'Zambezi / Safari Lodge", type: "Private Taxi (1–4 Pax)", rate: "$10.00 / vehicle", id: "vehicle-inter-hotel" },
  { route: "Victoria Falls to Kazungula Border", type: "Private Taxi (1–4 Pax)", rate: "$80.00 / vehicle", id: "vehicle-kasane-chobe" },
  { route: "Victoria Falls to Kasane Town", type: "Private Taxi (1–4 Pax)", rate: "$120.00 / vehicle", id: "vehicle-kasane-chobe" },
  { route: "VF to Livingstone Town (Zambia)", type: "Private Taxi (1–4 Pax)", rate: "$40.00 / vehicle", id: "vehicle-livingstone" },
  { route: "VF to Livingstone Airport (Zambia)", type: "Private Taxi (1–4 Pax)", rate: "$60.00 / vehicle", id: "vehicle-livingstone" },
  { route: "Full-Day Chauffeur Safari Vehicle", type: "Private Charter (Up to 10 Pax)", rate: "$150.00 / day", id: "vehicle-private-chauffeur" },
];

const CATEGORIES: { key: "activity" | "lodge" | "vehicle"; label: string }[] = [
  { key: "activity", label: "Activities" },
  { key: "lodge", label: "Lodges & Stays" },
  { key: "vehicle", label: "Transfers" },
];

export function TripBuilder() {
  const {
    state,
    derived,
    isReady,
    add,
    remove,
    setDates,
    setGuests,
    setCurrency,
    clear,
  } = useTrip();

  const [activeCategory, setActiveCategory] = useState<
    "activity" | "lodge" | "vehicle"
  >("activity");
  const [transfersViewMode, setTransfersViewMode] = useState<"cards" | "matrix">("matrix");
  const [selectedDestination, setSelectedDestination] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("destination") || "all";
    }
    return "all";
  });

  // Handle ?add=<id> in URL
  useEffect(() => {
    if (typeof window === "undefined" || !isReady) return;
    const params = new URLSearchParams(window.location.search);
    const addId = params.get("add");
    if (addId) {
      add(addId);
      const url = new URL(window.location.href);
      url.searchParams.delete("add");
      const cleanUrl = url.pathname + (url.search ? url.search : "");
      window.history.replaceState({}, "", cleanUrl);
    }
  }, [isReady, add]);

  const destinations = getAll("destination");
  const allCategoryOfferings: Offering[] = getAll(activeCategory);
  const categoryOfferings: Offering[] =
    selectedDestination === "all" || activeCategory === "vehicle"
      ? allCategoryOfferings
      : allCategoryOfferings.filter(
          (item) => item.destinationSlug === selectedDestination
        );

  // Compute minimum date for arrival (today in local ISO)
  const todayIso = new Date().toISOString().split("T")[0];
  const minDeparture = state.arrival || todayIso;

  return (
    <Section className="py-8 md:py-12">
      <Container>
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-ink">
            Build your trip
          </h1>
          <p className="mt-2 text-ink/75 max-w-2xl text-base md:text-lg">
            Pick your activities, lodges, and transfers. Filter by destination,
            see your estimate in your preferred currency and send one combined request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Offerings & Preferences (7 cols) ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Dates & Guests Control Panel */}
            <div className="bg-sand/40 border border-sand rounded-[12px] p-4 sm:p-6 space-y-4 sm:space-y-5">
              <h2 className="font-heading font-semibold text-lg text-ink">
                Dates and group size
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="trip-arrival"
                    className="block font-heading font-semibold text-sm text-ink/80 uppercase tracking-wide mb-1"
                  >
                    Arrival Date
                  </label>
                  <input
                    id="trip-arrival"
                    type="date"
                    min={todayIso}
                    value={state.arrival}
                    onChange={(e) => setDates(e.target.value, state.departure)}
                    style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
                    className="w-full min-h-[48px] h-[48px] px-3.5 py-2.5 rounded-[8px] bg-white border border-ink/20 font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div>
                  <label
                    htmlFor="trip-departure"
                    className="block font-heading font-semibold text-sm text-ink/80 uppercase tracking-wide mb-1"
                  >
                    Departure Date
                  </label>
                  <input
                    id="trip-departure"
                    type="date"
                    min={minDeparture}
                    value={state.departure}
                    onChange={(e) => setDates(state.arrival, e.target.value)}
                    style={{ scrollMarginBottom: "calc(var(--trip-bar-h, 0px) + 16px)" }}
                    className="w-full min-h-[48px] h-[48px] px-3.5 py-2.5 rounded-[8px] bg-white border border-ink/20 font-body text-base text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
              </div>

              {derived.dateError && (
                <p role="alert" className="text-red-700 text-sm font-medium">
                  {derived.dateError}
                </p>
              )}

              {derived.needsDates && !derived.dateError && (
                <p className="text-sm text-forest font-medium">
                  Some selected items require trip dates to calculate an
                  accurate price.
                </p>
              )}

              {/* Guest Stepper */}
              <div className="pt-2 border-t border-ink/10 flex items-center justify-between">
                <div>
                  <span className="block font-heading font-semibold text-base text-ink">
                    Guests
                  </span>
                  <span className="text-sm text-ink/65">
                    1 to 30 travelers
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests(state.guests - 1)}
                    disabled={state.guests <= 1}
                    aria-label="Fewer guests"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-[8px] bg-white border border-ink/20 font-heading font-bold text-lg text-ink hover:bg-sand/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    className="w-8 text-center font-heading font-semibold text-lg text-ink"
                  >
                    {state.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests(state.guests + 1)}
                    disabled={state.guests >= 30}
                    aria-label="More guests"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-[8px] bg-white border border-ink/20 font-heading font-bold text-lg text-ink hover:bg-sand/60 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div>
              <div
                role="tablist"
                aria-label="Offerings categories"
                className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 mb-4"
              >
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`min-h-[44px] px-2 sm:px-4 py-2 rounded-[8px] font-heading font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-center flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                        isActive
                          ? "bg-forest text-bone"
                          : "bg-white border border-ink/20 text-ink/80 hover:bg-sand/50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Destination filter sub-bar for Activities & Lodges */}
              {activeCategory !== "vehicle" && (
                <div className="flex flex-col gap-2 mb-6 p-3 sm:p-4 rounded-[12px] bg-sand/30 border border-sand">
                  <div className="flex items-center justify-between text-xs font-heading">
                    <span className="font-semibold uppercase tracking-wider text-ink/70">
                      Filter by destination:
                    </span>
                    {selectedDestination !== "all" && (
                      <button
                        type="button"
                        onClick={() => setSelectedDestination("all")}
                        className="text-forest hover:underline font-medium min-h-[32px] inline-flex items-center cursor-pointer"
                      >
                        Show all ({allCategoryOfferings.length})
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedDestination("all")}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-colors cursor-pointer shrink-0 ${
                        selectedDestination === "all"
                          ? "bg-forest text-bone shadow-xs"
                          : "bg-white border border-sand text-ink/80 hover:bg-sand/60"
                      }`}
                    >
                      All ({allCategoryOfferings.length})
                    </button>
                    {destinations.map((dest) => {
                      const count = allCategoryOfferings.filter(
                        (i) => i.destinationSlug === dest.slug
                      ).length;
                      if (count === 0) return null;
                      const isSel = selectedDestination === dest.slug;
                      return (
                        <button
                          key={dest.slug}
                          type="button"
                          onClick={() => setSelectedDestination(dest.slug)}
                          className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-colors cursor-pointer shrink-0 ${
                            isSel
                              ? "bg-forest text-bone shadow-xs"
                              : "bg-white border border-sand text-ink/80 hover:bg-sand/60"
                          }`}
                        >
                          {dest.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Transfer Header Bar */}
              {activeCategory === "vehicle" && (
                <div className="mb-6 p-4 rounded-[12px] bg-sand/40 border border-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest/15 text-forest">
                        Official Rate Sheet
                      </span>
                      <span className="text-xs text-ink/60 font-heading">
                        2025/2026 Season
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink/80 mt-1 font-body">
                      Fixed pricing for private taxis, shared airport shuttles, cross-border transfers & group buses.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTransfersViewMode(transfersViewMode === "cards" ? "matrix" : "cards")}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold bg-white border border-sand hover:bg-forest hover:text-bone text-forest transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {transfersViewMode === "cards" ? (
                      <>
                        <span>📋</span> View Rate Sheet Matrix
                      </>
                    ) : (
                      <>
                        <span>🚖</span> View Transfer Cards
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Offerings Grid / Transfers Custom Experience */}
              {activeCategory === "vehicle" && transfersViewMode === "matrix" ? (
                <div className="bg-white border border-sand rounded-[14px] overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-sand bg-sand/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-base text-ink">
                        Official Transfer Rates Matrix
                      </h3>
                      <p className="text-xs text-ink/70">
                        Transcribed directly from the Kaizen Travel and Adventures rate sheet.
                      </p>
                    </div>
                  </div>

                  {/* Mobile Compact View (< sm) */}
                  <div className="sm:hidden divide-y divide-sand/60">
                    {TRANSFER_MATRIX_ROWS.map((row, idx) => {
                      const validId = getById(row.id) ? row.id : (categoryOfferings[0]?.id || row.id);
                      return (
                        <div key={`m-${row.route}-${idx}`} className="p-3.5 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-heading font-semibold text-xs text-ink truncate">{row.route}</p>
                            <p className="text-[11px] text-ink/70 mt-0.5">{row.type}</p>
                            <p className="font-heading font-bold text-xs text-forest mt-1">{row.rate}</p>
                          </div>
                          <div className="shrink-0">
                            <AddToTripButton id={validId} name={row.route} className="text-xs min-h-[36px] py-1 px-3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop / Tablet Table View (>= sm) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-sand/60 text-ink/80 font-heading uppercase tracking-wider border-b border-sand">
                          <th className="py-2.5 px-3 font-semibold">Route</th>
                          <th className="py-2.5 px-3 font-semibold">Service Type</th>
                          <th className="py-2.5 px-3 font-semibold">Rate</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand/60">
                        {TRANSFER_MATRIX_ROWS.map((row, idx) => {
                          const validId = getById(row.id) ? row.id : (categoryOfferings[0]?.id || row.id);
                          return (
                            <tr key={`${row.route}-${idx}`} className="hover:bg-sand/20 transition-colors">
                              <td className="py-2.5 px-3 font-medium text-ink">{row.route}</td>
                              <td className="py-2.5 px-3 text-ink/70">{row.type}</td>
                              <td className="py-2.5 px-3 font-heading font-semibold text-forest">{row.rate}</td>
                              <td className="py-2.5 px-3 text-right">
                                <AddToTripButton id={validId} name={row.route} className="text-xs min-h-[36px] py-1 px-3" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : activeCategory === "vehicle" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {categoryOfferings.map((offering) => {
                    const meta = TRANSFER_META[offering.id];
                    return (
                      <div
                        key={offering.id}
                        className="flex flex-col justify-between bg-white border border-sand rounded-[14px] overflow-hidden shadow-xs hover:border-forest/40 transition-all"
                      >
                        {/* Transit Route Header */}
                        <div className="bg-sand/40 border-b border-sand p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest/10 text-forest">
                              {meta?.badge || "Official Transfer"}
                            </span>
                            <span className="text-xs font-heading font-semibold text-ink/70">
                              Seats up to {offering.capacity || 7}
                            </span>
                          </div>

                          <div className="my-3 p-2.5 rounded-[8px] bg-white border border-sand/80 flex items-center justify-between text-xs text-ink/80 shadow-2xs">
                            <div className="flex items-center gap-1.5 font-medium truncate">
                              <span className="w-2 h-2 rounded-full bg-forest shrink-0" />
                              <span className="truncate">{meta?.pickup || "Victoria Falls"}</span>
                            </div>
                            <span className="text-sun text-sm font-bold shrink-0 px-2">➔</span>
                            <div className="flex items-center gap-1.5 font-medium truncate justify-end">
                              <span className="truncate">{meta?.dropoff || offering.name}</span>
                              <span className="w-2 h-2 rounded-full bg-sun shrink-0" />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink/65 font-medium">
                            {meta?.features.slice(0, 3).map((f) => (
                              <span key={f} className="flex items-center gap-1">
                                <span className="text-forest">✓</span> {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 flex flex-col flex-1">
                          <h3 className="font-heading font-semibold text-lg text-ink hover:text-forest transition-colors">
                            <Link href={offeringHref(offering)}>
                              {offering.name}
                            </Link>
                          </h3>

                          <p className="font-body text-xs sm:text-sm text-ink/75 mt-1.5 line-clamp-2">
                            {offering.summary}
                          </p>

                          {/* Rate Breakdown Table */}
                          <div className="mt-4 pt-3 border-t border-sand/80 space-y-1.5">
                            <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-ink/60 block">
                              Available Rates:
                            </span>
                            <div className="space-y-1">
                              {meta?.rates.map((r) => (
                                <div key={r.label} className="flex items-center justify-between text-xs">
                                  <span className="text-ink/75">{r.label}</span>
                                  <span className="font-heading font-semibold text-forest">{r.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-5 pt-3 border-t border-sand flex items-center gap-2">
                            <AddToTripButton
                              id={offering.id}
                              name={offering.name}
                              className="flex-1"
                            />
                            <Link
                              href={offeringHref(offering)}
                              className="inline-flex items-center justify-center font-heading font-semibold text-xs min-h-[44px] px-3 py-2 rounded-[8px] border border-sand hover:border-forest/40 text-ink/80 hover:text-forest transition-colors"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : categoryOfferings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-[12px] border border-sand">
                  <p className="font-body text-ink/75 text-sm">
                    No {activeCategory === "activity" ? "activities" : "lodges"} found for this destination.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedDestination("all")}
                    className="mt-3 text-sm font-heading font-semibold text-forest hover:underline min-h-[44px] inline-flex items-center cursor-pointer"
                  >
                    View all {activeCategory === "activity" ? "activities" : "lodges"} →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {categoryOfferings.map((offering) => (
                    <OfferingCard
                      key={offering.id}
                      offering={offering}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Sticky Summary Panel (5 cols) ── */}
          <div className="lg:col-span-5">
            <div id="trip-summary" className="bg-white border border-sand rounded-[14px] p-4 sm:p-6 lg:sticky lg:top-24 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-sand">
                <h2 tabIndex={-1} className="font-heading font-bold text-xl text-ink focus:outline-none">
                  Your trip
                </h2>

                {state.ids.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clear()}
                    className="min-h-[44px] inline-flex items-center text-sm font-heading font-semibold text-ink/60 hover:text-red-700 underline focus-visible:outline focus-visible:outline-forest cursor-pointer"
                  >
                    Clear trip
                  </button>
                )}
              </div>

              {/* Currency Selector */}
              <div className="py-4 border-b border-sand">
                <fieldset>
                  <legend className="sr-only">Choose display currency</legend>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-heading font-semibold text-ink/65 uppercase tracking-wide mr-1">
                      Currency:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currencies.map((curr) => {
                        const isSelected = state.currency === curr;
                        return (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => setCurrency(curr as Currency)}
                            aria-pressed={isSelected}
                            className={`min-h-[44px] min-w-[44px] px-3 py-2 text-sm font-heading font-semibold rounded-[6px] transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-sun text-ink shadow-xs"
                                : "bg-bone border border-ink/15 text-ink/80 hover:bg-sand/60"
                            }`}
                          >
                            {curr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </fieldset>
              </div>

              {/* Selected Offerings List */}
              <div className="py-4 min-h-[120px]">
                {!isReady ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-sand/60 rounded w-3/4"></div>
                    <div className="h-4 bg-sand/60 rounded w-1/2"></div>
                  </div>
                ) : derived.lines.length === 0 ? (
                  <p className="text-sm text-ink/60 py-4 text-center">
                    Your trip is empty. Explore our activities, lodges, and transfers
                    on the left, or add a curated safari package.
                  </p>
                ) : (
                  <ul className="space-y-3 divide-y divide-sand/60">
                    {derived.lines.map((line) => {
                      const offeringLink = offeringHref(line.offering);
                      const formattedAmount = formatCurrencyAmount(
                        line.converted,
                        state.currency
                      );
                      return (
                        <li
                          key={line.offering.id}
                          className="pt-3 first:pt-0 flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <Link
                              href={offeringLink}
                              className="font-heading font-semibold text-base text-ink hover:text-forest transition-colors block break-words"
                            >
                              {line.offering.name}
                            </Link>
                            <p className="text-sm text-ink/60 mt-0.5">
                              {line.breakdown}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-heading font-semibold text-base text-ink">
                              {formattedAmount}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(line.offering.id)}
                              aria-label={`Remove ${line.offering.name}`}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-[8px] text-ink/40 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <span aria-hidden="true" className="text-xl leading-none">
                                ×
                              </span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Total & Rates note */}
              <div className="pt-4 pb-2 border-t border-sand">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading font-bold text-base text-ink">
                    Estimated total:
                  </span>
                  <span
                    aria-live="polite"
                    className="font-heading font-bold text-2xl text-sun"
                  >
                    {formatCurrencyAmount(
                      derived.totalConverted,
                      state.currency
                    )}
                  </span>
                </div>
                <p className="text-sm text-ink/50 mt-1 text-right">
                  Rates as of {ratesUpdated}
                </p>
              </div>

              {/* Request Slot for the form */}
              <div id="request-slot" className="mt-6 pt-6 border-t border-sand">
                <RequestForm />
              </div>

              {/* WhatsApp Alternative Action */}
              {normalizeWhatsappNumber(site.whatsappNumber) && (
                <div className="mt-4">
                  <div className="relative my-4 text-center">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-sand" />
                    </div>
                    <span className="relative bg-white px-3 text-sm uppercase tracking-wider font-heading text-ink/50">
                      or
                    </span>
                  </div>

                  {state.ids.length > 0 ? (
                    <WhatsAppLink
                      message={buildTripMessage(state, derived)}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2 shrink-0"
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
                      Send this trip on WhatsApp
                    </WhatsAppLink>
                  ) : (
                    <div>
                      <Button
                        variant="outline"
                        disabled
                        className="w-full justify-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2 shrink-0"
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
                        Send this trip on WhatsApp
                      </Button>
                      <p className="text-sm text-center text-ink/60 mt-1.5 font-medium">
                        Add at least one item
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

