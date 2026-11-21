import type { Metadata } from "next";
import { TransfersView } from "@/components/TransfersView";
import { getAll } from "@/lib/content";
import { getCategoryConfig } from "@/content/categories";

const config = getCategoryConfig("vehicle");

export const metadata: Metadata = {
  title: config.title,
  description: config.metaDescription,
  alternates: { canonical: config.path },
};

export default function VehicleHirePage() {
  const items = getAll("vehicle");
  return <TransfersView items={items} />;
}
