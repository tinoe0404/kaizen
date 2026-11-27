import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Category, Offering } from "@/content/types";
import { getCategoryConfig } from "@/content/categories";
import { getBySlug, getAll, getByDestination, getPackages } from "@/lib/content";
import { priceLine, unitLabel } from "@/lib/pricing";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Gallery } from "@/components/Gallery";
import { OfferingCard } from "@/components/OfferingCard";
import { PackageCard } from "@/components/PackageCard";
import { safeStr } from "@/lib/structured-data";
import { packageHref } from "@/lib/routes";
import { faqs, FaqItem } from "@/content/faq";

const DESTINATION_FAQ_IDS: Record<string, string[]> = {
  "victoria-falls": ["vic-falls-water-levels", "kaza-univisa", "zimbabwe-currency-cash"],
  chobe: ["wildlife-safari-season", "border-crossing-vic-falls-chobe", "botswana-namibia-visas"],
  namibia: ["namibia-climate", "cross-border-self-drive", "botswana-namibia-money"],
  "zimbabwe-safaris": ["wildlife-safari-season", "zimbabwe-currency-cash", "safari-packing-list"],
};

function getDestinationFaqs(slug: string): FaqItem[] {
  const ids = DESTINATION_FAQ_IDS[slug];
  if (!ids) return [];
  return ids
    .map((id) => faqs.find((f) => f.id === id))
    .filter((f): f is FaqItem => Boolean(f));
}

export interface DetailPageProps {
  category: Category;
  slug: string;
}

interface ContextualLink {
  label: string;
  href: string;
  note: string;
}

function getContextualLinks(offering: Offering): ContextualLink[] {
  const links: ContextualLink[] = [];
  const seen = new Set<string>();
  const addLink = (href: string, label: string, note: string) => {
    if (!seen.has(href)) {
      seen.add(href);
      links.push({ href, label, note });
    }
  };

  if (offering.category === "vehicle") {
    addLink("/vehicle-hire", "Compare all transfer & shuttle rates", "Full rate matrix");
    if (offering.id === "vehicle-kasane-chobe") {
      addLink("/destinations/chobe", "Explore Chobe, Botswana", "Destination hub");
      addLink("/activities/chobe-day-trip", "Chobe Day Trip from Victoria Falls", "Game drive & boat");
      addLink("/lodges/chobe-safari-lodge", "Chobe Safari Lodge", "Riverside lodge");
    } else if (offering.id === "vehicle-livingstone") {
      addLink("/activities/devils-pool", "Devil's Pool Swim (Livingstone Island)", "Aug–Jan low water");
      addLink("/activities/microlight", "Microlight Flight over Victoria Falls", "Zambia airstrip");
      addLink("/faq", "KAZA UniVisa & bridge border rules", "Visa guide");
    } else if (offering.id === "vehicle-hwange") {
      addLink("/destinations/zimbabwe-safaris", "Zimbabwe Safari Parks Hub", "Hwange, Mana & Matobo");
      addLink("/lodges/hwange-safari-lodge", "Hwange Safari Lodge", "Waterhole camp");
    } else {
      addLink("/destinations/victoria-falls", "Explore Victoria Falls Hub", "Activities & lodges");
      addLink("/activities", "Browse Victoria Falls activities", "Cruises, rafting & bungee");
      addLink("/lodges", "Browse Victoria Falls lodges", "Riverside & bush camps");
    }
    addLink("/packages", "Explore curated safari packages", "Multi-day itineraries");
  } else {
    if (offering.destinationSlug === "chobe") {
      addLink(
        "/vehicle-hire/kasane-chobe-botswana-transfer",
        "Victoria Falls to Kasane / Chobe Transfer",
        "Kazungula border crossing"
      );
    } else if (offering.slug === "devils-pool" || offering.slug === "microlight") {
      addLink(
        "/vehicle-hire/livingstone-zambia-transfer",
        "Livingstone Cross-Border Transfer (Zambia)",
        "Bridge & visa assist"
      );
    } else if (offering.destinationSlug === "zimbabwe-safaris") {
      addLink(
        "/vehicle-hire/hwange-national-park-transfer",
        "Hwange National Park Highway Transfer",
        "From Victoria Falls"
      );
    } else if (offering.destinationSlug === "victoria-falls") {
      addLink(
        "/vehicle-hire/victoria-falls-airport-transfer",
        "Victoria Falls Airport (VFA) Transfer",
        "From $15 shuttle / $30 taxi"
      );
      addLink(
        "/vehicle-hire/inter-hotel-town-taxi",
        "Local Town & Inter-Hotel Taxis",
        "From $5 per vehicle"
      );
    }

    const containingPkgs = getPackages().filter((pkg) =>
      pkg.itemIds.includes(offering.id)
    );
    for (const pkg of containingPkgs) {
      addLink(
        packageHref(pkg),
        `Included in ${pkg.title}`,
        pkg.duration
      );
    }
    if (offering.destinationSlug === "chobe") {
      addLink(
        "/guides/victoria-falls-to-chobe-travel-guide",
        "Victoria Falls to Chobe Travel Guide",
        "Transfers & border tips"
      );
    } else if (offering.slug === "devils-pool" || offering.slug === "bunji") {
      addLink(
        "/guides/victoria-falls-zimbabwe-vs-zambia",
        "Victoria Falls: Zimbabwe vs. Zambia Guide",
        "Bridge & side comparison"
      );
    } else if (offering.destinationSlug === "victoria-falls") {
      addLink(
        "/guides/best-time-to-visit-victoria-falls",
        "Best Time to Visit Victoria Falls",
        "High vs. low water guide"
      );
    }
    addLink("/faq", "Visas, currency & seasonal tips", "Planning guide");
  }

  return links;
}

export function DetailPage({ category, slug }: DetailPageProps) {
  const offering = getBySlug(category, slug);

  if (!offering) {
    notFound();
  }

  const config = getCategoryConfig(category);
  const isDestination = category === "destination";

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

  // Compute destination offerings if this is a destination hub
  const itemsInDest = isDestination ? getByDestination(offering.slug) : [];
  const destinationActivities = itemsInDest.filter((item) => item.category === "activity");
  const destinationLodges = itemsInDest.filter((item) => item.category === "lodge");
  const destinationTransfers = itemsInDest.filter((item) => item.category === "vehicle");
  const destinationPackages = isDestination
    ? getPackages().filter(
        (pkg) =>
          pkg.itemIds.includes(offering.id) ||
          pkg.destination.toLowerCase().includes(offering.name.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(offering.slug.replace(/-/g, " "))
      )
    : [];

  const contextualLinks = !isDestination ? getContextualLinks(offering) : [];

  // Compute related items for standard products
  let relatedHeading = "";
  let relatedItems: Offering[] = [];

  if (!isDestination) {
    relatedHeading = `More ${config.title.toLowerCase()}`;
    const others = getAll(category).filter((item) => item.id !== offering.id);
    const sameDest = offering.destinationSlug
      ? others.filter((item) => item.destinationSlug === offering.destinationSlug)
      : [];
    const otherDest = offering.destinationSlug
      ? others.filter((item) => item.destinationSlug !== offering.destinationSlug)
      : others;
    relatedItems = [...sameDest, ...otherDest].slice(0, 3);
  }

  const destinationFaqs = isDestination ? getDestinationFaqs(offering.slug) : [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageUrl = `${siteUrl}${config.path}/${offering.slug}`;
  const safeName = safeStr(offering.name);
  const safeDesc = safeStr(offering.description);
  const firstPhoto = offering.photos?.[0];

  // BreadcrumbList JSON-LD
  const breadcrumbLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl || undefined,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: config.title,
        item: siteUrl ? `${siteUrl}${config.path}` : undefined,
      },
      ...(safeName
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: safeName,
            },
          ]
        : []),
    ],
  };

  // TouristDestination JSON-LD (destinations only, with real data)
  const showDestinationLd =
    category === "destination" && safeName && safeDesc;

  const photoUrl = firstPhoto?.src
    ? firstPhoto.src.startsWith("http")
      ? firstPhoto.src
      : `${siteUrl}${firstPhoto.src}`
    : undefined;

  const destinationLd: Record<string, unknown> | null = showDestinationLd
    ? {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: safeName,
        description: safeDesc,
        url: siteUrl ? pageUrl : undefined,
        ...(photoUrl ? { image: photoUrl } : {}),
      }
    : null;

  // TouristTrip JSON-LD (activities only, with real pricing and provider)
  const activityLd: Record<string, unknown> | null =
    category === "activity" && safeName && safeDesc
      ? {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: safeName,
          description: safeDesc,
          url: siteUrl ? pageUrl : undefined,
          ...(photoUrl ? { image: photoUrl } : {}),
          ...(offering.pricing?.amountUsd
            ? {
                offers: {
                  "@type": "Offer",
                  price: offering.pricing.amountUsd,
                  priceCurrency: "USD",
                  url: siteUrl ? pageUrl : undefined,
                },
              }
            : {}),
          provider: {
            "@type": "TravelAgency",
            name: "Kaizen Travel and Adventures",
            ...(siteUrl ? { url: siteUrl } : {}),
          },
        }
      : null;

  // Accommodation JSON-LD (lodges only, with real pricing)
  const lodgeLd: Record<string, unknown> | null =
    category === "lodge" && safeName && safeDesc
      ? {
          "@context": "https://schema.org",
          "@type": "Accommodation",
          name: safeName,
          description: safeDesc,
          url: siteUrl ? pageUrl : undefined,
          ...(photoUrl ? { image: photoUrl } : {}),
          ...(offering.pricing?.amountUsd
            ? {
                offers: {
                  "@type": "Offer",
                  price: offering.pricing.amountUsd,
                  priceCurrency: "USD",
                  url: siteUrl ? pageUrl : undefined,
                },
              }
            : {}),
        }
      : null;

  // Service JSON-LD (vehicle hire & transfer services only, with real pricing and provider)
  const vehicleLd: Record<string, unknown> | null =
    category === "vehicle" && safeName && safeDesc
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Transportation and Transfer Service",
          name: safeName,
          description: safeDesc,
          url: siteUrl ? pageUrl : undefined,
          ...(photoUrl ? { image: photoUrl } : {}),
          ...(offering.pricing?.amountUsd
            ? {
                offers: {
                  "@type": "Offer",
                  price: offering.pricing.amountUsd,
                  priceCurrency: "USD",
                  url: siteUrl ? pageUrl : undefined,
                },
              }
            : {}),
          provider: {
            "@type": "TravelAgency",
            name: "Kaizen Travel and Adventures",
            ...(siteUrl ? { url: siteUrl } : {}),
          },
        }
      : null;

  return (
    <div className="w-full flex flex-col">
      {safeName && <JsonLd data={breadcrumbLd} />}
      {destinationLd && <JsonLd data={destinationLd} />}
      {activityLd && <JsonLd data={activityLd} />}
      {lodgeLd && <JsonLd data={lodgeLd} />}
      {vehicleLd && <JsonLd data={vehicleLd} />}

      {/* Top Section with Breadcrumb, Gallery, and Info Panel */}
      <Section className="bg-bone pt-4 pb-12 md:pb-16">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="pb-6 overflow-x-auto no-scrollbar py-1">
            <ol className="flex items-center gap-2 text-sm text-ink/75 font-body whitespace-nowrap">
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
            <div className="lg:col-span-5 w-full flex flex-col bg-white p-4 sm:p-6 md:p-8 rounded-[14px] border border-sand">
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink leading-tight">
                {offering.name}
              </h1>

              <p className="font-body text-ink/80 text-base sm:text-lg leading-relaxed mt-3">
                {offering.summary}
              </p>

              {/* Price / Offering summary */}
              {isDestination ? (
                <div className="mt-6 pt-5 border-t border-sand/80">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-heading font-semibold uppercase tracking-wider mb-2">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.244-.77 3.031-2.07 4.707-4.103 2.15-2.61 3.921-5.99 3.921-9.249 0-4.97-4.03-9-9-9s-9 4.03-9 9c0 3.259 1.771 6.639 3.921 9.249 1.676 2.033 3.463 3.333 4.707 4.103.311.193.571.337.757.433a5.73 5.73 0 00.28.14l.019.008.006.003.003.001zm.31-11.933a2 2 0 110-4 2 2 0 010 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Explorer Destination Hub</span>
                  </div>
                  <p className="font-heading font-semibold text-xl sm:text-2xl text-forest">
                    {destinationActivities.length} {destinationActivities.length === 1 ? "Activity" : "Activities"} · {destinationLodges.length} {destinationLodges.length === 1 ? "Lodge" : "Lodges"}
                    {destinationTransfers.length > 0 && ` · ${destinationTransfers.length} ${destinationTransfers.length === 1 ? "Transfer" : "Transfers"}`}
                  </p>
                  <p className="font-body text-sm text-ink/70 mt-1">
                    Select activities and lodges below to add them directly to your trip request.
                  </p>
                </div>
              ) : (
                <div className="mt-6 pt-5 border-t border-sand/80">
                  <p className="font-heading font-semibold text-2xl sm:text-3xl text-forest">
                    {priceLine(offering)}
                  </p>
                  <p className="font-heading text-sm uppercase tracking-wider text-ink/60 mt-1">
                    {unitLabel(offering.pricing.unit)}
                  </p>
                </div>
              )}

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
                {isDestination ? (
                  <>
                    <Button
                      href="#explore-activities"
                      variant="primary"
                      className="w-full justify-center"
                    >
                      Browse activities & stays ↓
                    </Button>
                    <Button
                      href={`/trip?destination=${encodeURIComponent(offering.slug)}`}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      Plan a trip to {offering.name}
                    </Button>
                    <WhatsAppLink
                      message={`Hi, I am planning a journey to ${offering.name} and would like some guidance.`}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      Ask safari team on WhatsApp
                    </WhatsAppLink>
                  </>
                ) : (
                  <>
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
                    <p className="text-sm text-ink/65 text-center mt-1 font-body">
                      This is a request, not a booking. We confirm availability and
                      payment with you.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {paragraphs.length > 0 && (
            <div className="mt-12 pt-10 border-t border-forest/10 max-w-3xl">
              <h2 className="font-heading font-bold text-2xl text-ink mb-4">
                About {offering.name}
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
              {contextualLinks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-sand">
                  <h3 className="font-heading font-semibold text-base text-ink mb-3">
                    Helpful connections &amp; logistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contextualLinks.map((cLink) => (
                      <Link
                        key={cLink.href}
                        href={cLink.href}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-[10px] bg-white border border-sand hover:border-forest/40 transition-colors group"
                      >
                        <div className="min-w-0">
                          <span className="font-heading font-semibold text-sm text-ink group-hover:text-forest transition-colors block truncate">
                            {cLink.label}
                          </span>
                          <span className="font-body text-xs text-ink/60 block">
                            {cLink.note}
                          </span>
                        </div>
                        <span className="text-forest font-heading font-bold text-sm shrink-0" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>

      {/* ── DESTINATION HUB SECTIONS (When viewing a Destination) ── */}
      {isDestination ? (
        <>
          {/* Section: Activities in this Destination */}
          {destinationActivities.length > 0 && (
            <Section id="explore-activities" className="bg-sand/30 border-t border-forest/10 py-12 md:py-16 scroll-mt-20">
              <Container>
                <div className="max-w-2xl mb-8 sm:mb-10">
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                    Things to do in {offering.name}
                  </h2>
                  <p className="font-body text-ink/75 text-base sm:text-lg mt-2">
                    Hand-picked safari activities, scenic flights and day adventures. Add any to your trip builder.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {destinationActivities.map((act) => (
                    <OfferingCard
                      key={act.id}
                      offering={act}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Section: Where to Stay in this Destination */}
          {destinationLodges.length > 0 && (
            <Section id="explore-lodges" className="bg-bone border-t border-forest/10 py-12 md:py-16 scroll-mt-20">
              <Container>
                <div className="max-w-2xl mb-8 sm:mb-10">
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                    Where to stay in {offering.name}
                  </h2>
                  <p className="font-body text-ink/75 text-base sm:text-lg mt-2">
                    Premier safari lodges, luxury bush camps, and river retreats across {offering.name}.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {destinationLodges.map((lodge) => (
                    <OfferingCard
                      key={lodge.id}
                      offering={lodge}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Section: Transfers & Getting Around this Destination */}
          {destinationTransfers.length > 0 && (
            <Section id="explore-transfers" className="bg-bone border-t border-forest/10 py-12 md:py-16">
              <Container>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                  <div className="max-w-2xl">
                    <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                      Transfers &amp; getting around {offering.name}
                    </h2>
                    <p className="font-body text-ink/75 text-base sm:text-lg mt-2">
                      Airport pickups, cross-border shuttles, and highway transfers connecting {offering.name}.
                    </p>
                  </div>
                  <Link
                    href="/vehicle-hire"
                    className="font-heading font-semibold text-forest hover:text-ink text-sm sm:text-base shrink-0"
                  >
                    Full transfer rate sheet →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {destinationTransfers.map((tr) => (
                    <OfferingCard
                      key={tr.id}
                      offering={tr}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Section: Packages Visiting this Destination */}
          {destinationPackages.length > 0 && (
            <Section className="bg-sand/30 border-t border-forest/10 py-12 md:py-16">
              <Container>
                <div className="max-w-2xl mb-8 sm:mb-10">
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
                    Ready-made packages visiting {offering.name}
                  </h2>
                  <p className="font-body text-ink/75 text-base sm:text-lg mt-2">
                    Complete itineraries combining activities, accommodation and transfers with 1-click addition.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  {destinationPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      pkg={pkg}
                      headingLevel="h3"
                    />
                  ))}
                </div>
              </Container>
            </Section>
          )}

          {/* Section: Destination Travel Guidance & FAQs */}
          {destinationFaqs.length > 0 && (
            <Section className="bg-bone border-t border-forest/10 py-12 md:py-16">
              <Container>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div className="max-w-2xl">
                    <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                      Travel guidance &amp; best time to visit {offering.name}
                    </h2>
                    <p className="font-body text-ink/75 text-base mt-2">
                      Practical visa, seasonality, and logistics notes verified for {offering.name}.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm font-heading font-semibold text-forest shrink-0">
                    <Link href="/guides" className="hover:underline">
                      Travel Guides →
                    </Link>
                    <Link href="/faq" className="hover:underline">
                      Full FAQ →
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {destinationFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-sand rounded-[12px] p-5 flex flex-col gap-2"
                    >
                      <h3 className="font-heading font-bold text-base text-ink">
                        {faq.question}
                      </h3>
                      <p className="font-body text-sm text-ink/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Container>
            </Section>
          )}
        </>
      ) : (
        /* Standard Related Items for non-destinations */
        relatedItems.length > 0 && (
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
        )
      )}

      {/* Bottom CTA Band */}
      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-6">
            {isDestination
              ? `Ready to plan your trip to ${offering.name}?`
              : "Ready to put it together?"}
          </h2>
          <Button
            href={
              isDestination
                ? `/trip?destination=${encodeURIComponent(offering.slug)}`
                : "/trip"
            }
            variant="primary"
          >
            {isDestination
              ? `Build your ${offering.name} trip`
              : "Build your trip"}
          </Button>
        </Container>
      </Section>
    </div>
  );
}

