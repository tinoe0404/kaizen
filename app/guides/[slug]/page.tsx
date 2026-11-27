import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getGuides } from "@/lib/content";
import { getGuideMetadata } from "@/lib/og";
import { guideHref } from "@/lib/routes";
import { safeStr } from "@/lib/structured-data";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getGuideMetadata(slug);
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const pageUrl = `${siteUrl}${guideHref(guide)}`;
  const photoUrl = guide.photo?.src
    ? guide.photo.src.startsWith("http")
      ? guide.photo.src
      : `${siteUrl}${guide.photo.src}`
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
        name: "Travel Guides",
        item: siteUrl ? `${siteUrl}/guides` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: safeStr(guide.title),
        item: siteUrl ? pageUrl : undefined,
      },
    ],
  };

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: safeStr(guide.title),
    description: safeStr(guide.metaDescription),
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    ...(siteUrl ? { mainEntityOfPage: pageUrl } : {}),
    ...(photoUrl ? { image: photoUrl } : {}),
    author: {
      "@type": "TravelAgency",
      name: "Kaizen Travel and Adventures",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    publisher: {
      "@type": "TravelAgency",
      name: "Kaizen Travel and Adventures",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={articleLd} />

      <Section className="bg-bone pt-4 pb-10 md:pb-14">
        <Container>
          <nav aria-label="Breadcrumb" className="pb-6 overflow-x-auto no-scrollbar py-1">
            <ol className="flex items-center gap-2 text-sm text-ink/75 font-body whitespace-nowrap">
              <li>
                <Link href="/" className="hover:text-forest transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/40 select-none">
                /
              </li>
              <li>
                <Link href="/guides" className="hover:text-forest transition-colors">
                  Travel Guides
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink/40 select-none">
                /
              </li>
              <li aria-current="page" className="font-medium text-ink truncate max-w-[240px] sm:max-w-none">
                {guide.title}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-heading font-semibold uppercase tracking-wider text-forest mb-3">
              <span className="bg-forest/10 px-2.5 py-1 rounded-control">
                {guide.category}
              </span>
              <time dateTime={guide.updatedAt} className="text-ink/60 font-normal">
                Updated {guide.updatedAt}
              </time>
            </div>

            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink leading-tight">
              {guide.title}
            </h1>

            <p className="font-body text-ink/80 text-base sm:text-lg mt-4 leading-relaxed">
              {guide.intro}
            </p>
          </div>

          <div className="mt-8 max-w-4xl rounded-[14px] overflow-hidden border border-sand">
            <Photo
              photo={guide.photo}
              label={guide.title}
              className="aspect-[16/9] w-full"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>
        </Container>
      </Section>

      <Section sand className="py-12 md:py-16 border-t border-forest/10">
        <Container>
          <div className="max-w-3xl space-y-10">
            {guide.verificationNote && (
              <div className="p-4 rounded-[12px] bg-white border border-forest/20 text-sm font-body text-ink/80 leading-relaxed">
                <strong className="font-heading text-forest block mb-1">
                  Travel verification note
                </strong>
                {guide.verificationNote}
              </div>
            )}

            {guide.sections.map((sec) => (
              <section key={sec.heading} className="space-y-3">
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                  {sec.heading}
                </h2>
                <div className="space-y-3">
                  {sec.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className="font-body text-base sm:text-lg text-ink/85 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Related Commercial Links */}
            <div className="pt-8 border-t border-sand">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-ink mb-4">
                Plan &amp; book related trips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guide.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-3 p-4 rounded-[12px] bg-white border border-sand hover:border-forest/40 transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="font-heading font-semibold text-sm text-ink group-hover:text-forest transition-colors block truncate">
                        {link.label}
                      </span>
                      <span className="font-body text-xs text-ink/65 block">
                        {link.note}
                      </span>
                    </div>
                    <span className="text-forest font-heading font-bold text-sm shrink-0" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-ink text-bone py-14 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-bone mb-3">
            Want tailored advice for your dates?
          </h2>
          <p className="font-body text-bone/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Build your itinerary in our trip planner for live multi-currency
            estimates, or message our Victoria Falls team directly.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Button href="/trip" variant="primary" className="w-full sm:w-auto justify-center">
              Build your trip
            </Button>
            <Button
              href="/guides"
              variant="outline"
              className="text-bone border-bone/40 hover:bg-bone/10 w-full sm:w-auto justify-center"
            >
              All travel guides
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
