"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SafariPackage } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { useTrip } from "@/components/trip/TripProvider";
import { getById } from "@/lib/content";

export interface PackageCardProps {
  pkg: SafariPackage;
  headingLevel?: "h2" | "h3";
}

export function PackageCard({ pkg, headingLevel = "h2" }: PackageCardProps) {
  const { state, addMany, isReady } = useTrip();
  const [justAdded, setJustAdded] = useState(false);
  const HeadingTag = headingLevel;

  // Check how many items from this package are already in the trip
  const includedItems = pkg.itemIds
    .map((id) => getById(id))
    .filter(Boolean);

  const totalItems = pkg.itemIds.length;
  const inTripCount = isReady
    ? pkg.itemIds.filter((id) => state.ids.includes(id)).length
    : 0;
  const isFullyInTrip = inTripCount === totalItems;

  const handleAddPackage = () => {
    addMany(pkg.itemIds);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 4000);
  };

  return (
    <article className="group relative flex flex-col bg-white border border-sand rounded-[14px] overflow-hidden transition-colors hover:border-forest/40">
      {/* Photo with duration & destination badges */}
      <div className="relative">
        <Photo
          photo={pkg.photo}
          label={pkg.title}
          className="aspect-[16/10] w-full rounded-t-[14px] rounded-b-none"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {pkg.badge && (
            <span className="bg-forest text-bone font-heading font-semibold text-xs tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              {pkg.badge}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-heading font-semibold text-bone drop-shadow-md z-10 pointer-events-none bg-ink/60 backdrop-blur-sm px-3 py-1.5 rounded-control">
          <span>{pkg.destination}</span>
          <span className="text-sun font-bold">{pkg.duration}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <HeadingTag className="font-heading font-bold text-xl text-ink group-hover:text-forest transition-colors">
          {pkg.title}
        </HeadingTag>

        <p className="font-body text-sm text-ink/75 mt-2 leading-relaxed">
          {pkg.subtitle}
        </p>

        {/* Highlights */}
        <div className="mt-4 pt-3 border-t border-sand">
          <p className="text-xs uppercase tracking-wider font-heading font-semibold text-ink/60 mb-2">
            Trip Highlights:
          </p>
          <ul className="space-y-1.5">
            {pkg.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-xs sm:text-sm font-body text-ink/80"
              >
                <span
                  className="w-4 h-4 rounded-full bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Included Offerings Pill List */}
        <div className="mt-4 pt-3 border-t border-sand">
          <p className="text-xs uppercase tracking-wider font-heading font-semibold text-ink/60 mb-2">
            Includes {includedItems.length} curated bookings:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {includedItems.map((item) => (
              <span
                key={item!.id}
                className="text-xs font-heading font-medium bg-sand/60 text-ink/85 px-2.5 py-1 rounded-control"
              >
                {item!.name}
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-sand flex flex-col sm:flex-row items-center gap-3">
          {isFullyInTrip ? (
            <div className="w-full flex flex-col sm:flex-row items-center gap-2">
              <span className="w-full sm:w-auto flex-1 inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-control bg-forest/10 text-forest font-heading font-semibold text-sm border border-forest/20">
                In your trip ({totalItems} items) ✓
              </span>
              <Link
                href="/trip"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-control bg-forest text-bone font-heading font-medium text-sm hover:bg-forest/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                View trip quote →
              </Link>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleAddPackage}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-control bg-forest text-bone font-heading font-medium text-sm hover:bg-forest/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              >
                {justAdded
                  ? `Added all ${totalItems} items! ✓`
                  : inTripCount > 0
                  ? `Add remaining (${totalItems - inTripCount} items)`
                  : `Add package to trip (${totalItems} items)`}
              </button>

              <Link
                href="/trip"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-control border border-sand hover:border-forest/40 text-ink/80 hover:text-forest text-sm font-heading font-medium transition-colors"
              >
                Trip planner
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

