"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrip } from "@/components/trip/TripProvider";
import { trackEvent } from "@/lib/analytics";

export interface PackageAddButtonProps {
  itemIds: string[];
}

export function PackageAddButton({ itemIds }: PackageAddButtonProps) {
  const { state, addMany, isReady } = useTrip();
  const [justAdded, setJustAdded] = useState(false);

  const totalItems = itemIds.length;
  const inTripCount = isReady
    ? itemIds.filter((id) => state.ids.includes(id)).length
    : 0;
  const isFullyInTrip = totalItems > 0 && inTripCount === totalItems;

  const handleAddPackage = () => {
    addMany(itemIds);
    trackEvent("package_add_to_trip", { count: itemIds.length });
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 4000);
  };

  if (isFullyInTrip) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <span className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-control bg-forest/10 text-forest font-heading font-semibold text-sm border border-forest/20">
          All {totalItems} items in your trip ✓
        </span>
        <Link
          href="/trip"
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-control bg-forest text-bone font-heading font-semibold text-sm hover:bg-forest/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          View trip quote →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <button
        type="button"
        onClick={handleAddPackage}
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-control bg-forest text-bone font-heading font-semibold text-sm hover:bg-forest/90 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        {justAdded
          ? `Added all ${totalItems} items! ✓`
          : inTripCount > 0
          ? `Add remaining (${totalItems - inTripCount} items)`
          : `Add package to trip (${totalItems} items)`}
      </button>
      <Link
        href="/trip"
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-control border border-sand hover:border-forest/40 text-ink/85 hover:text-forest font-heading font-medium text-sm transition-colors"
      >
        Open trip planner
      </Link>
    </div>
  );
}
