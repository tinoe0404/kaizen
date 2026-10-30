import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Category, Offering } from "@/content/types";
import { getCategoryConfig } from "@/content/categories";
import { getBySlug, getAll, getByDestination } from "@/lib/content";
import { priceLine, unitLabel } from "@/lib/pricing";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/Gallery";
import { OfferingCard } from "@/components/OfferingCard";

export interface DetailPageProps {
  category: Category;
  slug: string;
}

export function DetailPage({ category, slug }: DetailPageProps) {
  const offering = getBySlug(category, slug);

  if (!offering) {
    notFound();
  }

  const config = getCategoryConfig(category);

  // Lookup linked destination name if applicable
  const linkedDestination = offering.destinationSlug
    ? getBySlug("destination", offering.destinationSlug)
    : undefined;
  const destinationDisplayName = linkedDestination
    ? linkedDestination.name
    : offering.destinationSlug;

  // Split description paragraphs on blank lines
  const paragraphs = offering.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Compute related items
  let relatedHeading = "";
  let relatedItems: Offering[] = [];

  if (category === "destination") {
    relatedHeading = "Activities and stays here";
    relatedItems = getByDestination(offering.slug).slice(0, 3);
  } else {
    relatedHeading = `More ${config.title.toLowerCase()}`;
    relatedItems = getAll(category)
      .filter((item) => item.id !== offering.id)
      .slice(0, 3);
  }

  return (
    <div className="w-full flex flex-col">
      {/* Top Section with Breadcrumb, Gallery, and Info Panel */}
      <Section className="bg-bone pt-4 pb-12 md:pb-16">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="pb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink/75 font-body">
              <li>
                <Link
                  href="/"
                  className="hover:text-forest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[2px]"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/40 select-none">
                /
              </li>
              <li>
                <Link
                  href={config.path}
                  className="hover:text-forest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[2px]"
                >
                  {config.title}
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/40 select-none">
                /
              </li>
              <li aria-current="page" className="font-semibold text-ink">
                {offering.name}
              </li>
            </ol>
          </nav>

          {/* Two-column layout: Gallery (about 60%) + Info panel (about 40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery (first on mobile) */}
            <div className="lg:col-span-7 w-full">
              <Gallery
                photos={offering.photos}
                label={offering.name}
              />
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-5 w-full flex flex-col bg-white p-6 sm:p-8 rounded-[14px] border border-sand">
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink leading-tight">
                {offering.name}
              </h1>

              <p className="font-body text-ink/80 text-base sm:text-lg leading-relaxed mt-3">
                {offering.summary}
              </p>

              <div className="mt-6 pt-5 border-t border-sand/80">
                <p className="font-heading font-semibold text-2xl sm:text-3xl text-forest">
                  {priceLine(offering)}
                </p>
                <p className="font-heading text-xs uppercase tracking-wider text-ink/60 mt-1">
                  {unitLabel(offering.pricing.unit)}
                </p>
              </div>

              {/* Fact Rows: capacity / destination */}
              {(offering.capacity !== undefined || offering.destinationSlug) && (
                <div className="flex flex-col gap-2 mt-5 py-3 border-y border-sand/80 text-sm font-heading">
                  {offering.capacity !== undefined && (
                    <div className="flex items-center gap-2 text-ink">
                      <span className="font-semibold text-ink/60">Seats:</span>
                      <span className="font-medium">{offering.capacity}</span>
                    </div>
                  )}
                  {offering.destinationSlug && (
                    <div className="flex items-center gap-2 text-ink">
                      <span className="font-semibold text-ink/60">
                        Destination:
                      </span>
                      <Link
                        href={`/destinations/${offering.destinationSlug}`}
                        className="text-forest hover:underline font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[2px]"
                      >
                        {destinationDisplayName}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  href={`/trip?add=${encodeURIComponent(offering.id)}`}
                  variant="primary"
                  className="w-full justify-center"
                >
                  Add to trip
                </Button>
                <WhatsAppLink
                  message={`Hi, I am interested in ${offering.name}.`}
                  variant="outline"
                  className="w-full justify-center"
                >
                  Ask on WhatsApp
                </WhatsAppLink>
                <p className="text-xs text-ink/65 text-center mt-1 font-body">
                  This is a request, not a booking. We confirm availability and
                  payment with you.
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {paragraphs.length > 0 && (
            <div className="mt-12 pt-10 border-t border-forest/10 max-w-3xl">
              <h2 className="font-heading font-bold text-2xl text-ink mb-4">
                About this {config.singular}
              </h2>
              <div className="flex flex-col gap-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-body text-ink/85 text-base sm:text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Related Section (hidden entirely if empty) */}
      {relatedItems.length > 0 && (
        <Section className="bg-sand/30 border-t border-forest/10 py-12 md:py-16">
          <Container>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-8">
              {relatedHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedItems.map((item) => (
                <OfferingCard
                  key={item.id}
                  offering={item}
                  headingLevel="h3"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Bottom CTA Band */}
      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-6">
            Ready to put it together?
          </h2>
          <Button href="/trip" variant="primary">
            Build your trip
          </Button>
        </Container>
      </Section>
    </div>
  );
}

