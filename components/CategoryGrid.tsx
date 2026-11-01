"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Offering, Category } from "@/content/types";
import { OfferingCard } from "@/components/OfferingCard";

export interface CategoryGridProps {
  category: Category;
  items: Offering[];
  destinations: Offering[];
}

export function CategoryGrid({
  category,
  items,
  destinations,
}: CategoryGridProps) {
  // Initialize from URL search param if present on initial render
  const [selectedDestination, setSelectedDestination] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("destination") || "all";
    }
    return "all";
  });

  // Sync state if user navigates back/forward via browser history
  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      setSelectedDestination(params.get("destination") || "all");
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Compute available destinations that have offerings in this category
  const destinationOptions = useMemo(() => {
    const slugMap = new Map<string, number>();
    for (const item of items) {
      if (item.destinationSlug) {
        slugMap.set(
          item.destinationSlug,
          (slugMap.get(item.destinationSlug) || 0) + 1
        );
      }
    }

    return destinations
      .filter((dest) => slugMap.has(dest.slug))
      .map((dest) => ({
        slug: dest.slug,
        name: dest.name,
        count: slugMap.get(dest.slug) || 0,
      }));
  }, [items, destinations]);

  // Handle filter click & sync search param cleanly without reloading
  const handleSelect = (slug: string) => {
    setSelectedDestination(slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (slug === "all") {
        url.searchParams.delete("destination");
      } else {
        url.searchParams.set("destination", slug);
      }
      window.history.pushState(null, "", url.toString());
    }
  };

  const filteredItems = useMemo(() => {
    if (selectedDestination === "all") return items;
    return items.filter((item) => item.destinationSlug === selectedDestination);
  }, [items, selectedDestination]);

  const showFilters = destinationOptions.length > 1;

  const currentDestinationName =
    selectedDestination === "all"
      ? null
      : destinationOptions.find((d) => d.slug === selectedDestination)?.name;

  const itemPlural =
    category === "activity"
      ? "activities"
      : category === "lodge"
      ? "lodges"
      : "items";

  return (
    <div className="w-full flex flex-col">
      {showFilters && (
        <div
          className="mb-8 md:mb-10 flex flex-col gap-3"
          role="region"
          aria-label="Filter by destination"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-xs uppercase tracking-wider font-heading font-semibold text-ink/60 select-none mr-1">
              Destination:
            </span>

            <button
              type="button"
              onClick={() => handleSelect("all")}
              aria-pressed={selectedDestination === "all"}
              className={`min-h-[44px] px-4 py-2 rounded-control font-heading text-sm transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                selectedDestination === "all"
                  ? "bg-forest text-bone font-medium shadow-none"
                  : "bg-white text-ink/80 hover:text-ink hover:bg-sand/40 border border-sand"
              }`}
            >
              <span>All {itemPlural}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedDestination === "all"
                    ? "bg-bone/20 text-bone"
                    : "bg-bone text-ink/60"
                }`}
              >
                {items.length}
              </span>
            </button>

            {destinationOptions.map((dest) => {
              const isSelected = selectedDestination === dest.slug;
              return (
                <button
                  key={dest.slug}
                  type="button"
                  onClick={() => handleSelect(dest.slug)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] px-4 py-2 rounded-control font-heading text-sm transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                    isSelected
                      ? "bg-forest text-bone font-medium shadow-none"
                      : "bg-white text-ink/80 hover:text-ink hover:bg-sand/40 border border-sand"
                  }`}
                >
                  <span>{dest.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-bone/20 text-bone"
                        : "bg-bone text-ink/60"
                    }`}
                  >
                    {dest.count}
                  </span>
                </button>
              );
            })}
          </div>

          {currentDestinationName && (
            <p className="text-sm font-body text-ink/70">
              Showing{" "}
              <span className="font-semibold text-ink">
                {filteredItems.length}
              </span>{" "}
              {itemPlural} in{" "}
              <span className="font-semibold text-ink">
                {currentDestinationName}
              </span>
              .{" "}
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className="text-forest hover:underline font-medium inline-flex items-center min-h-[44px] py-2"
              >
                Show all {itemPlural}
              </button>
            </p>
          )}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-card border border-sand p-8">
          <p className="font-body text-ink/70 text-lg mb-4">
            No {itemPlural} found for this destination.
          </p>
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className="min-h-[44px] px-5 py-2.5 rounded-control bg-forest text-bone text-sm font-heading font-medium hover:bg-forest/90 transition-colors"
          >
            View all {itemPlural}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item) => (
            <OfferingCard key={item.id} offering={item} headingLevel="h2" />
          ))}
        </div>
      )}
    </div>
  );
}
