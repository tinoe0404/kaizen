import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/Photo";
import { OfferingCard } from "@/components/OfferingCard";
import { JsonLd } from "@/components/JsonLd";
import { getAll, getFeatured } from "@/lib/content";
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
  const heroPhoto = featuredOfferings[0]?.photos?.[0];

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
      {/* A. HERO SECTION (100% viewport height below header) */}
      <section className="relative w-full min-h-[calc(100dvh-88px)] flex flex-col justify-between bg-ink text-bone border-b border-forest/30 overflow-hidden">
        {/* Ambient atmospheric lighting (contained within inset-0 so rect never overflows viewports) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(224,138,30,0.15),transparent_45%),radial-gradient(circle_at_15%_85%,rgba(30,77,43,0.35),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(15,42,26,0.5),transparent_100%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Main Content Area */}
        <Container className="relative z-10 w-full flex-1 flex items-center py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
            {/* Left Column: Text & CTAs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/40 border border-forest/60 text-sun text-xs sm:text-sm font-heading font-semibold tracking-wider uppercase mb-5 backdrop-blur-sm select-none">
                <span className="w-2 h-2 rounded-full bg-sun inline-block shrink-0 shadow-[0_0_8px_rgba(224,138,30,0.8)]" />
                <span>Southern Africa Expeditions</span>
              </div>

              {/* High-impact H1 */}
              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-bone leading-[1.12] tracking-tight mb-5">
                Build your trip.
                <span className="block text-sun mt-1">Send one request.</span>
              </h1>

              {/* Compelling Value Proposition */}
              <p className="font-body text-bone/85 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-8">
                Pick your destinations, activities, lodges and 4x4 vehicle hire across Southern Africa. See your estimated total in USD, EUR, GBP or ZAR — then send us a single booking request.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8 sm:mb-10">
                <Button href="/trip" variant="primary" className="text-base sm:text-lg px-7 py-3">
                  Build your trip
                </Button>
                <Button href="#how" variant="outline-bone" className="text-base sm:text-lg px-6 py-3">
                  How it works
                </Button>
              </div>

              {/* Quick Explorer Pill Row */}
              <div className="w-full pt-6 border-t border-forest/30 max-w-xl">
                <p className="text-xs font-heading font-semibold tracking-wider uppercase text-bone/60 mb-3 select-none">
                  Explore by category
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.category}
                      href={categoryPath[cat.category]}
                      className="min-h-[44px] px-3 py-2 rounded-[8px] bg-forest/20 hover:bg-forest/40 border border-forest/40 hover:border-sun/60 text-bone/90 hover:text-bone text-xs sm:text-sm font-heading font-semibold flex items-center justify-center text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase (5 cols) */}
            <div className="lg:col-span-5 relative w-full max-w-[480px] lg:max-w-none mx-auto">
              {/* Outer decorative amber glow */}
              <div
                className="absolute -inset-1 rounded-[22px] bg-gradient-to-tr from-sun/20 via-forest/30 to-sun/10 blur-md pointer-events-none"
                aria-hidden="true"
              />

              {/* Showcase Card Frame */}
              <div className="relative rounded-[20px] bg-forest/25 border border-forest/50 p-3 sm:p-4 shadow-2xl backdrop-blur-sm overflow-hidden">
                {/* Showcase Top Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-forest/30 text-xs font-heading font-medium text-bone/80">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sun" />
                    Curated Itineraries
                  </span>
                  <span className="text-sun tracking-wider uppercase font-semibold">
                    4 Currencies Live
                  </span>
                </div>

                {/* Photo Container */}
                <div className="relative rounded-[14px] overflow-hidden">
                  <Photo
                    photo={heroPhoto}
                    label="SOUTHERN AFRICA SAFARIS"
                    priority
                    className="aspect-[4/3] w-full"
                  />

                  {/* Floating Itinerary Tag at Bottom of Photo */}
                  <div className="absolute inset-x-2.5 bottom-2.5 p-3 rounded-[12px] bg-ink/90 border border-forest/50 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-sun">
                          Southern Africa
                        </p>
                        <p className="text-sm sm:text-base font-heading font-bold text-bone leading-snug">
                          Victoria Falls • Hwange • Mana Pools
                        </p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-[6px] bg-forest text-[11px] font-heading font-semibold text-bone select-none">
                        Custom
                      </span>
                    </div>
                    <p className="text-xs font-body text-bone/70 mt-1">
                      Add destinations, game drives, camps & 4x4s into one request.
                    </p>
                  </div>
                </div>

                {/* Showcase Highlights Bar */}
                <div className="grid grid-cols-3 gap-2 pt-3 mt-1 text-center">
                  <div className="p-2 rounded-[8px] bg-ink/40 border border-forest/30">
                    <p className="text-[11px] font-heading text-bone/60">Estimates</p>
                    <p className="text-xs font-heading font-bold text-sun">USD • ZAR</p>
                  </div>
                  <div className="p-2 rounded-[8px] bg-ink/40 border border-forest/30">
                    <p className="text-[11px] font-heading text-bone/60">Coordination</p>
                    <p className="text-xs font-heading font-bold text-bone">Direct Team</p>
                  </div>
                  <div className="p-2 rounded-[8px] bg-ink/40 border border-forest/30">
                    <p className="text-[11px] font-heading text-bone/60">Response</p>
                    <p className="text-xs font-heading font-bold text-sun">Fast & Personal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-10 w-full pb-4 pt-2 flex items-center justify-center">
          <a
            href="#how"
            className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 text-xs font-heading font-medium tracking-wider uppercase text-bone/70 hover:text-sun transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun rounded-[8px] px-3 py-2"
            aria-label="Scroll down to how it works"
          >
            <span>Scroll to explore</span>
            <svg
              className="w-4 h-4 text-sun animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

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

      {/* E. FEATURED EXPERIENCES */}
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
