import { Offering } from "../types";

export const activities: Offering[] = [
  {
    id: "activity-a",
    slug: "activity-a",
    category: "activity",
    name: "Safari Activity A",
    summary: "An exhilarating guided activity for automated testing",
    description: "Join professional guides for an unforgettable safari expedition across the wild terrain.",
    pricing: {
      unit: "per_group",
      amountUsd: 150,
    },
    photos: [
      {
        src: "/test/sample.jpg",
        alt: "Guided excursion during Safari Activity A",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
];
