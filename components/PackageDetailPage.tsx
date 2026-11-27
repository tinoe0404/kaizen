import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Offering, SafariPackage } from "@/content/types";
import { getById, getPackageBySlug, getPackages } from "@/lib/content";
import { offeringHref, packageHref } from "@/lib/routes";
import { priceLine, unitLabel } from "@/lib/pricing";
import { safeStr } from "@/lib/structured-data";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/Photo";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PackageAddButton } from "@/components/PackageAddButton";
import { PackageCard } from "@/components/PackageCard";

export interface PackageDetailPageProps {
  slug: string;
}

interface PackageFaq {
  question: string;
  answer: string;
}

function getPackageFaqs(pkg: SafariPackage): PackageFaq[] {
  const faqs: PackageFaq[] = [
    {
      question: "How is the price for this package calculated?",
      answer:
        "Each lodge, activity, and transfer in this package has a published USD rate. Adding the package to your trip planner calculates an instant estimate based on your travel dates and guest count, with live conversion to USD, EUR, GBP, or ZAR.",
    },
    {
      question: "Can I customize the lodges, activities, or duration?",
      answer:
        "Yes. Once you add this package to the trip planner, you can remove items, add extra activities or airport transfers, or adjust your arrival and departure dates before sending your booking request.",
    },
  ];

  if (pkg.itemIds.includes("destination-chobe")) {
    faqs.push({
      question: "What visa do I need for the Victoria Falls and Chobe border crossing?",
      answer:
        "Travellers staying overnight in Chobe, Botswana and returning to Zimbabwe should ensure they hold a double-entry Zimbabwe visa (a single-entry KAZA UniVisa covers day trips into Botswana via Kazungula, not overnight stays).",
    });
  }

  if (pkg.itemIds.includes("destination-namibia")) {
    faqs.push({
      question: "How are road transfers and vehicles arranged in Namibia?",
      answer:
        "Route planning and vehicle coordination are confirmed with our team upon enquiry based on your arrival airport, travel dates, and group size.",
    });
  }

  return faqs;
}

export function PackageDetailPage({ slug }: PackageDetailPageProps) {
  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    notFound();
  }

  const resolvedItems = pkg.itemIds
    .map((id) => getById(id))
    .filter((item): item is Offering => Boolean(item));

  const destinations = resolvedItems.filter((i) => i.category === "destination");
  const lodges = resolvedItems.filter((i) => i.category === "lodge");
  const activities = resolvedItems.filter((i) => i.category === "activity");
  const vehicles = resolvedItems.filter((i) => i.category === "vehicle");

  const otherPackages = getPackages().filter((p) => p.id !== pkg.id);
  const faqs = getPackageFaqs(pkg);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageUrl = `${siteUrl}${packageHref(pkg)}`;
  const safeTitle = safeStr(pkg.title);
  const safeDesc = safeStr(pkg.description);
  const photoUrl = pkg.photo?.src
    ? pkg.photo.src.startsWith("http")
      ? pkg.photo.src
      : `${siteUrl}${pkg.photo.src}`
    : undefined;

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
        name: "Packages",
        item: siteUrl ? `${siteUrl}/packages` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: safeTitle,
        item: siteUrl ? pageUrl : undefined,
      },
    ],
  };

  const tripLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: safeTitle,
    description: safeDesc,
    touristType: "Safari",
    ...(siteUrl ? { url: pageUrl } : {}),
    ...(photoUrl ? { image: photoUrl } : {}),
    provider: {
      "@type": "TravelAgency",
      name: "Kaizen Travel and Adventures",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    ...(destinations.length > 0
      ? {
          itinerary: {
            "@type": "ItemList",
            itemListElement: destinations.map((dest, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "TouristDestination",
                name: dest.name,
                ...(siteUrl ? { url: `${siteUrl}${offeringHref(dest)}` } : {}),
              },
            })),
          },
        }
      : {}),
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={tripLd} />

      {/* Top Breadcrumb + Hero Summary */}
      <Section className="bg-bone pt-4 pb-12 md:pb-16">
        <Container>
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
                  href="/packages"
                  className="hover:text-forest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[2px]"
                >
                  Packages
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/40 select-none">
                /
              </li>
              <li aria-current="page" className="font-medium text-ink truncate max-w-[240px] sm:max-w-none">
                {pkg.title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="relative rounded-[14px] overflow-hidden border border-sand">
                <Photo
                  photo={pkg.photo}
                  label={pkg.title}
                  className="aspect-[16/10] w-full"
                  priority
                />
                {pkg.badge && (
                  <span className="absolute top-3 left-3 bg-forest text-bone font-heading font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                    {pkg.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-forest">
                <span className="bg-forest/10 px-2.5 py-1 rounded-control">
                  {pkg.duration}
                </span>
                <span className="bg-sand/70 text-ink/80 px-2.5 py-1 rounded-control">
                  {pkg.destination}
                </span>
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink leading-tight">
                {pkg.title}
              </h1>

              <p className="font-body text-ink/80 text-base sm:text-lg leading-relaxed">
                {pkg.subtitle}
              </p>

              <div className="p-4 rounded-[12px] bg-white border border-sand flex flex-col gap-3">
                <p className="font-heading font-semibold text-sm text-ink">
                  Includes {resolvedItems.length} curated components across{" "}
                  {destinations.length > 0 ? destinations.map((d) => d.name).join(", ") : pkg.destination}
                </p>
                <p className="font-body text-xs text-ink/70 leading-relaxed">
                  Add all components to your trip planner in one click to see live
                  multi-currency totals (USD, EUR, GBP, ZAR) for your exact dates
                  and group size.
                </p>
                <PackageAddButton itemIds={pkg.itemIds} />
                <div className="pt-2 border-t border-sand flex flex-wrap items-center gap-4 text-xs font-heading font-medium">
                  <WhatsAppLink className="text-forest hover:underline">
                    Ask on WhatsApp →
                  </WhatsAppLink>
                  <Link href="/contact" className="text-ink/75 hover:text-forest hover:underline">
                    Send custom enquiry →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Overview & Highlights */}
      <Section sand className="py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-4">
                Package overview
              </h2>
              <p className="font-body text-ink/85 text-base sm:text-lg leading-relaxed">
                {pkg.description}
              </p>
            </div>

            <div className="lg:col-span-5 bg-white border border-sand rounded-[14px] p-5 sm:p-6">
              <h2 className="font-heading font-bold text-lg text-ink mb-3">
                Key highlights
              </h2>
              <ul className="space-y-2.5">
                {pkg.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-body text-ink/85">
                    <span
                      className="w-5 h-5 rounded-full bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Destinations, Accommodation, Activities & Transport */}
      <Section className="bg-bone py-12 md:py-16 border-t border-forest/10">
        <Container className="space-y-12">
          {/* Destinations Covered */}
          {destinations.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-2">
                Destinations covered
              </h2>
              <p className="font-body text-ink/75 text-sm sm:text-base mb-6">
                Explore each destination hub for local logistics, additional tours, and regional context.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {destinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={offeringHref(dest)}
                    className="group bg-white border border-sand hover:border-forest/40 rounded-[12px] p-5 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-lg text-ink group-hover:text-forest transition-colors">
                        {dest.name}
                      </h3>
                      <p className="font-body text-sm text-ink/75 mt-1.5 leading-relaxed">
                        {dest.summary}
                      </p>
                    </div>
                    <span className="font-heading font-semibold text-xs text-forest">
                      Explore {dest.name} hub →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Included Accommodation */}
          {lodges.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-2">
                Included accommodation
              </h2>
              <p className="font-body text-ink/75 text-sm sm:text-base mb-6">
                Published nightly rates are combined automatically in the trip planner based on your dates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {lodges.map((lodge) => (
                  <Link
                    key={lodge.id}
                    href={offeringHref(lodge)}
                    className="group bg-white border border-sand hover:border-forest/40 rounded-[12px] p-5 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-bold text-lg text-ink group-hover:text-forest transition-colors">
                          {lodge.name}
                        </h3>
                        <span className="text-xs font-heading font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-control shrink-0">
                          {priceLine(lodge)}
                        </span>
                      </div>
                      <p className="font-body text-xs text-ink/60 mt-0.5">
                        {unitLabel(lodge.pricing.unit)}
                      </p>
                      <p className="font-body text-sm text-ink/75 mt-2 leading-relaxed">
                        {lodge.summary}
                      </p>
                    </div>
                    <span className="font-heading font-semibold text-xs text-forest">
                      View lodge details →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Included Activities */}
          {activities.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-2">
                Included activities &amp; excursions
              </h2>
              <p className="font-body text-ink/75 text-sm sm:text-base mb-6">
                Open any activity to view full excursion notes, pricing basis, and logistics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {activities.map((act) => (
                  <Link
                    key={act.id}
                    href={offeringHref(act)}
                    className="group bg-white border border-sand hover:border-forest/40 rounded-[12px] p-5 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-bold text-base text-ink group-hover:text-forest transition-colors">
                          {act.name}
                        </h3>
                        <span className="text-xs font-heading font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-control shrink-0">
                          {priceLine(act)}
                        </span>
                      </div>
                      <p className="font-body text-sm text-ink/75 mt-2 leading-relaxed">
                        {act.summary}
                      </p>
                    </div>
                    <span className="font-heading font-semibold text-xs text-forest">
                      View activity →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Transport Arrangements */}
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-2">
              Transport &amp; transfer arrangements
            </h2>
            <div className="bg-white border border-sand rounded-[12px] p-5 sm:p-6 space-y-4">
              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((veh) => (
                    <Link
                      key={veh.id}
                      href={offeringHref(veh)}
                      className="group p-4 rounded-[10px] border border-sand hover:border-forest/40 transition-colors flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-bold text-base text-ink group-hover:text-forest transition-colors">
                          {veh.name}
                        </span>
                        <span className="text-xs font-heading font-semibold text-forest">
                          {priceLine(veh)}
                        </span>
                      </div>
                      <p className="font-body text-sm text-ink/75">{veh.summary}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed">
                  Airport pickups and cross-border road transfers are arranged to match
                  your flight arrival and lodge check-in times. Add transfers directly
                  in the trip planner or review published rates below.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm font-heading font-medium text-forest">
                <Link href="/vehicle-hire" className="hover:underline">
                  All transfer &amp; shuttle rates →
                </Link>
                {pkg.itemIds.includes("destination-victoria-falls") && (
                  <Link href="/vehicle-hire/victoria-falls-airport-transfer" className="hover:underline">
                    Victoria Falls Airport (VFA) transfer →
                  </Link>
                )}
                {pkg.itemIds.includes("destination-chobe") && (
                  <Link href="/vehicle-hire/kasane-chobe-botswana-transfer" className="hover:underline">
                    Kasane / Chobe border transfer →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Pricing Basis & Inclusions/Exclusions */}
      <Section sand className="py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-sand rounded-[14px] p-6">
              <h2 className="font-heading font-bold text-xl text-ink mb-3">
                Pricing basis &amp; itinerary scheduling
              </h2>
              <p className="font-body text-sm text-ink/80 leading-relaxed mb-3">
                Rather than a fixed opaque bundle, this {pkg.duration} itinerary
                calculates its estimate transparently from the published rates of
                the selected destinations, lodges, activities, and vehicles in the{" "}
                <Link href="/trip" className="text-forest font-medium hover:underline">
                  trip planner
                </Link>
                .
              </p>
              <p className="font-body text-sm text-ink/80 leading-relaxed">
                Exact day-by-day sequencing is coordinated with our safari team
                after you submit your preferred travel dates, ensuring flight
                connections, border crossings, and park drive timings align cleanly.
              </p>
            </div>

            <div className="bg-white border border-sand rounded-[14px] p-6">
              <h2 className="font-heading font-bold text-xl text-ink mb-3">
                What&apos;s included &amp; typical exclusions
              </h2>
              <p className="font-body text-sm text-ink/80 leading-relaxed mb-3">
                <strong>Included in this package selection:</strong>{" "}
                {resolvedItems.map((i) => i.name).join(", ")}.
              </p>
              <p className="font-body text-sm text-ink/80 leading-relaxed">
                <strong>Not included by default:</strong> International flights,
                personal travel insurance, visa or border-crossing fees (such as
                the KAZA UniVisa or single/double-entry visas), and optional
                add-on transfers unless added in your trip plan.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Package FAQs */}
      <Section className="bg-bone py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
              Frequently asked questions
            </h2>
            <Link href="/faq" className="font-heading font-semibold text-sm text-forest hover:underline">
              Full FAQ &amp; planning guide →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-sand rounded-[12px] p-5">
                <h3 className="font-heading font-bold text-base text-ink mb-2">
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

      {/* Other Packages */}
      {otherPackages.length > 0 && (
        <Section sand className="py-12 md:py-16 border-t border-forest/10">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                More safari packages
              </h2>
              <Link href="/packages" className="font-heading font-semibold text-sm text-forest hover:underline">
                Compare all packages →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherPackages.map((other) => (
                <PackageCard key={other.id} pkg={other} headingLevel="h3" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Bottom CTA */}
      <Section className="bg-ink text-bone py-14 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-bone mb-3">
            Ready to book {pkg.title}?
          </h2>
          <p className="font-body text-bone/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Load this {pkg.duration} itinerary into your trip planner or contact
            our Victoria Falls team to tailor dates and room types.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button href="/trip" variant="primary" className="w-full sm:w-auto justify-center">
              Open trip planner
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
