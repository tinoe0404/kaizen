import { Offering } from "./types";

export const destinations: Offering[] = [
  // ── Real destinations ─────────────────────────────────────────────
  {
    id: "destination-victoria-falls",
    slug: "victoria-falls",
    category: "destination",
    name: "Victoria Falls",
    summary:
      "The adventure capital of Africa — home to the world's largest curtain of falling water and endless adrenaline activities.",
    description:
      "Victoria Falls, known locally as Mosi-oa-Tunya ('The Smoke That Thunders'), is one of the Seven Natural Wonders of the World. Straddling the border of Zimbabwe and Zambia, the falls plunge 108 meters into the Batoka Gorge, creating a year-round mist visible from over 30 kilometres away. The town of Victoria Falls serves as Southern Africa's premier adventure hub, offering bungee jumping, white-water rafting, helicopter flights, sunset cruises, game drives, gorge swings, zip-lining, and cultural village tours. With world-class lodges, vibrant markets, and proximity to Hwange and Chobe national parks, it is the ideal starting point for any Southern African safari.",
    pricing: {
      unit: "per_person",
      amountUsd: 50,
    },
    photos: [
      {
        src: "/images/destinations/victoria-falls-1.jpg",
        alt: "The majestic Victoria Falls waterfall curtain and mist plunging into Batoka Gorge",
      },
    ],
    featured: true,
  },
  {
    id: "destination-chobe",
    slug: "chobe",
    category: "destination",
    name: "Chobe, Botswana",
    summary:
      "Botswana's premier wildlife destination with the highest concentration of elephants in Africa along the Chobe River.",
    description:
      "Chobe National Park in northern Botswana is renowned for its extraordinary wildlife density — particularly its population of over 120,000 elephants, the largest of any national park on earth. The Chobe River frontage provides spectacular boat-based game viewing where herds of elephants wade across the shallows at sunset, hippos surface alongside your vessel, and rare African fish eagles perch on the riverbanks. The park's diverse ecosystems — from floodplains to mopane woodlands — support lion prides, leopards, wild dogs, buffalo, sable antelope, and over 450 bird species. Just 80 kilometres from Victoria Falls, Chobe is easily combined as a day trip or multi-night safari extension.",
    pricing: {
      unit: "per_person",
      amountUsd: 40,
    },
    photos: [
      {
        src: "/images/destinations/chobe-1.jpg",
        alt: "Elephant herd drinking along the scenic banks of the Chobe River in Botswana",
      },
    ],
    featured: true,
  },
  {
    id: "destination-namibia",
    slug: "namibia",
    category: "destination",
    name: "Namibia",
    summary:
      "Vast desert landscapes, towering red dunes, and rugged coastlines — one of Africa's most dramatic self-drive destinations.",
    description:
      "Namibia is a land of extremes: the ancient red dunes of Sossusvlei, the wildlife-rich waterholes of Etosha National Park, the haunting Skeleton Coast, and the adventure town of Swakopmund where the Namib Desert meets the Atlantic Ocean. With some of the lowest population densities on earth, Namibia offers an unparalleled sense of space and solitude. Self-drive safaris along well-maintained gravel roads connect iconic highlights over dramatic scenery, while guided tours provide deeper cultural and ecological insights. From sandboarding down towering dunes to tracking desert-adapted elephants and lions, Namibia delivers a truly unique African experience.",
    pricing: {
      unit: "per_person",
      amountUsd: 80,
    },
    photos: [
      {
        src: "/images/destinations/namibia-1.jpg",
        alt: "Iconic red sand dunes and stark desert landscapes of Sossusvlei in Namibia",
      },
    ],
    featured: true,
  },
];
