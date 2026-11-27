import type { Metadata } from "next";
import Link from "next/link";
import { getPackages } from "@/lib/content";
import { getOgImage } from "@/lib/og";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/PackageCard";
import { JsonLd } from "@/components/JsonLd";

const packagesOgImage = getOgImage(
  getPackages()[0]?.photo,
  "Zimbabwe and Southern Africa safari packages across Victoria Falls, Chobe, and Namibia"
);

export const metadata: Metadata = {
  title: "Zimbabwe & Southern Africa Packages",
  description:
    "Explore 5 to 10 day Zimbabwe, Chobe, and Southern Africa safari packages. Customize lodges, Victoria Falls activities, and transfers with instant pricing.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Zimbabwe & Southern Africa Safari Packages | Kaizen Travel and Adventures",
    description:
      "Explore 5 to 10 day Zimbabwe, Chobe, and Southern Africa safari packages. Customize lodges, Victoria Falls activities, and transfers with instant pricing.",
    url: "/packages",
    images: [packagesOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zimbabwe & Southern Africa Safari Packages | Kaizen Travel and Adventures",
    description:
      "Explore tailor-made 5 to 10 day Zimbabwe, Chobe, and Southern Africa safari packages.",
    images: [packagesOgImage.url],
  },
};

export default function PackagesPage() {
  const packages = getPackages();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const packagesLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Curated Safari Packages & Itineraries",
    itemListElement: packages.map((pkg, idx) => {
      const photoSrc = pkg.photo?.src;
      const photoUrl = photoSrc
        ? photoSrc.startsWith("http")
          ? photoSrc
          : `${siteUrl}${photoSrc}`
        : undefined;

      return {
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "TouristTrip",
          name: pkg.title,
          description: pkg.description,
          ...(photoUrl ? { image: photoUrl } : {}),
          touristType: "Safari",
          provider: {
            "@type": "TravelAgency",
            name: "Kaizen Travel and Adventures",
            ...(siteUrl ? { url: siteUrl } : {}),
          },
        },
      };
    }),
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={packagesLd} />
      {/* Top Banner */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <span className="font-heading font-semibold text-xs uppercase tracking-wider text-sun mb-2 block">
            Tailor-Made Multi-Country &amp; Zimbabwe Itineraries
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            Zimbabwe &amp; Southern Africa Safari Packages
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[680px] leading-relaxed">
            Hand-crafted multi-day journeys connecting Victoria Falls, Chobe
            National Park, and Namibia. Add an entire itinerary to your trip
            planner with one click, swap lodges or add airport transfers, and see
            live totals in USD, EUR, GBP, or ZAR.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm font-heading font-medium text-forest">
            <Link href="/destinations/victoria-falls" className="hover:underline">
              Victoria Falls Hub →
            </Link>
            <Link href="/destinations/zimbabwe-safaris" className="hover:underline">
              Zimbabwe Safari Parks →
            </Link>
            <Link href="/destinations/chobe" className="hover:underline">
              Chobe, Botswana →
            </Link>
            <Link href="/destinations/namibia" className="hover:underline">
              Namibia Self-Drive →
            </Link>
            <Link href="/vehicle-hire" className="hover:underline">
              Airport &amp; Border Transfers →
            </Link>
          </div>
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
          <h2 className="sr-only">Package Highlights and Booking Benefits</h2>
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
            <Button href="/trip" variant="primary" className="w-full sm:w-auto justify-center">
              Build custom trip
            </Button>
            <Button
              href="/contact"
              variant="outline"
              className="text-bone border-bone/40 hover:bg-bone/10 w-full sm:w-auto justify-center"
            >
              Contact our team
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}

