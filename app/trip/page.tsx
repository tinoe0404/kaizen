import type { Metadata } from "next";
import { TripBuilder } from "@/components/trip/TripBuilder";

export const metadata: Metadata = {
  title: "Build your trip | Kaizen Travel and Adventures",
  robots: { index: false, follow: false },
};

export default function TripPage() {
  return <TripBuilder />;
}
