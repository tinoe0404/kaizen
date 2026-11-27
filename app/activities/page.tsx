import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { getCategoryMetadata } from "@/lib/og";

export const metadata: Metadata = getCategoryMetadata("activity");

export default function ActivitiesPage() {
  return <CategoryPage category="activity" />;
}
