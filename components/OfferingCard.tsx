import React from "react";
import Link from "next/link";
import { Offering } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { AddToTripButton } from "@/components/trip/AddToTripButton";
import { priceLine } from "@/lib/pricing";
import { offeringHref } from "@/lib/routes";
import { getByDestination } from "@/lib/content";

export interface OfferingCardProps {
  offering: Offering;
  headingLevel?: "h2" | "h3";
}

export function OfferingCard({
  offering,
  headingLevel = "h2",
}: OfferingCardProps) {
  const href = offeringHref(offering);
  const HeadingTag = headingLevel;
  const isDestination = offering.category === "destination";

  let destSummary = "";
  if (isDestination) {
    const itemsInDest = getByDestination(offering.slug);
    const actCount = itemsInDest.filter((i) => i.category === "activity").length;
    const lodgeCount = itemsInDest.filter((i) => i.category === "lodge").length;
    if (actCount > 0 && lodgeCount > 0) {
      destSummary = `${actCount} ${actCount === 1 ? "Activity" : "Activities"} · ${lodgeCount} ${lodgeCount === 1 ? "Lodge" : "Lodges"}`;
    } else if (actCount > 0) {
      destSummary = `${actCount} ${actCount === 1 ? "Activity" : "Activities"}`;
    } else if (lodgeCount > 0) {
      destSummary = `${lodgeCount} ${lodgeCount === 1 ? "Lodge" : "Lodges"}`;
    } else {
      destSummary = "Safari Destination Hub";
    }
  }

  return (
    <div className="group relative flex flex-col bg-white border border-sand rounded-[14px] overflow-hidden transition-colors hover:border-forest/40">
      {/* 4:3 Photo on top with rounded top corners */}
      <Photo
        photo={offering.photos?.[0]}
        label={offering.name}
        className="aspect-[4/3] w-full rounded-t-[14px] rounded-b-none"
      />

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0">
        <HeadingTag className="font-heading font-semibold text-xl text-ink group-hover:text-forest transition-colors break-words">
          <Link
            href={href}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-[4px] after:absolute after:inset-0 break-words"
          >
            {offering.name}
          </Link>
        </HeadingTag>

        <p className="font-body text-sm text-ink/75 mt-2 line-clamp-2 flex-1">
          {offering.summary}
        </p>

        {isDestination ? (
          <p className="font-heading font-semibold text-sm text-forest mt-4 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-forest shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.244-.77 3.031-2.07 4.707-4.103 2.15-2.61 3.921-5.99 3.921-9.249 0-4.97-4.03-9-9-9s-9 4.03-9 9c0 3.259 1.771 6.639 3.921 9.249 1.676 2.033 3.463 3.333 4.707 4.103.311.193.571.337.757.433a5.73 5.73 0 00.28.14l.019.008.006.003.003.001zm.31-11.933a2 2 0 110-4 2 2 0 010 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{destSummary}</span>
          </p>
        ) : (
          <p className="font-heading font-semibold text-sm text-forest mt-4">
            {priceLine(offering)}
          </p>
        )}

        {/* Card actions: For destinations -> Explore button. For others -> AddToTripButton + View details */}
        <div className="mt-4 pt-2 flex items-center gap-3">
          {isDestination ? (
            <Link
              href={href}
              className="w-full inline-flex items-center justify-center font-heading font-semibold text-sm min-h-[44px] px-4 py-2 rounded-[8px] bg-forest text-bone hover:bg-forest/90 transition-colors select-none relative z-10 text-center"
            >
              Explore destination →
            </Link>
          ) : (
            <>
              <AddToTripButton
                id={offering.id}
                name={offering.name}
                className="flex-1"
              />
              <Link
                href={href}
                tabIndex={-1}
                aria-hidden="true"
                className="inline-flex items-center justify-center font-heading font-semibold text-sm min-h-[44px] px-3.5 py-2 rounded-[8px] border border-sand hover:border-forest/40 text-ink/80 hover:text-forest transition-colors select-none relative z-10 text-center"
              >
                View details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

