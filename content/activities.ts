import { Offering } from "./types";

export const activities: Offering[] = [
  {
    id: "activity-bunji",
    slug: "bunji",
    category: "activity",
    name: "Bunji Jumping",
    summary: "111-meter bungee jump from the Victoria Falls Bridge over the Zambezi River.",
    description:
      "Experience the ultimate adrenaline rush with a 111-meter bungee jump from the iconic Victoria Falls Bridge. Suspended directly over the roaring Zambezi River against the backdrop of the majestic falls, this world-renowned leap combines sheer thrill with breathtaking canyon views. Fully supervised by certified jump masters with international safety standards.",
    pricing: {
      unit: "per_person",
      amountUsd: 160,
    },
    photos: [
      {
        src: "/images/activities/bunji-1.jpg",
        alt: "Thrill seeker bungee jumping from the Victoria Falls Bridge over the Zambezi River",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "activity-rafting",
    slug: "rafting",
    category: "activity",
    name: "White Water Rafting",
    summary: "World-class Grade 5 white water rafting down the turbulent Batoka Gorge.",
    description:
      "Recognized globally as one of the premier white-water rafting adventures on earth. Navigate the turbulent churning rapids of the Batoka Gorge directly beneath Victoria Falls, accompanied by expert river guides and full safety equipment. An unforgettable full-day or half-day excursion of high adventure, dramatic canyon scenery, and adrenaline.",
    pricing: {
      unit: "per_person",
      amountUsd: 130,
    },
    photos: [
      {
        src: "/images/activities/rafting-1.jpg",
        alt: "White water rafting team navigating the rapids of the Batoka Gorge on the Zambezi River",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "activity-cruises",
    slug: "cruises",
    category: "activity",
    name: "Zambezi River Cruises",
    summary: "Sunset and dinner boat cruises along the upper Zambezi River with wildlife viewing.",
    description:
      "Drift peacefully along the tranquil waters of the upper Zambezi River above Victoria Falls. Enjoy panoramic golden-hour sunsets, complimentary refreshments, and frequent sightings of hippos, crocodiles, elephants on the riverbanks, and vibrant birdlife. A quintessentially relaxing African river safari experience.",
    pricing: {
      unit: "per_person",
      amountUsd: 75,
    },
    photos: [
      {
        src: "/images/activities/cruises-1.jpg",
        alt: "Sunset boat cruise drifting along the tranquil waters of the Zambezi River",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "activity-flights-over-the-falls",
    slug: "flights-over-the-falls",
    category: "activity",
    name: "Flights Over the Falls",
    summary: "Scenic helicopter tours offering breathtaking aerial views of Victoria Falls and the Batoka Gorge.",
    description:
      "Take to the skies for an awe-inspiring aerial perspective of Victoria Falls, known locally as the 'Flight of Angels'. Marvel at the sheer scale of the curtain of water, the zigzagging gorges carved by the Zambezi River, and surrounding national park landscapes. Spectacular photo opportunities from specially designed viewing windows.",
    pricing: {
      unit: "per_person",
      amountUsd: 175,
    },
    photos: [
      {
        src: "/images/activities/flights-over-the-falls-1.jpg",
        alt: "Aerial helicopter view of the dramatic gorge and mist of Victoria Falls",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "activity-game-drives",
    slug: "game-drives",
    category: "activity",
    name: "Guided Game Drives",
    summary: "Open-vehicle wildlife game drives tracking Africa's Big Five across pristine national parks.",
    description:
      "Embark on sunrise or afternoon game drives in open 4x4 safari vehicles guided by professional trackers. Explore the diverse wilderness habitats of Hwange and Victoria Falls National Parks, tracking lions, leopards, elephant herds, buffalo, and a rich array of plains wildlife in their natural environment.",
    pricing: {
      unit: "per_person",
      amountUsd: 110,
    },
    photos: [
      {
        src: "/images/activities/game-drives-1.jpg",
        alt: "Open 4x4 safari game drive vehicle observing wildlife in the African bush",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "activity-tour-of-zimbabwe",
    slug: "tour-of-zimbabwe",
    category: "activity",
    name: "Tour of Zimbabwe",
    summary: "Multi-day guided safari and cultural expedition across Zimbabwe's iconic landmarks.",
    description:
      "A curated travel journey connecting Zimbabwe's greatest treasures: the mist of Victoria Falls, the vast wilderness of Hwange National Park, the granite domes of Matobo Hills, and the ancient stone architecture of Great Zimbabwe. Includes private transportation, certified regional guides, and personalized route coordination.",
    pricing: {
      unit: "per_person",
      amountUsd: 850,
    },
    photos: [
      {
        src: "/images/activities/tour-of-zimbabwe-1.jpg",
        alt: "Scenic view of Victoria Falls and the lush surrounding rainforest landscape",
      },
    ],
    featured: true,
  },

  // ── test-only placeholders (kept for unit-test compatibility) ──────
  {
    id: "activity-a",
    slug: "activity-a",
    category: "activity",
    name: "[Activity A]",
    summary: "[One line description for Activity A]",
    description: "[Comprehensive guide and overview for Activity A placeholder.]",
    pricing: { unit: "per_person", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-a",
    featured: false,
  },
  {
    id: "activity-b",
    slug: "activity-b",
    category: "activity",
    name: "[Activity B]",
    summary: "[One line description for Activity B]",
    description: "[Comprehensive guide and overview for Activity B placeholder.]",
    pricing: { unit: "per_person", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-b",
    featured: false,
  },
  {
    id: "activity-c",
    slug: "activity-c",
    category: "activity",
    name: "[Activity C]",
    summary: "[One line description for Activity C]",
    description: "[Comprehensive guide and overview for Activity C placeholder.]",
    pricing: { unit: "per_person", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-c",
    featured: false,
  },
  {
    id: "activity-d",
    slug: "activity-d",
    category: "activity",
    name: "[Activity D]",
    summary: "[One line description for Activity D]",
    description: "[Comprehensive guide and overview for Activity D placeholder.]",
    pricing: { unit: "per_person", amountUsd: 0 },
    photos: [],
    featured: false,
  },
];

