import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/DetailPage";
import { getAll, getBySlug } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const items = getAll("lodge");
  return items.map((item) => ({
    slug: item.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offering = getBySlug("lodge", slug);

  if (!offering) {
    return {};
  }

  const firstPhoto = offering.photos?.[0];

  return {
    title: `${offering.name} | Kaizen Travel and Adventures`,
    description: offering.summary,
    openGraph: {
      title: `${offering.name} | Kaizen Travel and Adventures`,
      description: offering.summary,
      images: firstPhoto ? [firstPhoto.src] : [],
    },
  };
}

export default async function LodgeDetailPage({ params }: Props) {
  const { slug } = await params;
  const offering = getBySlug("lodge", slug);

  if (!offering) {
    notFound();
  }

  return <DetailPage category="lodge" slug={slug} />;
}

