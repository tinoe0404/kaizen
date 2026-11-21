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
    title: "Transfers",
    singular: "transfer",
    intro:
      "Reliable airport pickups, inter-hotel shuttles, cross-border transfers to Botswana & Zambia, and private safari charters across Victoria Falls.",
    metaDescription:
      "Book airport transfers, private taxis, and safari shuttles across Victoria Falls, Chobe, Livingstone, and Hwange with Kaizen Travel.",
  },
};

export function getCategoryConfig(category: Category): CategoryConfig {
  return categories[category];
}

