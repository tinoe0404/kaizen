"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTrip } from "./TripProvider";
import { RequestForm } from "./RequestForm";
import { getAll } from "@/lib/content";
import { Category, Offering } from "@/content/types";
import { currencies, Currency, ratesUpdated } from "@/content/currency";
import { formatCurrencyAmount } from "@/lib/pricing";
import { offeringHref } from "@/lib/routes";
import { normalizeWhatsappNumber, buildTripMessage } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { OfferingCard } from "@/components/OfferingCard";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "destination", label: "Destinations" },
  { key: "activity", label: "Activities" },
  { key: "lodge", label: "Lodges" },
  { key: "vehicle", label: "Vehicle hire" },
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

  const [activeCategory, setActiveCategory] = useState<Category>("destination");

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

  const categoryOfferings: Offering[] = getAll(activeCategory);

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
            Pick your destinations, activities, lodges and vehicle. See your
            estimate in your preferred currency and send one combined request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Offerings & Preferences (7 cols) ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Dates & Guests Control Panel */}
            <div className="bg-sand/40 border border-sand rounded-[12px] p-5 sm:p-6 space-y-5">
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

            {/* Category Filter Pills */}
            <div>
              <div
                role="tablist"
                aria-label="Offerings categories"
                className="flex flex-wrap gap-2 mb-6"
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
                      className={`min-h-[44px] px-4 py-2 rounded-[8px] font-heading font-semibold text-sm transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
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

              {/* Offerings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {categoryOfferings.map((offering) => (
                  <OfferingCard
                    key={offering.id}
                    offering={offering}
                    headingLevel="h3"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Sticky Summary Panel (5 cols) ── */}
          <div className="lg:col-span-5">
            <div id="trip-summary" className="bg-white border border-sand rounded-[14px] p-6 lg:sticky lg:top-24 shadow-sm">
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
                    Your trip is empty. Explore our destinations, activities,
                    lodges and vehicle hire to add them to your trip.
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

