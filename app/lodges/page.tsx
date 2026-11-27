import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { getCategoryMetadata } from "@/lib/og";

export const metadata: Metadata = getCategoryMetadata("lodge");

export default function LodgesPage() {
  return <CategoryPage category="lodge" />;
}
