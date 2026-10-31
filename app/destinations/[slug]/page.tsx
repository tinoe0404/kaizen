import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/DetailPage";
import { getAll, getBySlug } from "@/lib/content";
import { getCategoryConfig } from "@/content/categories";

export const dynamicParams = false;

export function generateStaticParams() {
  const items = getAll("destination");
  return items.map((item) => ({
    slug: item.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offering = getBySlug("destination", slug);

  if (!offering) {
    return {};
  }

  const config = getCategoryConfig("destination");
  const firstPhoto = offering.photos?.[0];

  return {
    title: offering.name,
    description: offering.summary,
    alternates: { canonical: `${config.path}/${slug}` },
    openGraph: {
      title: offering.name,
      description: offering.summary,
      images: firstPhoto ? [firstPhoto.src] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const offering = getBySlug("destination", slug);

  if (!offering) {
    notFound();
  }

  return <DetailPage category="destination" slug={slug} />;
}

