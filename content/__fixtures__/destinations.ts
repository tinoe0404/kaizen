import { Offering } from "../types";

export const destinations: Offering[] = [
  {
    id: "destination-a",
    slug: "destination-a",
    category: "destination",
    name: "Safari Destination A",
    summary: "A pristine test destination for automated testing",
    description: "Experience the wonders of our test destination with breathtaking views and safari adventures.",
    pricing: {
      unit: "per_person",
      amountUsd: 100,
    },
    photos: [
      {
        src: "/test/sample.jpg",
        alt: "Scenic view of Safari Destination A",
      },
    ],
    featured: true,
  },
];
