import { Offering } from "../types";

export const vehicles: Offering[] = [
  {
    id: "vehicle-a",
    slug: "vehicle-a",
    category: "vehicle",
    name: "Safari Vehicle A",
    summary: "A rugged 4x4 safari cruiser for automated testing",
    description: "Equipped with pop-up roof, heavy-duty suspension, fridge, and full camping gear.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 250,
    },
    photos: [
      {
        src: "/test/sample.jpg",
        alt: "Rugged 4x4 cruiser for Safari Vehicle A hire",
      },
    ],
    capacity: 5,
    featured: false,
  },
];
