import { Category, Offering } from "@/content/types";
import { categories } from "@/content/categories";

export const categoryPath: Record<Category, string> = {
  destination: categories.destination.path,
  activity: categories.activity.path,
  lodge: categories.lodge.path,
  vehicle: categories.vehicle.path,
};

export function offeringHref(offering: Offering): string {
  return `${categoryPath[offering.category]}/${offering.slug}`;
}
