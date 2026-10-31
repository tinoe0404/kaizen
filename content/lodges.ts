import { Offering } from "./types";

export const lodges: Offering[] = [
  {
    id: "lodge-victoria-falls-safari-lodge",
    slug: "victoria-falls-safari-lodge",
    category: "lodge",
    name: "Victoria Falls Safari Lodge",
    summary:
      "Award-winning lodge perched on a plateau overlooking the Zambezi National Park with panoramic bushveld views.",
    description:
      "Set on an elevated plateau just minutes from the Victoria Falls, this award-winning lodge offers sweeping views over the Zambezi National Park waterhole, where elephants, buffalo, and warthogs gather at dusk. Spacious thatched-roof rooms feature private balconies, en-suite bathrooms, and natural stone finishes. Guests enjoy a choice of fine-dining and casual restaurants, an infinity pool overlooking the bush, and complimentary shuttle transfers to the falls. An ideal base for adventure activities by day and starlit dinners by night.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 280,
    },
    photos: [
      {
        src: "/images/lodges/victoria-falls-safari-lodge-1.jpg",
        alt: "Victoria Falls Safari Lodge overlooking the Zambezi National Park waterhole at sunset",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "lodge-hwange-safari-lodge",
    slug: "hwange-safari-lodge",
    category: "lodge",
    name: "Hwange Safari Lodge",
    summary:
      "Classic safari lodge on the edge of Hwange National Park with a floodlit waterhole attracting herds of elephants.",
    description:
      "Located on the boundary of Zimbabwe's largest game reserve, Hwange Safari Lodge provides front-row seats to one of Africa's most prolific wildlife spectacles. The lodge's floodlit waterhole draws elephants, lions, hyenas, and other wildlife throughout the night. Comfortable rooms blend colonial charm with modern amenities, while experienced rangers lead morning and afternoon game drives deep into the park. Conference facilities, a swimming pool, and curio shop complete the offering.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 220,
    },
    photos: [
      {
        src: "/images/lodges/hwange-safari-lodge-1.jpg",
        alt: "Hwange Safari Lodge exterior with thatched roof surrounded by bushveld",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },
  {
    id: "lodge-mana-pools-camp",
    slug: "mana-pools-camp",
    category: "lodge",
    name: "Mana Pools Wilderness Camp",
    summary:
      "Exclusive tented camp in the UNESCO-listed Mana Pools with walking safaris and canoe trails along the Zambezi.",
    description:
      "Nestled within the UNESCO World Heritage Site of Mana Pools National Park, this intimate tented camp offers an immersive wilderness experience. Accommodation consists of spacious canvas tents with comfortable beds, solar-powered lighting, and open-air en-suite bathrooms. Guided walking safaris bring guests within close proximity to elephants, wild dogs, and lions, while canoe safaris on the Zambezi reveal hippos, crocodiles, and spectacular birdlife. Limited to a small number of guests for minimal environmental impact.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 450,
    },
    photos: [
      {
        src: "/images/lodges/mana-pools-camp-1.jpg",
        alt: "Luxury safari tent interior at Mana Pools Wilderness Camp with warm lighting",
      },
    ],
    featured: true,
  },
  {
    id: "lodge-matobo-hills-lodge",
    slug: "matobo-hills-lodge",
    category: "lodge",
    name: "Matobo Hills Lodge",
    summary:
      "Boutique lodge set among the ancient granite balancing rocks of the Matobo Hills with rhino tracking excursions.",
    description:
      "Surrounded by the dramatic granite formations of the Matobo Hills — a UNESCO World Heritage Site — this boutique lodge blends seamlessly into the ancient landscape. Stone-and-thatch chalets offer privacy and comfort with views of the striking kopjes. The area is renowned for its population of black and white rhinos, and guided tracking walks are a highlight. Guests can also explore San rock art sites dating back thousands of years, and enjoy evening game drives through the reserve.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 195,
    },
    photos: [
      {
        src: "/images/lodges/matobo-hills-lodge-1.jpg",
        alt: "Elegant lodge bedroom with warm décor set in the Matobo Hills landscape",
      },
    ],
    featured: true,
  },
  {
    id: "lodge-kariba-houseboat",
    slug: "kariba-houseboat",
    category: "lodge",
    name: "Kariba Houseboat",
    summary:
      "Fully serviced luxury houseboat cruising Lake Kariba with tiger fishing, sundowner decks, and lakeside wildlife.",
    description:
      "Experience the vast expanse of Lake Kariba from the comfort of a fully serviced houseboat. Drift past the hauntingly beautiful silhouettes of drowned trees, spot elephants and buffalo on the shoreline, and try your hand at tiger fishing — one of Africa's most exciting angling pursuits. The houseboat features en-suite cabins, a fully equipped galley, upper sundowner deck, and a tender boat for fishing excursions and island exploration. Ideal for families, groups, and couples seeking a unique waterborne safari.",
    pricing: {
      unit: "per_group_per_night",
      amountUsd: 800,
    },
    photos: [
      {
        src: "/images/lodges/kariba-houseboat-1.jpg",
        alt: "Luxury houseboat cruising on the calm waters of Lake Kariba at sunset",
      },
    ],
    featured: true,
  },
  {
    id: "lodge-elephant-camp",
    slug: "elephant-camp",
    category: "lodge",
    name: "Elephant Camp",
    summary:
      "Exclusive luxury tented suites with private plunge pools and uninterrupted views of the Victoria Falls spray.",
    description:
      "Perched on a private concession within the Victoria Falls National Park, Elephant Camp offers just twelve luxury tented suites — each with a private plunge pool, indoor and outdoor shower, and a viewing deck overlooking the spray of Victoria Falls. The camp emphasises personalised service with dedicated butlers, private dining options, and guided walks with resident elephants. A tranquil retreat combining five-star comfort with an authentic bush setting, minutes from the falls.",
    pricing: {
      unit: "per_person_per_night",
      amountUsd: 520,
    },
    photos: [
      {
        src: "/images/lodges/elephant-camp-1.jpg",
        alt: "Luxury tented suite at Elephant Camp with a private plunge pool and bush views",
      },
    ],
    destinationSlug: "destination-a",
    featured: true,
  },

  // ── test-only placeholders (kept for unit-test compatibility) ──────
  {
    id: "lodge-a",
    slug: "lodge-a",
    category: "lodge",
    name: "[Lodge A]",
    summary: "[One line description for Lodge A]",
    description: "[Comprehensive guide and overview for Lodge A placeholder.]",
    pricing: { unit: "per_group_per_night", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-a",
    featured: false,
  },
  {
    id: "lodge-b",
    slug: "lodge-b",
    category: "lodge",
    name: "[Lodge B]",
    summary: "[One line description for Lodge B]",
    description: "[Comprehensive guide and overview for Lodge B placeholder.]",
    pricing: { unit: "per_group_per_night", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-b",
    featured: false,
  },
  {
    id: "lodge-c",
    slug: "lodge-c",
    category: "lodge",
    name: "[Lodge C]",
    summary: "[One line description for Lodge C]",
    description: "[Comprehensive guide and overview for Lodge C placeholder.]",
    pricing: { unit: "per_group_per_night", amountUsd: 0 },
    photos: [],
    destinationSlug: "destination-c",
    featured: false,
  },
  {
    id: "lodge-d",
    slug: "lodge-d",
    category: "lodge",
    name: "[Lodge D]",
    summary: "[One line description for Lodge D]",
    description: "[Comprehensive guide and overview for Lodge D placeholder.]",
    pricing: { unit: "per_group_per_night", amountUsd: 0 },
    photos: [],
    featured: false,
  },
];
