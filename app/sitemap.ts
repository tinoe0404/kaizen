import type { MetadataRoute } from "next";
import { getAll } from "@/lib/content";
import { categories } from "@/content/categories";
import { offeringHref } from "@/lib/routes";

const BUILD_DATE = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = [
    "/",
    "/packages",
    ...Object.values(categories).map((c) => c.path),
    "/about",
    "/contact",
    "/privacy",
  ];

  const detailPages = getAll().map((item) => offeringHref(item));

  return [...staticPages, ...detailPages].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: BUILD_DATE,
  }));
}

