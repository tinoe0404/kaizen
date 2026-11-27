import type { MetadataRoute } from "next";
import { getAll, getGuides, getPackages } from "@/lib/content";
import { categories } from "@/content/categories";
import { guideHref, offeringHref, packageHref } from "@/lib/routes";

const BUILD_DATE = new Date().toISOString();

function toAbsoluteImageUrl(siteUrl: string, src?: string): string[] | undefined {
  if (!src) return undefined;
  return [src.startsWith("http") ? src : `${siteUrl}${src}`];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteUrl = rawSiteUrl.replace(/\/+$/, "");

  const staticEntries: MetadataRoute.Sitemap = [
    "/",
    "/packages",
    "/guides",
    ...Object.values(categories).map((c) => c.path),
    "/about",
    "/faq",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified: BUILD_DATE,
  }));

  const packageEntries: MetadataRoute.Sitemap = getPackages().map((pkg) => ({
    url: `${siteUrl}${packageHref(pkg)}`,
    lastModified: BUILD_DATE,
    ...(toAbsoluteImageUrl(siteUrl, pkg.photo?.src)
      ? { images: toAbsoluteImageUrl(siteUrl, pkg.photo?.src) }
      : {}),
  }));

  const guideEntries: MetadataRoute.Sitemap = getGuides().map((guide) => ({
    url: `${siteUrl}${guideHref(guide)}`,
    lastModified: guide.updatedAt,
    ...(toAbsoluteImageUrl(siteUrl, guide.photo?.src)
      ? { images: toAbsoluteImageUrl(siteUrl, guide.photo?.src) }
      : {}),
  }));

  const detailEntries: MetadataRoute.Sitemap = getAll().map((item) => {
    const imgs = toAbsoluteImageUrl(siteUrl, item.photos?.[0]?.src);
    return {
      url: `${siteUrl}${offeringHref(item)}`,
      lastModified: BUILD_DATE,
      ...(imgs ? { images: imgs } : {}),
    };
  });

  return [...staticEntries, ...packageEntries, ...guideEntries, ...detailEntries];
}

