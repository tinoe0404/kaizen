"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTrip } from "@/components/trip/TripProvider";
import { formatCurrencyAmount } from "@/lib/pricing";
import { Button } from "@/components/ui/button";

export function TripBar() {
  const pathname = usePathname();
  const { state, derived, isReady } = useTrip();
  const barRef = useRef<HTMLElement | null>(null);

  const hasItems = isReady && state.ids.length > 0;
  const isTripPage = pathname === "/trip";

  useEffect(() => {
    if (!hasItems) {
      document.documentElement.style.removeProperty("--trip-bar-h");
      document.documentElement.style.removeProperty("--float-bottom");
      return;
    }

    const el = barRef.current;
    if (!el) return;

    const updateHeight = () => {
      // If hidden by media query (e.g. lg:hidden) or not displayed, rect.height is 0
      const rect = el.getBoundingClientRect();
      const height = Math.round(rect.height);

      if (height > 0) {
        document.documentElement.style.setProperty("--trip-bar-h", `${height}px`);
        document.documentElement.style.setProperty("--float-bottom", `${height + 16}px`);
      } else {
        document.documentElement.style.removeProperty("--trip-bar-h");
        document.documentElement.style.removeProperty("--float-bottom");
      }
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(el);

    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      document.documentElement.style.removeProperty("--trip-bar-h");
      document.documentElement.style.removeProperty("--float-bottom");
    };
  }, [hasItems]);

  if (!hasItems) {
    return null;
  }

  const count = state.ids.length;
  const itemCountLabel = count === 1 ? "1 item" : `${count} items`;
  const formattedTotal = formatCurrencyAmount(
    derived.totalConverted,
    state.currency
  );

  const handleReviewRequest = () => {
    const summaryCard = document.getElementById("trip-summary");
    if (summaryCard) {
      summaryCard.scrollIntoView({ behavior: "smooth" });
      const heading = summaryCard.querySelector("h2");
      if (heading) {
        heading.focus();
      }
    }
  };

  return (
    <nav
      ref={barRef}
      aria-label="Trip summary"
      className="fixed bottom-0 left-0 right-0 z-40 bg-ink text-bone border-t border-sand/20 shadow-lg lg:hidden"
      style={{
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 flex items-center justify-between gap-4">
        {/* Left: Item count and total */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-bone/70 leading-tight">
            {itemCountLabel}
          </span>
          <span className="font-heading font-bold text-lg sm:text-xl text-bone tabular-nums leading-tight truncate">
            {formattedTotal}
          </span>
        </div>

        {/* Right: Sun action button */}
        <div className="shrink-0">
          {isTripPage ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleReviewRequest}
              className="min-h-[44px] px-5 py-2.5 text-sm sm:text-base"
            >
              Review request
            </Button>
          ) : (
            <Button
              href="/trip"
              variant="primary"
              className="min-h-[44px] px-5 py-2.5 text-sm sm:text-base"
            >
              Review trip
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

