import type { MetadataRoute } from "next";
import { isProductionEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const isProduction = isProductionEnv();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/trip"],
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}

