import type { Metadata } from "next";
import { TransfersView } from "@/components/TransfersView";
import { getAll } from "@/lib/content";
import { getCategoryMetadata } from "@/lib/og";

export const metadata: Metadata = getCategoryMetadata("vehicle");

export default function VehicleHirePage() {
  const items = getAll("vehicle");
  return <TransfersView items={items} />;
}
