import React from "react";
import Link from "next/link";
import { Offering } from "@/content/types";
import { Photo } from "@/components/ui/Photo";
import { AddToTripButton } from "@/components/trip/AddToTripButton";
import { priceLine } from "@/lib/pricing";
import { offeringHref } from "@/lib/routes";

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

  return (
    <div className="group relative flex flex-col bg-white border border-sand rounded-[14px] overflow-hidden transition-colors hover:border-forest/40">
      {/* 4:3 Photo on top with rounded top corners */}
      <Photo
        photo={offering.photos?.[0]}
        label={offering.name}
        className="aspect-[4/3] w-full rounded-t-[14px] rounded-b-none"
      />

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <HeadingTag className="font-heading font-semibold text-xl text-ink group-hover:text-forest transition-colors">
          <Link
            href={href}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-[4px] after:absolute after:inset-0"
          >
            {offering.name}
          </Link>
        </HeadingTag>

        <p className="font-body text-sm text-ink/75 mt-2 line-clamp-2 flex-1">
          {offering.summary}
        </p>

        <p className="font-heading font-semibold text-sm text-forest mt-4">
          {priceLine(offering)}
        </p>

        {/* Card actions: AddToTripButton + View details */}
        <div className="mt-4 pt-2 flex items-center gap-3">
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
        </div>
      </div>
    </div>
  );
}

