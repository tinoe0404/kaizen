import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { getCategoryMetadata } from "@/lib/og";

export const metadata: Metadata = getCategoryMetadata("destination");

export default function DestinationsPage() {
  return <CategoryPage category="destination" />;
}
