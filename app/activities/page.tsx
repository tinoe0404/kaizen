import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { getCategoryConfig } from "@/content/categories";

const config = getCategoryConfig("activity");

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  alternates: { canonical: config.path },
};

export default function ActivitiesPage() {
  return <CategoryPage category="activity" />;
}
