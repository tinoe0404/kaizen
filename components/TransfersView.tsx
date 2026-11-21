"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Offering } from "@/content/types";
import { AddToTripButton } from "@/components/trip/AddToTripButton";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { offeringHref } from "@/lib/routes";

export interface TransfersViewProps {
  items: Offering[];
}

type TabType = "all" | "taxi" | "shuttle" | "bus" | "table";

interface RateRow {
  route: string;
  category: "Group (15+ Pax)" | "Per Person (Rack)" | "Taxi (Per Vehicle)";
  type: string;
  rackRate: string;
  netRate?: string;
  minPax?: string;
  capacity?: string;
  offeringId?: string;
}

const ALL_RATES: RateRow[] = [
  // 1. Group Rates --- 15 Passengers and Above (Per Bus)
  {
    route: "Victoria Falls Airport Transfer",
    category: "Group (15+ Pax)",
    type: "Per Bus (15+ Pax)",
    rackRate: "$120.00 / bus",
    netRate: "$120.00",
    minPax: "15 pax",
    capacity: "15–30 Pax Bus",
    offeringId: "vehicle-vic-falls-airport",
  },
  {
    route: "Inter-Hotel Transfer",
    category: "Group (15+ Pax)",
    type: "Per Bus (15+ Pax)",
    rackRate: "$60.00 / bus",
    netRate: "$60.00",
    minPax: "15 pax",
    capacity: "15–30 Pax Bus",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Kazungula Border Transfer",
    category: "Group (15+ Pax)",
    type: "Per Bus (15+ Pax)",
    rackRate: "$230.00 / bus",
    netRate: "$230.00",
    minPax: "15 pax",
    capacity: "15–30 Pax Bus",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Kasane Transfer (Botswana)",
    category: "Group (15+ Pax)",
    type: "Per Bus (15+ Pax)",
    rackRate: "$420.00 / bus",
    netRate: "$420.00",
    minPax: "15 pax",
    capacity: "15–30 Pax Bus",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Hwange National Park Transfer",
    category: "Group (15+ Pax)",
    type: "Per Bus (15+ Pax)",
    rackRate: "$600.00 / bus",
    netRate: "$600.00",
    minPax: "15 pax",
    capacity: "15–30 Pax Bus",
    offeringId: "vehicle-hwange",
  },

  // 2. Rates Per Person (Shared Shuttles)
  {
    route: "Victoria Falls Airport Shuttle",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$15.00 / person",
    netRate: "$10.00",
    minPax: "Min 2",
    capacity: "Shared Minibus",
    offeringId: "vehicle-vic-falls-airport",
  },
  {
    route: "Inter-Hotel Shuttle Transfer",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$6.00 / person",
    netRate: "$4.00",
    minPax: "Min 3",
    capacity: "Shared Minibus",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Kazungula Border Transfer Shuttle",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$25.00 / person",
    netRate: "$20.00",
    minPax: "Min 4",
    capacity: "Shared Minibus",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Kasane Town Shuttle (Botswana)",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$35.00 / person",
    netRate: "$35.00",
    minPax: "Min 4",
    capacity: "Shared Minibus",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Hwange National Park Shuttle",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$60.00 / person",
    netRate: "$50.00",
    minPax: "Min 4",
    capacity: "Shared Minibus",
    offeringId: "vehicle-hwange",
  },
  {
    route: "Livingstone Airport Shuttle (Zambia)",
    category: "Per Person (Rack)",
    type: "Per Person Shuttle",
    rackRate: "$20.00 / person",
    netRate: "$15.00",
    minPax: "Min 4",
    capacity: "Shared Minibus",
    offeringId: "vehicle-livingstone",
  },

  // 3. Taxi Rates (Per Vehicle)
  {
    route: "Victoria Falls Airport to Town Transfer",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$30.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-vic-falls-airport",
  },
  {
    route: "Victoria Falls Airport to Town Transfer",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (5–7 Pax)",
    rackRate: "$40.00 / vehicle",
    capacity: "5–7 Passengers",
    minPax: "5–7",
    offeringId: "vehicle-vic-falls-airport",
  },
  {
    route: "Lodges to Town Transfer",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$5.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Lodges to Border / The Lookout Café / Boma / Baines",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$7.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Lodges to Border / The Lookout Café / Boma / Baines",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (5–7 Pax)",
    rackRate: "$10.00 / vehicle",
    capacity: "5–7 Passengers",
    minPax: "5–7",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Lodges to A'Zambezi / Crocodile Farm / Safari Lodge",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$10.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-inter-hotel",
  },
  {
    route: "Victoria Falls to Kazungula Border (Botswana)",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$80.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Victoria Falls to Kasane Town (Botswana)",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$120.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-kasane-chobe",
  },
  {
    route: "Victoria Falls to Livingstone Town Transfer (Zambia)",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$40.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-livingstone",
  },
  {
    route: "Victoria Falls to Livingstone Airport Transfer (Zambia)",
    category: "Taxi (Per Vehicle)",
    type: "Private Taxi (1–4 Pax)",
    rackRate: "$60.00 / vehicle",
    capacity: "1–4 Passengers",
    minPax: "1–4",
    offeringId: "vehicle-livingstone",
  },
];

export function TransfersView({ items }: TransfersViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("table");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRates = useMemo(() => {
    return ALL_RATES.filter((rate) => {
      const matchesSearch =
        searchQuery === "" ||
        rate.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.type.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === "taxi") return rate.category === "Taxi (Per Vehicle)";
      if (activeTab === "shuttle") return rate.category === "Per Person (Rack)";
      if (activeTab === "bus") return rate.category === "Group (15+ Pax)";
      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full flex flex-col">
      {/* ── Top Hero Banner ── */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <div className="max-w-3xl">
            <span className="font-heading font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase text-forest/80 mb-2 block">
              Kaizen Chauffeur & Transfer Services
            </span>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
              Victoria Falls Transfers & Taxis
            </h1>
            <p className="font-body text-ink/80 text-base sm:text-lg mt-3 leading-relaxed">
              Punctual airport meet & greet, cross-border shuttles connecting Zimbabwe, Botswana & Zambia, and reliable local lodge taxis. Clean, air-conditioned vehicles with professional licensed drivers.
            </p>

            {/* Quick Service Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-forest/10">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-forest">
                <span className="text-sun text-base">✈️</span> Flight Tracking
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-forest">
                <span className="text-sun text-base">🛂</span> Border Assistance
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-forest">
                <span className="text-sun text-base">❄️</span> Air-Conditioned
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-heading font-semibold text-forest">
                <span className="text-sun text-base">⚡</span> Direct WhatsApp
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Filter Tabs & Service View ── */}
      <Section className="bg-bone py-10 md:py-14">
        <Container>
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Transfer Service Types">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-forest text-bone shadow-sm"
                    : "bg-white border border-sand text-ink/80 hover:bg-white/80"
                }`}
              >
                All Transfers ({ALL_RATES.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "taxi"}
                onClick={() => setActiveTab("taxi")}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all cursor-pointer ${
                  activeTab === "taxi"
                    ? "bg-forest text-bone shadow-sm"
                    : "bg-white border border-sand text-ink/80 hover:bg-white/80"
                }`}
              >
                🚕 Private Taxis (Per Vehicle)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "shuttle"}
                onClick={() => setActiveTab("shuttle")}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all cursor-pointer ${
                  activeTab === "shuttle"
                    ? "bg-forest text-bone shadow-sm"
                    : "bg-white border border-sand text-ink/80 hover:bg-white/80"
                }`}
              >
                🚐 Shared Shuttles (Per Person)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "bus"}
                onClick={() => setActiveTab("bus")}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all cursor-pointer ${
                  activeTab === "bus"
                    ? "bg-forest text-bone shadow-sm"
                    : "bg-white border border-sand text-ink/80 hover:bg-white/80"
                }`}
              >
                🚌 Group Buses (15+ Pax)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "table"}
                onClick={() => setActiveTab("table")}
                className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all cursor-pointer ${
                  activeTab === "table"
                    ? "bg-forest text-bone shadow-sm"
                    : "bg-white border border-sand text-ink/80 hover:bg-white/80"
                }`}
              >
                📋 Rate Sheet Matrix
              </button>
            </div>

            {/* Quick Search */}
            <div className="w-full md:w-72">
              <label htmlFor="transfer-search" className="sr-only">Search transfer routes</label>
              <div className="relative">
                <input
                  id="transfer-search"
                  type="text"
                  placeholder="Search route (e.g. Airport, Kasane)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-full bg-white border border-sand text-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <svg
                  className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── View Mode: Rate Table Matrix ── */}
          {activeTab === "table" ? (
            <div className="bg-white border border-sand rounded-[14px] overflow-hidden shadow-sm">
              <div className="p-4 sm:p-6 border-b border-sand bg-sand/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="font-heading font-semibold text-lg sm:text-xl text-ink">
                    Official 2025/2026 Transfer Rates
                  </h2>
                  <p className="text-xs sm:text-sm text-ink/70">
                    Transcribed directly from the official Kaizen Travel and Adventures rate sheet.
                  </p>
                </div>
                <WhatsAppLink
                  message="Hello Kaizen Travel & Adventures, I would like to inquire about your transfer rates."
                  className="inline-flex items-center text-xs sm:text-sm font-heading font-semibold text-forest hover:underline"
                >
                  Ask about custom group rates →
                </WhatsAppLink>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-sand/60 text-ink/80 font-heading text-xs uppercase tracking-wider border-b border-sand">
                      <th className="py-3 px-4 font-semibold">Route / Destination</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Service Type</th>
                      <th className="py-3 px-4 font-semibold">Rack Rate</th>
                      <th className="py-3 px-4 font-semibold">Min Pax / Cap</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/60">
                    {filteredRates.map((row, idx) => (
                      <tr key={`${row.route}-${row.type}-${idx}`} className="hover:bg-sand/20 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-ink">
                          {row.route}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-forest">
                          <span className="inline-block px-2 py-0.5 rounded bg-forest/10">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-ink/80 text-xs">
                          {row.type}
                        </td>
                        <td className="py-3.5 px-4 font-heading font-bold text-sun text-base whitespace-nowrap">
                          {row.rackRate}
                        </td>
                        <td className="py-3.5 px-4 text-ink/70 text-xs">
                          {row.minPax || row.capacity || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {row.offeringId ? (
                            <AddToTripButton
                              id={row.offeringId}
                              name={row.route}
                              className="text-xs min-h-[36px] py-1 px-3"
                            />
                          ) : (
                            <WhatsAppLink
                              message={`Hello Kaizen, I want to book: ${row.route} (${row.rackRate})`}
                              className="inline-flex items-center justify-center font-heading font-semibold text-xs min-h-[36px] px-3 py-1 rounded bg-[#25D366] text-white hover:bg-[#20bd5a]"
                            >
                              WhatsApp
                            </WhatsAppLink>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ── View Mode: Visual Cards Grid ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRates.map((rate, idx) => {
                const offering = items.find((item) => item.id === rate.offeringId);
                const detailHref = offering ? offeringHref(offering) : "/trip";

                return (
                  <div
                    key={`${rate.route}-${rate.type}-${idx}`}
                    className="flex flex-col justify-between bg-white border border-sand rounded-[14px] p-5 sm:p-6 shadow-sm hover:border-forest/40 transition-all group"
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest/10 text-forest">
                          {rate.category}
                        </span>
                        <span className="text-xs text-ink/60 font-medium">
                          {rate.capacity || rate.minPax}
                        </span>
                      </div>

                      {/* Route Title */}
                      <h2 className="font-heading font-semibold text-lg text-ink group-hover:text-forest transition-colors leading-snug">
                        {rate.route}
                      </h2>

                      {/* Route Path Indicator */}
                      <div className="my-3.5 p-2.5 rounded-[8px] bg-sand/30 border border-sand/60 flex items-center justify-between text-xs text-ink/80">
                        <div className="flex items-center gap-1.5 font-medium truncate">
                          <span className="w-2 h-2 rounded-full bg-forest shrink-0" />
                          <span className="truncate">Victoria Falls Area</span>
                        </div>
                        <span className="text-sun text-sm font-bold shrink-0 px-2">➔</span>
                        <div className="flex items-center gap-1.5 font-medium truncate justify-end">
                          <span className="truncate">{rate.route.replace(" Transfer", "").replace(" Shuttle", "")}</span>
                          <span className="w-2 h-2 rounded-full bg-sun shrink-0" />
                        </div>
                      </div>

                      <p className="text-xs text-ink/70 leading-relaxed mb-4">
                        Service: <strong>{rate.type}</strong>. Punctual private chauffeur or shuttle with meet & greet and luggage assistance.
                      </p>
                    </div>

                    <div>
                      {/* Price Section */}
                      <div className="pt-3 border-t border-sand flex items-baseline justify-between mb-4">
                        <span className="text-xs text-ink/60 font-heading uppercase tracking-wider">
                          Rate
                        </span>
                        <div className="text-right">
                          <span className="font-heading font-bold text-xl text-sun">
                            {rate.rackRate}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {rate.offeringId ? (
                          <AddToTripButton
                            id={rate.offeringId}
                            name={rate.route}
                            className="flex-1"
                          />
                        ) : (
                          <Link
                            href={detailHref}
                            className="flex-1 inline-flex items-center justify-center font-heading font-semibold text-sm min-h-[44px] px-3 py-2 rounded-[8px] bg-forest text-bone hover:bg-forest/90 transition-colors text-center"
                          >
                            View details
                          </Link>
                        )}
                        <WhatsAppLink
                          message={`Hello Kaizen Travel & Adventures, I would like to book: ${rate.route} (${rate.rackRate}).`}
                          aria-label={`Book ${rate.route} on WhatsApp`}
                          className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center rounded-[8px] bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </WhatsAppLink>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredRates.length === 0 && (
            <div className="py-12 text-center bg-white border border-sand rounded-[14px] p-8">
              <p className="font-heading text-lg text-ink font-semibold mb-2">No transfer routes match your filter.</p>
              <p className="text-sm text-ink/70 mb-4">Try clearing your search query or selecting a different tab.</p>
              <button
                type="button"
                onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
                className="inline-flex items-center justify-center font-heading font-semibold text-sm px-4 py-2 rounded-full bg-forest text-bone cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </Container>
      </Section>

      {/* ── Key Transfer Advantages ── */}
      <Section sand className="py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
              Why Book Your Transfers With Kaizen?
            </h2>
            <p className="font-body text-ink/75 text-sm sm:text-base mt-2">
              We eliminate the stress of local taxis, border negotiations, and airport arrivals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-sand rounded-[14px] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xl mb-4">
                ✈️
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                Airport Meet & Greet
              </h3>
              <p className="text-sm text-ink/75 leading-relaxed">
                Your driver waits inside the arrivals terminal holding your name board with complimentary luggage assistance.
              </p>
            </div>

            <div className="bg-white border border-sand rounded-[14px] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xl mb-4">
                🛂
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                Cross-Border Experts
              </h3>
              <p className="text-sm text-ink/75 leading-relaxed">
                Smooth border clearance guidance at Kazungula (Botswana) and Victoria Falls Bridge (Zambia).
              </p>
            </div>

            <div className="bg-white border border-sand rounded-[14px] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xl mb-4">
                💰
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                Fixed Honest Pricing
              </h3>
              <p className="text-sm text-ink/75 leading-relaxed">
                Zero hidden luggage fees, surge pricing, or currency surprises. The quoted rate is the rate you pay.
              </p>
            </div>

            <div className="bg-white border border-sand rounded-[14px] p-6 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center text-xl mb-4">
                🛡️
              </div>
              <h3 className="font-heading font-semibold text-lg text-ink mb-2">
                Modern Licensed Fleet
              </h3>
              <p className="text-sm text-ink/75 leading-relaxed">
                Fully insured, air-conditioned sedans, minivans, and buses maintained to strict passenger safety standards.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Transfer FAQs ── */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink text-center mb-8">
              Frequently Asked Questions About Transfers
            </h2>

            <div className="space-y-4">
              <div className="bg-white border border-sand rounded-[10px] p-5">
                <h3 className="font-heading font-semibold text-base text-ink mb-1">
                  How do I find my driver at Victoria Falls Airport?
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  After collecting your luggage and clearing customs, walk into the main arrivals hall. Your Kaizen driver will be standing in the arrival area holding a clearly visible welcome board with your name.
                </p>
              </div>

              <div className="bg-white border border-sand rounded-[10px] p-5">
                <h3 className="font-heading font-semibold text-base text-ink mb-1">
                  What if my incoming flight is delayed?
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  We monitor all scheduled flight arrivals live. If your flight is delayed or rescheduled, your driver automatically adjusts arrival timing so someone is always waiting for you when you land, with no penalty fees.
                </p>
              </div>

              <div className="bg-white border border-sand rounded-[10px] p-5">
                <h3 className="font-heading font-semibold text-base text-ink mb-1">
                  How do cross-border transfers to Chobe (Botswana) or Livingstone (Zambia) work?
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Our driver assists you with luggage and guides you through both border immigration and visa stations. For Botswana, we transfer you seamlessly to Kazungula Border or directly to your Kasane lodge.
                </p>
              </div>

              <div className="bg-white border border-sand rounded-[10px] p-5">
                <h3 className="font-heading font-semibold text-base text-ink mb-1">
                  Can you accommodate large families, tour groups, or event delegations?
                </h3>
                <p className="text-sm text-ink/75 leading-relaxed">
                  Yes! We operate private passenger coaches and 15+ to 30-passenger buses with dedicated luggage trailers for conferences, safari groups, and weddings across Victoria Falls.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Bottom CTA ── */}
      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-3">
            Need a custom route or private chauffeur for your trip?
          </h2>
          <p className="text-ink/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Message our Victoria Falls dispatch team directly on WhatsApp or build your full journey online.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <WhatsAppLink
              variant="solid"
              message="Hello Kaizen Travel & Adventures, I would like to book a custom transfer."
              className="w-full sm:w-auto"
            >
              Chat on WhatsApp
            </WhatsAppLink>
            <Link
              href="/trip"
              className="w-full sm:w-auto inline-flex items-center justify-center font-heading font-semibold text-base min-h-[44px] px-6 py-2.5 rounded-[8px] bg-sun text-ink hover:bg-[#cf7d18] transition-colors"
            >
              Build your trip
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
