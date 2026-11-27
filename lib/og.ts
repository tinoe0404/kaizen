import type { Metadata } from "next";
import photoMeta from "@/content/generated/photo-meta.json";
import { getCategoryConfig } from "@/content/categories";
import type { Category, Photo } from "@/content/types";
import { getBySlug, getGuideBySlug, getPackageBySlug } from "@/lib/content";

interface PhotoMetaEntry {
  width: number;
  height: number;
}

const metaMap = photoMeta as Record<string, PhotoMetaEntry>;

export interface OgImageDescriptor {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

/**
 * Builds an OpenGraph image descriptor with verified pixel dimensions from
 * `photo-meta.json`, falling back to the 1200x630 generated OG image when no photo exists.
 */
export function getOgImage(
  photo?: Pick<Photo, "src" | "alt"> | { url: string; alt: string },
  fallbackAlt = "Kaizen Travel and Adventures"
): OgImageDescriptor {
  const src = photo && "src" in photo ? photo.src : photo?.url;
  const alt = photo?.alt || fallbackAlt;

  if (!src) {
    return {
      url: "/opengraph-image",
      width: 1200,
      height: 630,
      alt,
    };
  }

  const dims = metaMap[src];
  return {
    url: src,
    ...(dims ? { width: dims.width, height: dims.height } : {}),
    alt,
  };
}

/** Generates consistent metadata (including verified OG dimensions) for a category index page. */
export function getCategoryMetadata(category: Category): Metadata {
  const config = getCategoryConfig(category);
  const pageTitle = config.seoTitle || config.title;
  const ogImage = getOgImage(config.ogImage, `${pageTitle} | Kaizen Travel and Adventures`);

  return {
    title: pageTitle,
    description: config.metaDescription,
    alternates: { canonical: config.path },
    openGraph: {
      title: `${pageTitle} | Kaizen Travel and Adventures`,
      description: config.metaDescription,
      url: config.path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Kaizen Travel and Adventures`,
      description: config.metaDescription,
      images: [ogImage.url],
    },
  };
}

/** Generates consistent metadata (including verified OG dimensions) for an offering detail page. */
export function getOfferingMetadata(category: Category, slug: string): Metadata {
  const offering = getBySlug(category, slug);
  if (!offering) {
    return {};
  }

  const config = getCategoryConfig(category);
  const ogImage = getOgImage(offering.photos?.[0], offering.name);
  const canonical = `${config.path}/${slug}`;

  return {
    title: offering.name,
    description: offering.summary,
    alternates: { canonical },
    openGraph: {
      title: offering.name,
      description: offering.summary,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: offering.name,
      description: offering.summary,
      images: [ogImage.url],
    },
  };
}

/** Generates consistent metadata (including verified OG dimensions) for a package detail page. */
export function getPackageMetadata(slug: string): Metadata {
  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    return {};
  }

  const ogImage = getOgImage(pkg.photo, pkg.title);
  const canonical = `/packages/${slug}`;
  const title = `${pkg.title} (${pkg.duration})`;

  return {
    title,
    description: pkg.description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Kaizen Travel and Adventures`,
      description: pkg.description,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kaizen Travel and Adventures`,
      description: pkg.description,
      images: [ogImage.url],
    },
  };
}

/** Generates consistent metadata (including verified OG dimensions) for a travel guide page. */
export function getGuideMetadata(slug: string): Metadata {
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  const ogImage = getOgImage(guide.photo, guide.title);
  const canonical = `/guides/${slug}`;

  return {
    title: guide.seoTitle || guide.title,
    description: guide.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${guide.seoTitle || guide.title} | Kaizen Travel and Adventures`,
      description: guide.metaDescription,
      url: canonical,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.seoTitle || guide.title} | Kaizen Travel and Adventures`,
      description: guide.metaDescription,
      images: [ogImage.url],
    },
  };
}
