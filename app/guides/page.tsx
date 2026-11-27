import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/content";
import { guideHref } from "@/lib/routes";
import { getOgImage } from "@/lib/og";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/Photo";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";

const firstGuide = getGuides()[0];
const guidesOgImage = getOgImage(
  firstGuide?.photo,
  "Victoria Falls & Southern Africa Safari Travel Guides | Kaizen Travel and Adventures"
);

export const metadata: Metadata = {
  title: "Victoria Falls & Safari Travel Guides",
  description:
    "Practical planning guides for Victoria Falls, Zimbabwe, Zambia, Chobe, and Namibia: seasons, border crossings, KAZA UniVisa, and activity comparisons.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Victoria Falls & Safari Travel Guides | Kaizen Travel and Adventures",
    description:
      "Practical planning guides for Victoria Falls, Zimbabwe, Zambia, Chobe, and Namibia: seasons, border crossings, KAZA UniVisa, and activity comparisons.",
    url: "/guides",
    images: [guidesOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Victoria Falls & Safari Travel Guides | Kaizen Travel and Adventures",
    description:
      "Practical planning guides for Victoria Falls, Zimbabwe, Zambia, Chobe, and Namibia.",
    images: [guidesOgImage.url],
  },
};

export default function GuidesIndexPage() {
  const allGuides = getGuides();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  const guidesLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Victoria Falls & Southern Africa Safari Travel Guides",
    itemListElement: allGuides.map((guide, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: siteUrl ? `${siteUrl}${guideHref(guide)}` : guideHref(guide),
      name: guide.title,
    })),
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={guidesLd} />

      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <span className="font-heading font-semibold text-xs uppercase tracking-wider text-sun mb-2 block">
            Practical Safari &amp; Border Logistics
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            Victoria Falls &amp; Safari Travel Guides
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[680px] leading-relaxed">
            First-hand planning advice from our Victoria Falls team—covering
            water-level seasons, Zimbabwe vs. Zambia viewpoints, Chobe border
            crossings, visas, and packing essentials.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm font-heading font-medium text-forest">
            <Link href="/packages" className="hover:underline">
              Safari Packages →
            </Link>
            <Link href="/activities" className="hover:underline">
              Activities →
            </Link>
            <Link href="/vehicle-hire" className="hover:underline">
              Airport &amp; Border Transfers →
            </Link>
            <Link href="/faq" className="hover:underline">
              Full FAQ →
            </Link>
          </div>
        </Container>
      </Section>

      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {allGuides.map((guide) => (
              <article
                key={guide.slug}
                className="group relative flex flex-col bg-white border border-sand rounded-[14px] overflow-hidden transition-colors hover:border-forest/40"
              >
                <Photo
                  photo={guide.photo}
                  label={guide.title}
                  className="aspect-[16/10] w-full rounded-t-[14px] rounded-b-none"
                />
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-forest mb-2">
                    <span>{guide.category}</span>
                    <time dateTime={guide.updatedAt} className="text-ink/55 font-normal">
                      Updated {guide.updatedAt}
                    </time>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-ink group-hover:text-forest transition-colors">
                    <Link
                      href={guideHref(guide)}
                      className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[2px]"
                    >
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="font-body text-sm text-ink/75 mt-2.5 leading-relaxed flex-1">
                    {guide.metaDescription}
                  </p>
                  <span className="font-heading font-semibold text-sm text-forest mt-4 inline-flex items-center gap-1">
                    Read guide →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-4">
            Ready to turn planning into an itinerary?
          </h2>
          <Button href="/trip" variant="primary">
            Open trip planner
          </Button>
        </Container>
      </Section>
    </div>
  );
}
