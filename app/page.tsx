import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/Photo";
import { OfferingCard } from "@/components/OfferingCard";
import { PackageCard } from "@/components/PackageCard";
import { JsonLd } from "@/components/JsonLd";
import { HeroVideo } from "@/components/HeroVideo";
import { getAll, getFeatured, getPackages } from "@/lib/content";
import { categoryPath } from "@/lib/routes";
import { Category } from "@/content/types";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { site } from "@/content/site";
import { safeStr, stripUndefined } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Kaizen Travel and Adventures",
  description:
    "Build your trip online and send one booking request. Destinations, activities, lodges and vehicle hire across Southern Africa.",
  alternates: { canonical: "/" },
};

const CATEGORIES_DATA: {
  category: Category;
  title: string;
  tagline: string;
}[] = [
  {
    category: "destination",
    title: "Destinations",
    tagline: "Where you want to go.",
  },
  {
    category: "activity",
    title: "Activities",
    tagline: "What you want to do there.",
  },
  {
    category: "lodge",
    title: "Lodges",
    tagline: "Where you stay.",
  },
  {
    category: "vehicle",
    title: "Vehicle hire",
    tagline: "How you get around.",
  },
];

const TRUST_POINTS = [
  "Totals in 4 currencies",
  "Request sent straight to our team",
  "WhatsApp with your trip pre-filled",
  "We confirm availability and payment with you",
];

const HOW_STEPS = [
  {
    number: "1",
    badgeVariant: "forest",
    title: "Choose what you want",
    body: "Browse destinations, activities, lodges and vehicles, each with photos. Add what you like to your trip.",
  },
  {
    number: "2",
    badgeVariant: "forest",
    title: "Set dates and group size",
    body: "Your total updates as you go. Switch between USD, EUR, GBP and ZAR.",
  },
  {
    number: "3",
    badgeVariant: "sun",
    title: "Send your request",
    body: "You get an automatic confirmation. We then confirm availability and payment with you directly.",
  },
];

export default function HomePage() {
  const featuredOfferings = getFeatured().slice(0, 3);
  const curatedPackages = getPackages().slice(0, 2);

  const agencyData = stripUndefined({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: safeStr(site.name),
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    email: safeStr(site.bookingEmail),
    address: safeStr(site.address),
  });

  // Only render if at least name is present (not a placeholder)
  const hasAgencyData = Boolean(agencyData.name);

  return (
    <div className="w-full flex flex-col">
      {hasAgencyData && <JsonLd data={agencyData as Record<string, unknown>} />}
      {/* A. HERO SECTION — full-bleed video slideshow (homepage only) */}
      <div className="-mt-[88px]">
        <HeroVideo />
      </div>

      {/* B. TRUST STRIP */}
      <Section sand className="py-6 sm:py-8 border-b border-forest/10">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12 text-sm sm:text-base font-heading font-medium text-ink text-center">
            {TRUST_POINTS.map((point) => (
              <div key={point} className="inline-flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-forest shrink-0"
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
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* C. CATEGORIES */}
      <Section className="bg-bone">
        <Container>
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
              Start with what you want to do
            </h2>
            <p className="font-body text-ink/75 text-base sm:text-lg mt-2">
              Four ways into your trip. Add as many as you like to the same
              request.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_DATA.map((cat) => {
              const firstOffering = getAll(cat.category)[0];
              const firstPhoto = firstOffering?.photos?.[0];

              return (
                <Link
                  key={cat.category}
                  href={categoryPath[cat.category]}
                  className="group flex flex-col bg-white rounded-[14px] overflow-hidden border border-sand hover:border-forest/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest min-h-[44px]"
                >
                  <Photo
                    photo={firstPhoto}
                    label={cat.title}
                    className="aspect-[4/3] w-full"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-lg sm:text-xl text-ink group-hover:text-forest transition-colors">
                      {cat.title}
                    </h3>
                    <p className="font-body text-sm text-ink/70 mt-1">
                      {cat.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* D. HOW IT WORKS */}
      <Section sand id="how" className="scroll-mt-20">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink text-center md:text-left mb-8 sm:mb-10">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map((step) => {
              const isSun = step.badgeVariant === "sun";
              const badgeClasses = isSun
                ? "bg-sun text-ink"
                : "bg-forest text-bone";

              return (
                <div
                  key={step.number}
                  className="bg-white/80 p-6 sm:p-7 rounded-[14px] border border-sand flex flex-col"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-base ${badgeClasses}`}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-ink mt-5">
                    {step.title}
                  </h3>
                  <p className="font-body text-ink/80 text-base leading-relaxed mt-2">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* E. CURATED SAFARI PACKAGES */}
      {curatedPackages.length > 0 && (
        <Section sand className="border-t border-forest/10 py-12 md:py-16">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="font-heading font-semibold text-xs uppercase tracking-wider text-sun mb-1 block select-none">
                  Curated Expeditions
                </span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                  Ready-made safari packages
                </h2>
                <p className="font-body text-sm sm:text-base text-ink/75 mt-2 max-w-xl leading-relaxed">
                  Hand-crafted multi-day itineraries you can add to your trip planner with one click, then adjust to your dates.
                </p>
              </div>
              <Link
                href="/packages"
                className="font-heading font-semibold text-forest hover:text-ink min-h-[44px] inline-flex items-center text-sm sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-[4px] shrink-0"
              >
                All packages ({getPackages().length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {curatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} headingLevel="h3" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* F. FEATURED EXPERIENCES */}
      {featuredOfferings.length > 0 && (
        <Section className="bg-bone">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                Featured experiences
              </h2>
              <Link
                href="/trip"
                className="font-heading font-semibold text-forest hover:text-ink min-h-[44px] inline-flex items-center text-sm sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest rounded-[4px]"
              >
                See everything →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredOfferings.map((offering) => (
                <OfferingCard
                  key={offering.id}
                  offering={offering}
                  headingLevel="h3"
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* F. CTA BAND */}
      <section className="py-8 md:py-14">
        <Container>
          <div className="bg-forest text-bone rounded-[20px] p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-bone">
              Ready when you are.
            </h2>
            <p className="font-body text-bone/85 text-base sm:text-lg max-w-xl mt-3 mb-8">
              Build your trip in a few minutes, or message us on WhatsApp and we
              will help.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/trip" variant="primary">
                Build your trip
              </Button>
              <WhatsAppLink variant="outline-bone">
                WhatsApp us
              </WhatsAppLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
