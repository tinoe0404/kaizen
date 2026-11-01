import { SafariPackage } from "./types";

const useFixtures = process.env.NEXT_PUBLIC_CONTENT_FIXTURES === "1";

const realPackages: SafariPackage[] = [
  {
    id: "package-vic-falls-adrenaline",
    slug: "vic-falls-adrenaline",
    title: "Victoria Falls Adrenaline & Falls",
    subtitle:
      "Helicopter flight, bridge bungee, Batoka rafting & plateau lodge",
    duration: "3 Days / 2 Nights",
    destination: "Victoria Falls",
    badge: "Most Popular Adventure",
    description:
      "The definitive adrenaline long-weekend in Africa's adventure capital. Plunge 111 meters from the Victoria Falls Bridge, conquer Grade 5 rapids in the Batoka Gorge, take in the breathtaking Flight of Angels helicopter tour, and unwind on a golden-hour Zambezi sunset cruise. Base yourself at Victoria Falls Safari Lodge with private balconies overlooking an active game waterhole.",
    highlights: [
      "111-meter Victoria Falls Bridge Bungee Jump",
      "Scenic 'Flight of Angels' helicopter tour over the gorge",
      "World-class Grade 5 Batoka Gorge white-water rafting",
      "Sunset river cruise with drinks & birdlife",
      "Luxury stay at Victoria Falls Safari Lodge",
    ],
    itemIds: [
      "destination-victoria-falls",
      "lodge-victoria-falls-safari-lodge",
      "activity-flights-over-the-falls",
      "activity-bunji",
      "activity-rafting",
      "activity-cruises",
    ],
    photo: {
      src: "/images/activities/flights-over-the-falls-1.jpg",
      alt: "Aerial helicopter view of Victoria Falls and gorge",
    },
    featured: true,
  },
  {
    id: "package-vic-falls-chobe-combo",
    slug: "vic-falls-chobe-combo",
    title: "Best of Victoria Falls & Chobe Wildlife Combo",
    subtitle:
      "Two world wonders in one seamless 5-day journey across Zimbabwe and Botswana",
    duration: "5 Days / 4 Nights",
    destination: "Victoria Falls & Chobe",
    badge: "Top Wildlife Pick",
    description:
      "Experience the ultimate safari double-bill: the roar and adrenaline of Victoria Falls paired with the world's densest elephant population in Chobe National Park, Botswana. Includes sunset river safaris, open 4x4 predator drives, helicopter flights over the falls, and premium riverside lodging on both sides of the border.",
    highlights: [
      "Up-close boat safaris among huge elephant herds on the Chobe River",
      "Open 4x4 predator tracking in Chobe National Park",
      "Helicopter tour over the roaring Victoria Falls",
      "Sunset wildlife cruise along the upper Zambezi",
      "Riverside lodge accommodations in Kasane and Victoria Falls",
    ],
    itemIds: [
      "destination-victoria-falls",
      "destination-chobe",
      "lodge-victoria-falls-safari-lodge",
      "lodge-chobe-safari-lodge",
      "activity-flights-over-the-falls",
      "activity-cruises",
      "activity-chobe-boat-safari",
      "activity-chobe-game-drive",
    ],
    photo: {
      src: "/images/destinations/chobe-1.jpg",
      alt: "Elephant herd drinking along the Chobe River",
    },
    featured: true,
  },
  {
    id: "package-namibia-desert-coast",
    slug: "namibia-desert-coast",
    title: "Namibia Dunes & Atlantic Coast Self-Drive",
    subtitle:
      "Towering red dunes, Atlantic adrenaline in Swakopmund & 4x4 Land Cruiser",
    duration: "7 Days / 6 Nights",
    destination: "Namibia",
    badge: "Best Self-Drive",
    description:
      "Traverse Namibia's epic desert landscapes at your own pace in a fully equipped 4x4 Toyota Land Cruiser. Climb the sunrise slopes of Dune 45 at Sossusvlei, walk the eerie white clay of Deadvlei, hit 80 km/h sandboarding down coastal dunes, and skydive from 10,000 feet over where the Namib Desert plunges into the Atlantic.",
    highlights: [
      "Sunrise excursion up Dune 45 and into ancient Deadvlei",
      "High-speed sandboarding & quad biking near Swakopmund",
      "10,000 ft tandem skydive over the Atlantic coast",
      "Rugged 4x4 Toyota Land Cruiser hire included",
      "Desert lodges at Sossusvlei gate and historic Swakopmund hotel",
    ],
    itemIds: [
      "destination-namibia",
      "lodge-sossusvlei-lodge",
      "lodge-swakopmund-hotel",
      "activity-sossusvlei",
      "activity-sandboarding",
      "activity-swakopmund-skydiving",
      "vehicle-toyota-land-cruiser",
    ],
    photo: {
      src: "/images/destinations/namibia-1.jpg",
      alt: "Towering red dunes of the Namib Desert",
    },
    featured: true,
  },
  {
    id: "package-grand-southern-africa",
    slug: "grand-southern-africa",
    title: "Ultimate Southern Africa Grand Expedition",
    subtitle:
      "10 days linking the Falls, Chobe floodplains & Etosha wildlife pan",
    duration: "10 Days / 9 Nights",
    destination: "Victoria Falls • Chobe • Namibia",
    badge: "Comprehensive Circuit",
    description:
      "The premier bucket-list overland and fly-in journey connecting the three greatest highlights of Southern Africa. From the sheer curtain of Victoria Falls to the massive elephant herds along the Chobe River and the vast shimmering salt pans of Etosha and red dunes of Sossusvlei, this journey offers an unparalleled diversity of wildlife, scenery, and luxury camps.",
    highlights: [
      "Victoria Falls helicopter 'Flight of Angels' and luxury plunge pool tent",
      "Exclusive safari boat cruises inside Chobe National Park",
      "Multi-day big cat and rhino tracking in Etosha National Park",
      "Iconic red dunes of Sossusvlei at sunrise",
      "Five-star wilderness lodges and safari camps throughout",
    ],
    itemIds: [
      "destination-victoria-falls",
      "destination-chobe",
      "destination-namibia",
      "lodge-elephant-camp",
      "lodge-chobe-game-lodge",
      "lodge-sossusvlei-lodge",
      "activity-flights-over-the-falls",
      "activity-chobe-boat-safari",
      "activity-sossusvlei",
      "activity-etosha-safari",
    ],
    photo: {
      src: "/images/destinations/victoria-falls-1.jpg",
      alt: "Dramatic gorge and rainbow of Victoria Falls",
    },
    featured: true,
  },
];

const fixturePackages: SafariPackage[] = [
  {
    id: "package-fixture-safari",
    slug: "fixture-safari",
    title: "Sample Safari Package",
    subtitle: "A test safari package combining test offerings",
    duration: "3 Days / 2 Nights",
    destination: "Test Destination",
    badge: "Sample Trip",
    description: "Sample test safari package for automated testing.",
    highlights: ["Highlight 1", "Highlight 2"],
    itemIds: ["destination-a", "activity-a", "lodge-a", "vehicle-a"],
    photo: {
      src: "/test/sample.jpg",
      alt: "Test safari package",
    },
    featured: true,
  },
];

export const packages: SafariPackage[] = useFixtures
  ? fixturePackages
  : realPackages;

