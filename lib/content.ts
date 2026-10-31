import { Category, Offering } from "@/content/types";
import {
  destinations,
  activities,
  lodges,
  vehicles,
} from "@/content";

const categoryMap: Record<Category, Offering[]> = {
  destination: destinations,
  activity: activities,
  lodge: lodges,
  vehicle: vehicles,
};

const allOfferings: Offering[] = [
  ...destinations,
  ...activities,
  ...lodges,
  ...vehicles,
];

export function getAll(category?: Category): Offering[] {
  if (category) {
    return categoryMap[category] ?? [];
  }
  return allOfferings;
}

export function getBySlug(
  category: Category,
  slug: string
): Offering | undefined {
  return categoryMap[category]?.find((item) => item.slug === slug);
}

export function getFeatured(): Offering[] {
  return allOfferings.filter((item) => item.featured === true);
}

export function getById(id: string): Offering | undefined {
  return allOfferings.find((item) => item.id === id);
}

export function getByDestination(destinationSlug: string): Offering[] {
  return allOfferings.filter((item) => item.destinationSlug === destinationSlug);
}

