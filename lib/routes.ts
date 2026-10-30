import { Category, Offering } from "@/content/types";

export const categoryPath: Record<Category, string> = {
  destination: "/destinations",
  activity: "/activities",
  lodge: "/lodges",
  vehicle: "/vehicle-hire",
};

export function offeringHref(offering: Offering): string {
  return `${categoryPath[offering.category]}/${offering.slug}`;
}

