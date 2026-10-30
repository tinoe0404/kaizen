import { Category } from "./types";

export interface CategoryConfig {
  category: Category;
  path: string;
  title: string;
  singular: string;
  intro: string;
  metaDescription: string;
}

export const categories: Record<Category, CategoryConfig> = {
  destination: {
    category: "destination",
    path: "/destinations",
    title: "Destinations",
    singular: "destination",
    intro:
      "Choose where you want to go. Open a destination to see photos and details, then add it to your trip.",
    metaDescription:
      "Explore safari destinations and adventure spots across Africa with Kaizen Travel and Adventures.",
  },
  activity: {
    category: "activity",
    path: "/activities",
    title: "Activities",
    singular: "activity",
    intro:
      "Choose what you want to do. Add as many activities as you like to the same request.",
    metaDescription:
      "Discover guided wildlife drives, cultural tours, and outdoor activities for your African journey.",
  },
  lodge: {
    category: "lodge",
    path: "/lodges",
    title: "Lodges",
    singular: "lodge",
    intro:
      "Choose where you stay. Lodge prices are shown per night for your group.",
    metaDescription:
      "Browse hand-picked safari lodges, wilderness camps, and luxury retreats for your African safari.",
  },
  vehicle: {
    category: "vehicle",
    path: "/vehicle-hire",
    title: "Vehicle hire",
    singular: "vehicle",
    intro:
      "Choose how you get around. Vehicle prices are shown per day for your group.",
    metaDescription:
      "Hire rugged, fully equipped 4x4 safari vehicles and comfortable overland transport for your trip.",
  },
};

export function getCategoryConfig(category: Category): CategoryConfig {
  return categories[category];
}

