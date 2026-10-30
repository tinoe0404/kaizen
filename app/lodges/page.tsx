import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { getCategoryConfig } from "@/content/categories";

const config = getCategoryConfig("lodge");

export const metadata: Metadata = {
  title: `${config.title} | Kaizen Travel and Adventures`,
  description: config.metaDescription,
};

export default function LodgesPage() {
  return <CategoryPage category="lodge" />;
}
