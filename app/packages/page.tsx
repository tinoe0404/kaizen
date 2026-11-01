import type { Metadata } from "next";
import { getPackages } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/PackageCard";

export const metadata: Metadata = {
  title: "Curated Safari Packages & Itineraries",
  description:
    "Explore pre-planned 3 to 10 day safari itineraries across Victoria Falls, Chobe, and Namibia. Add an entire package to your trip planner with one click.",
  alternates: { canonical: "/packages" },
};

export default function PackagesPage() {
  const packages = getPackages();

  return (
    <div className="w-full flex flex-col">
      {/* Top Banner */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <span className="font-heading font-semibold text-xs uppercase tracking-wider text-sun mb-2 block">
            Curated Expeditions
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            Curated Safari Packages & Itineraries
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[680px] leading-relaxed">
            Hand-crafted journeys connecting Southern Africa&apos;s most iconic
            experiences. Add an entire itinerary to your trip planner with a
            single click, or customize it to your personal travel party and
            dates.
          </p>
        </Container>
      </Section>

      {/* Main Packages Grid */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} headingLevel="h2" />
            ))}
          </div>
        </Container>
      </Section>

      {/* Value Pillars */}
      <Section sand className="py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col gap-2">
              <span className="w-10 h-10 rounded-full bg-forest/10 text-forest font-heading font-bold flex items-center justify-center text-base mb-1">
                1
              </span>
              <h3 className="font-heading font-bold text-lg text-ink">
                1-Click Trip Assembly
              </h3>
              <p className="font-body text-sm text-ink/75 leading-relaxed">
                Load every flight, lodge, river cruise, and 4x4 hire into your
                trip planner with one click.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="w-10 h-10 rounded-full bg-forest/10 text-forest font-heading font-bold flex items-center justify-center text-base mb-1">
                2
              </span>
              <h3 className="font-heading font-bold text-lg text-ink">
                Fully Customizable
              </h3>
              <p className="font-body text-sm text-ink/75 leading-relaxed">
                Add extra days in Chobe, swap a lodge, or add activities—your
                trip remains completely flexible.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="w-10 h-10 rounded-full bg-forest/10 text-forest font-heading font-bold flex items-center justify-center text-base mb-1">
                3
              </span>
              <h3 className="font-heading font-bold text-lg text-ink">
                Instant Multi-Currency Total
              </h3>
              <p className="font-body text-sm text-ink/75 leading-relaxed">
                See transparent live estimates in USD, EUR, GBP, or ZAR before
                sending your direct booking request.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Bottom CTA Band */}
      <Section className="bg-ink text-bone py-14 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-bone mb-3">
            Want a fully customized itinerary?
          </h2>
          <p className="font-body text-bone/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Build your unique expedition from scratch with our interactive trip
            planner or contact our safari specialists directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/trip" variant="primary">
              Build custom trip
            </Button>
            <Button
              href="/contact"
              variant="outline"
              className="text-bone border-bone/40 hover:bg-bone/10"
            >
              Contact our team
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}

