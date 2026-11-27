import { Category } from "./types";

export interface CategoryConfig {
  category: Category;
  path: string;
  title: string;
  seoTitle?: string;
  seoHeading?: string;
  singular: string;
  intro: string;
  metaDescription: string;
  ogImage?: {
    url: string;
    alt: string;
  };
}

export const categories: Record<Category, CategoryConfig> = {
  destination: {
    category: "destination",
    path: "/destinations",
    title: "Destinations",
    seoTitle: "Southern Africa Safari Destinations",
    seoHeading: "Southern Africa Safari Destinations",
    singular: "destination",
    intro:
      "Explore Victoria Falls, Zimbabwe's national parks, Botswana's Chobe River, and Namibia. Open any hub to see verified tours, lodges, and local transfers.",
    metaDescription:
      "Explore safari destinations across Southern Africa with Kaizen Travel, including Victoria Falls, Zimbabwe safari parks, Chobe National Park, and Namibia.",
    ogImage: {
      url: "/images/destinations/victoria-falls-1.jpg",
      alt: "Victoria Falls waterfall panorama in Southern Africa",
    },
  },
  activity: {
    category: "activity",
    path: "/activities",
    title: "Activities",
    seoTitle: "Victoria Falls Tours & Activities",
    seoHeading: "Victoria Falls Tours & Safari Activities",
    singular: "activity",
    intro:
      "Browse guided tours, Zambezi river cruises, Devil's Pool swims, white-water rafting, and regional wildlife excursions with transparent upfront rates.",
    metaDescription:
      "Discover guided Victoria Falls tours, game drives, white-water rafting, Devil's Pool swims, and Chobe day trips with transparent pricing from Kaizen Travel.",
    ogImage: {
      url: "/images/activities/bunji-1.jpg",
      alt: "Adventure activities at Victoria Falls with Kaizen Travel",
    },
  },
  lodge: {
    category: "lodge",
    path: "/lodges",
    title: "Lodges",
    seoTitle: "Zimbabwe, Chobe & Namibia Lodges",
    seoHeading: "Safari Lodges, Wilderness Camps & Resorts",
    singular: "lodge",
    intro:
      "Compare hand-picked safari lodges, tented wilderness camps, and riverside retreats across Victoria Falls, Zimbabwe parks, Chobe, and Namibia.",
    metaDescription:
      "Compare safari lodges, tented camps, and riverfront retreats across Victoria Falls, Hwange, Mana Pools, Chobe, and Namibia with upfront nightly rates.",
    ogImage: {
      url: "/images/lodges/victoria-falls-safari-lodge-1.jpg",
      alt: "Safari lodge overlooking wildlife in Southern Africa",
    },
  },
  vehicle: {
    category: "vehicle",
    path: "/vehicle-hire",
    title: "Transfers",
    seoTitle: "Victoria Falls Airport Transfers",
    seoHeading: "Victoria Falls Airport Transfers & Safari Shuttles",
    singular: "transfer",
    intro:
      "Reliable Victoria Falls Airport (VFA) pickups, inter-hotel taxis, cross-border shuttles to Kasane/Chobe and Livingstone, and highway transfers to Hwange.",
    metaDescription:
      "Book Victoria Falls Airport (VFA) transfers, private taxis, Kazungula border shuttles to Chobe, and Hwange transfers with published rates from Kaizen Travel.",
    ogImage: {
      url: "/images/vehicles/safari-van-1.jpg",
      alt: "Private airport transfers and safari transport vehicles",
    },
  },
};

export function getCategoryConfig(category: Category): CategoryConfig {
  return categories[category];
}

