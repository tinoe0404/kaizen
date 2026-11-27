import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/DetailPage";
import { getAll, getBySlug } from "@/lib/content";
import { getOfferingMetadata } from "@/lib/og";

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
  return getOfferingMetadata("lodge", slug);
}

export default async function LodgeDetailPage({ params }: Props) {
  const { slug } = await params;
  const offering = getBySlug("lodge", slug);

  if (!offering) {
    notFound();
  }

  return <DetailPage category="lodge" slug={slug} />;
}

