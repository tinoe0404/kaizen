"use client";

import React, { useState } from "react";
import { useTrip } from "./TripProvider";

export interface AddToTripButtonProps {
  id: string;
  name: string;
  className?: string;
}

export function AddToTripButton({
  id,
  name,
  className = "",
}: AddToTripButtonProps) {
  const { state, toggle, isReady } = useTrip();
  const [announcement, setAnnouncement] = useState("");

  const isAdded = isReady && state.ids.includes(id);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent activating card-level links if nested or wrapped
    e.stopPropagation();
    toggle(id);
    setAnnouncement(
      isAdded ? `${name} removed from your trip` : `${name} added to your trip`
    );
  };

  const baseStyles =
    "inline-flex items-center justify-center font-heading font-semibold text-sm min-h-[44px] px-4 py-2 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink select-none cursor-pointer text-center relative z-10";

  const variantStyles = isAdded
    ? "bg-forest text-bone hover:bg-[#163920] active:bg-[#102b18]"
    : "bg-transparent border-2 border-forest text-forest hover:bg-forest hover:text-bone active:bg-[#163920]";

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isAdded}
        className={`${baseStyles} ${variantStyles} ${className}`.trim()}
      >
        {isAdded ? (
          <>
            <svg
              className="w-4 h-4 mr-1.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <span>Added</span>
          </>
        ) : (
          <span>Add to trip</span>
        )}
      </button>

      {/* Screen reader live announcement */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  );
}

