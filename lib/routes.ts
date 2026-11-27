import { Category, Offering, SafariPackage, TravelGuide } from "@/content/types";
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

export function packageHref(pkg: Pick<SafariPackage, "slug">): string {
  return `/packages/${pkg.slug}`;
}

export function guideHref(guide: Pick<TravelGuide, "slug">): string {
  return `/guides/${guide.slug}`;
}
