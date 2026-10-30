import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/Photo";
import { getAll, getFeatured } from "@/lib/content";
import { formatMoney, unitLabel } from "@/lib/pricing";
import { categoryPath, offeringHref } from "@/lib/routes";
import { whatsappLink } from "@/lib/whatsapp";
import { Category } from "@/content/types";

export const metadata: Metadata = {
  title: "Kaizen Travel and Adventures",
  description:
    "Build your trip online and send one booking request. Destinations, activities, lodges and vehicle hire.",
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

  return (
    <div className="w-full flex flex-col">
      {/* A. HERO SECTION */}
      <section className="bg-ink text-bone py-14 sm:py-20 lg:py-24 border-b border-forest/30">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text */}
            <div className="flex flex-col items-start">
              <span className="font-heading font-semibold text-xs sm:text-sm tracking-[0.18em] text-sun uppercase select-none">
                TRAVEL AND ADVENTURES
              </span>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-bone leading-[1.15] mt-4 mb-4">
                Build your trip. Send one request.
              </h1>
              <p className="font-body text-bone/85 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                Pick your destinations, activities, lodges and vehicle. See
                your total in USD, EUR, GBP or ZAR, then send us a booking
                request.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/trip" variant="primary">
                  Build your trip
                </Button>
                <Button href="#how" variant="outline-bone">
                  How it works
                </Button>
              </div>
            </div>

            {/* Right Column: Hero Photo */}
            <div className="relative w-full max-w-[540px] lg:max-w-none mx-auto">
              {/* Optional decorative sun-colored circle in the corner */}
              <div
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-sun/20 blur-sm pointer-events-none"
                aria-hidden="true"
              />
              <Photo
                label="HERO, [DESTINATION NAME]"
                priority
                className="aspect-[4/3] w-full rounded-[16px] border border-forest/40"
              />
            </div>
          </div>
        </Container>
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
              {featuredOfferings.map((offering) => {
                const priceDisplay =
                  offering.pricing.amountUsd === 0
                    ? "[PRICE]"
                    : `From ${formatMoney(offering.pricing.amountUsd, "USD")} ${unitLabel(offering.pricing.unit)}`;

                return (
                  <div
                    key={offering.id}
                    className="flex flex-col bg-white rounded-[14px] border border-sand overflow-hidden"
                  >
                    <Photo
                      photo={offering.photos?.[0]}
                      label={offering.name}
                      className="aspect-[16/10] w-full"
                    />
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <h3 className="font-heading font-semibold text-xl text-ink">
                        {offering.name}
                      </h3>
                      <p className="font-body text-sm text-ink/75 mt-2 line-clamp-2 flex-1">
                        {offering.summary}
                      </p>
                      <p className="font-heading font-semibold text-sm text-forest mt-4">
                        {priceDisplay}
                      </p>
                      <Button
                        href={offeringHref(offering)}
                        variant="solid"
                        className="w-full mt-4"
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                );
              })}
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
              <Button href={whatsappLink()} variant="outline-bone">
                WhatsApp us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
