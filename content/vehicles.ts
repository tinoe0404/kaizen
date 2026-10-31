import { Offering } from "./types";

export const vehicles: Offering[] = [
  {
    id: "vehicle-toyota-land-cruiser",
    slug: "toyota-land-cruiser",
    category: "vehicle",
    name: "Toyota Land Cruiser",
    summary:
      "Rugged 4x4 workhorse built for off-road safari terrain with seating for up to 5 passengers.",
    description:
      "The Toyota Land Cruiser is the definitive safari vehicle — trusted across Southern Africa for its legendary reliability and go-anywhere capability. Equipped with full-time four-wheel drive, high ground clearance, and a reinforced chassis, it handles gravel roads, river crossings, and sandy tracks with ease. Air-conditioned cabin with comfortable seating for up to 5 passengers, roof rack, and ample cargo space for luggage and camping gear. Includes comprehensive insurance, unlimited mileage, and 24-hour roadside assistance.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 120,
    },
    photos: [
      {
        src: "/images/vehicles/toyota-land-cruiser-1.jpg",
        alt: "White Toyota Land Cruiser 4x4 parked on a scenic road ready for a safari adventure",
      },
    ],
    capacity: 5,
    featured: true,
  },
  {
    id: "vehicle-toyota-hilux",
    slug: "toyota-hilux",
    category: "vehicle",
    name: "Toyota Hilux Double Cab",
    summary:
      "Versatile double-cab pickup with 4WD, ideal for self-drive safari tours and luggage-heavy trips.",
    description:
      "The Toyota Hilux Double Cab combines rugged off-road performance with the comfort and space needed for extended self-drive safaris. Its powerful diesel engine delivers excellent fuel economy over long distances, while the four-wheel-drive system provides traction on all terrain types. The double-cab configuration seats up to 5 comfortably, with a large rear load bed for luggage, cooler boxes, and outdoor equipment. Fitted with a canopy for weather protection and security.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 95,
    },
    photos: [
      {
        src: "/images/vehicles/toyota-hilux-1.jpg",
        alt: "Toyota Hilux Double Cab pickup truck on an open African road",
      },
    ],
    capacity: 5,
    featured: true,
  },
  {
    id: "vehicle-ford-ranger",
    slug: "ford-ranger",
    category: "vehicle",
    name: "Ford Ranger",
    summary:
      "Powerful and comfortable 4x4 bakkie with modern tech and seating for up to 5.",
    description:
      "The Ford Ranger delivers a refined driving experience without compromising off-road capability. Its turbodiesel engine provides strong torque for hill climbs and towing, while the modern interior features touchscreen infotainment, climate control, and supportive seats for long-distance comfort. Available in double-cab configuration with a fitted canopy, making it practical for both family holidays and adventure-seeking travellers exploring Southern Africa's bush roads and national parks.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 100,
    },
    photos: [
      {
        src: "/images/vehicles/ford-ranger-1.jpg",
        alt: "Ford Ranger double cab bakkie parked with scenic bushveld in the background",
      },
    ],
    capacity: 5,
    featured: true,
  },
  {
    id: "vehicle-isuzu-dmax",
    slug: "isuzu-dmax",
    category: "vehicle",
    name: "Isuzu D-Max",
    summary:
      "Fuel-efficient and durable 4x4 pickup trusted for long-haul African road trips.",
    description:
      "The Isuzu D-Max is renowned across Africa for its exceptional fuel efficiency, low running costs, and bombproof reliability. Its 3.0-litre turbodiesel engine provides smooth, effortless cruising on highways and confident handling on gravel and dirt roads. The double-cab interior is spacious and practical, with ample legroom and modern convenience features. An excellent choice for budget-conscious travellers who need a dependable 4x4 without sacrificing comfort.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 85,
    },
    photos: [
      {
        src: "/images/vehicles/isuzu-dmax-1.jpg",
        alt: "Isuzu D-Max 4x4 pickup on a dusty Southern African dirt road",
      },
    ],
    capacity: 5,
    featured: true,
  },
  {
    id: "vehicle-safari-van",
    slug: "safari-van",
    category: "vehicle",
    name: "Safari Van",
    summary:
      "Spacious 10-seater minibus ideal for group transfers, guided tours, and airport shuttles.",
    description:
      "The Safari Van is the go-to vehicle for group travel, airport transfers, and guided day tours. With seating for up to 10 passengers and generous luggage space, it comfortably accommodates families, tour groups, and corporate delegations. Air-conditioned with reclining seats, large windows for game viewing, and a pop-up roof for photography stops. Available with a professional driver-guide for fully serviced tour packages or as a self-drive rental for flexible group itineraries.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 150,
    },
    photos: [
      {
        src: "/images/vehicles/safari-van-1.jpg",
        alt: "White safari van with pop-up roof parked at a scenic viewpoint",
      },
    ],
    capacity: 10,
    featured: true,
  },

  // ── test-only placeholders (kept for unit-test compatibility) ──────
  {
    id: "vehicle-a",
    slug: "vehicle-a",
    category: "vehicle",
    name: "[Vehicle A]",
    summary: "[One line description for Vehicle A]",
    description:
      "[Comprehensive guide and overview for Vehicle A placeholder.]",
    pricing: { unit: "per_group_per_day", amountUsd: 0 },
    photos: [],
    capacity: 4,
    featured: false,
  },
  {
    id: "vehicle-b",
    slug: "vehicle-b",
    category: "vehicle",
    name: "[Vehicle B]",
    summary: "[One line description for Vehicle B]",
    description:
      "[Comprehensive guide and overview for Vehicle B placeholder.]",
    pricing: { unit: "per_group_per_day", amountUsd: 0 },
    photos: [],
    capacity: 7,
    featured: false,
  },
  {
    id: "vehicle-c",
    slug: "vehicle-c",
    category: "vehicle",
    name: "[Vehicle C]",
    summary: "[One line description for Vehicle C]",
    description:
      "[Comprehensive guide and overview for Vehicle C placeholder.]",
    pricing: { unit: "per_group_per_day", amountUsd: 0 },
    photos: [],
    capacity: 5,
    featured: false,
  },
  {
    id: "vehicle-d",
    slug: "vehicle-d",
    category: "vehicle",
    name: "[Vehicle D]",
    summary: "[One line description for Vehicle D]",
    description:
      "[Comprehensive guide and overview for Vehicle D placeholder.]",
    pricing: { unit: "per_group_per_day", amountUsd: 0 },
    photos: [],
    capacity: 6,
    featured: false,
  },
];
