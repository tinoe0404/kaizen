import { Offering } from "../types";

export const lodges: Offering[] = [
  {
    id: "lodge-a",
    slug: "lodge-a",
    category: "lodge",
    name: "Safari Lodge A",
    summary: "A comfortable wilderness camp for automated testing",
    description: "Relax in luxury safari tents under starlit African skies with gourmet bush dining.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 200,
    },
    photos: [
      {
        src: "/test/sample.jpg",
        alt: "Luxury tent accommodation at Safari Lodge A",
      },
    ],
    destinationSlug: "destination-a",
    featured: false,
  },
];
