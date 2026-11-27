import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackageDetailPage } from "@/components/PackageDetailPage";
import { getPackageBySlug, getPackages } from "@/lib/content";
import { getPackageMetadata } from "@/lib/og";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPackages().map((pkg) => ({
    slug: pkg.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getPackageMetadata(slug);
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetailPage slug={slug} />;
}
