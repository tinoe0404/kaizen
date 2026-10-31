import { Offering } from "./types";

export const lodges: Offering[] = [
  // ── Victoria Falls accommodation ──────────────────────────────────
  {
    id: "lodge-victoria-falls-safari-lodge",
    slug: "victoria-falls-safari-lodge",
    category: "lodge",
    name: "Victoria Falls Safari Lodge",
    summary:
      "Award-winning lodge perched on a plateau overlooking the Zambezi National Park with panoramic bushveld views.",
    description:
      "Set on an elevated plateau just minutes from the Victoria Falls, this award-winning lodge offers sweeping views over the Zambezi National Park waterhole, where elephants, buffalo, and warthogs gather at dusk. Spacious thatched-roof rooms feature private balconies, en-suite bathrooms, and natural stone finishes. Guests enjoy a choice of fine-dining and casual restaurants, an infinity pool overlooking the bush, and complimentary shuttle transfers to the falls. An ideal base for adventure activities by day and starlit dinners by night.",
    pricing: { unit: "per_person_per_night", amountUsd: 280 },
    photos: [
      {
        src: "/images/lodges/victoria-falls-safari-lodge-1.jpg",
        alt: "Victoria Falls Safari Lodge overlooking the Zambezi National Park waterhole at sunset",
      },
    ],
    destinationSlug: "victoria-falls",
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
    pricing: { unit: "per_person_per_night", amountUsd: 220 },
    photos: [
      {
        src: "/images/lodges/hwange-safari-lodge-1.jpg",
        alt: "Hwange Safari Lodge exterior with thatched roof surrounded by bushveld",
      },
    ],
    destinationSlug: "victoria-falls",
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
    pricing: { unit: "per_person_per_night", amountUsd: 450 },
    photos: [
      {
        src: "/images/lodges/mana-pools-camp-1.jpg",
        alt: "Luxury safari tent interior at Mana Pools Wilderness Camp with warm lighting",
      },
    ],
    destinationSlug: "victoria-falls",
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
    pricing: { unit: "per_person_per_night", amountUsd: 195 },
    photos: [
      {
        src: "/images/lodges/matobo-hills-lodge-1.jpg",
        alt: "Elegant lodge bedroom with warm décor set in the Matobo Hills landscape",
      },
    ],
    destinationSlug: "victoria-falls",
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
    pricing: { unit: "per_group_per_night", amountUsd: 800 },
    photos: [
      {
        src: "/images/lodges/kariba-houseboat-1.jpg",
        alt: "Luxury houseboat cruising on the calm waters of Lake Kariba at sunset",
      },
    ],
    destinationSlug: "victoria-falls",
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
    pricing: { unit: "per_person_per_night", amountUsd: 520 },
    photos: [
      {
        src: "/images/lodges/elephant-camp-1.jpg",
        alt: "Luxury tented suite at Elephant Camp with a private plunge pool and bush views",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },

  // ── Chobe, Botswana accommodation ─────────────────────────────────
  {
    id: "lodge-chobe-safari-lodge",
    slug: "chobe-safari-lodge",
    category: "lodge",
    name: "Chobe Safari Lodge",
    summary:
      "Riverside lodge in Kasane with direct access to Chobe National Park, boat jetty, and sunset deck.",
    description:
      "Situated on the banks of the Chobe River in Kasane, Chobe Safari Lodge is the only lodge in town with direct frontage on the river. Watch elephants, hippos, and monitor lizards from the elevated sunset deck or take a short walk to the private boat jetty for morning and afternoon river safaris. Accommodation ranges from safari rooms and rondavels to self-catering chalets, all surrounded by manicured gardens. The lodge also serves as the departure point for Chobe day trips from Victoria Falls.",
    pricing: { unit: "per_person_per_night", amountUsd: 250 },
    photos: [
      {
        src: "/images/lodges/chobe-safari-lodge-1.jpg",
        alt: "Chobe Safari Lodge riverside deck and safari grounds on the Chobe River",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "lodge-chobe-game-lodge",
    slug: "chobe-game-lodge",
    category: "lodge",
    name: "Chobe Game Lodge",
    summary:
      "The only permanent lodge inside Chobe National Park, offering premium game viewing and all-inclusive packages.",
    description:
      "Chobe Game Lodge holds the distinction of being the only permanent safari lodge located within the boundaries of Chobe National Park. Its elevated position on the riverbank provides unmatched game viewing — elephants regularly pass through the grounds, and hippos can be heard from your room at night. The all-inclusive package covers game drives, boat safaris, all meals, premium drinks, laundry, and park fees. Spacious river-facing rooms feature private balconies, air conditioning, and elegant safari décor.",
    pricing: { unit: "per_person_per_night", amountUsd: 480 },
    photos: [
      {
        src: "/images/lodges/chobe-game-lodge-1.jpg",
        alt: "Chobe Game Lodge elevated riverfront view inside Chobe National Park",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "lodge-chobe-bush-lodge",
    slug: "chobe-bush-lodge",
    category: "lodge",
    name: "Chobe Bush Lodge",
    summary:
      "Affordable thatched-roof lodge on the outskirts of Kasane with pool, restaurant, and park transfers.",
    description:
      "A warm and welcoming bush lodge on the edge of Kasane, offering affordable access to Chobe National Park. The thatched-roof chalets are set among indigenous trees with views over the surrounding bush. Facilities include a swimming pool, open-air boma restaurant serving local and international cuisine, and a curio shop. Game drives and boat safaris are arranged directly from the lodge with reliable local operators. Ideal for budget-conscious travellers seeking a comfortable Chobe base.",
    pricing: { unit: "per_person_per_night", amountUsd: 140 },
    photos: [
      {
        src: "/images/lodges/chobe-bush-lodge-1.jpg",
        alt: "Chobe Bush Lodge thatched-roof chalets in Kasane",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },

  // ── Namibia accommodation ─────────────────────────────────────────
  {
    id: "lodge-sossusvlei-lodge",
    slug: "sossusvlei-lodge",
    category: "lodge",
    name: "Sossusvlei Lodge",
    summary:
      "Desert lodge at the gates of Sossusvlei with panoramic dune views, stargazing deck, and sunrise excursions.",
    description:
      "Located at the entrance to the Namib-Naukluft National Park, Sossusvlei Lodge offers the closest accommodation to the iconic red dunes. Adobe-style rooms blend into the desert landscape, each with a private terrace overlooking the vast Namib plains. The lodge features a stargazing deck with a resident astronomer, an infinity pool that appears to merge with the desert horizon, and a restaurant serving Namibian game cuisine. Guided sunrise excursions to Dune 45 and Deadvlei depart directly from the lodge.",
    pricing: { unit: "per_person_per_night", amountUsd: 320 },
    photos: [
      {
        src: "/images/lodges/sossusvlei-lodge-1.jpg",
        alt: "Sossusvlei Lodge adobe-style rooms with sweeping desert views",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "lodge-etosha-safari-camp",
    slug: "etosha-safari-camp",
    category: "lodge",
    name: "Etosha Safari Camp",
    summary:
      "Tented camp on the southern boundary of Etosha with a floodlit waterhole and guided park drives.",
    description:
      "Etosha Safari Camp offers canvas-and-wood chalets arranged around a central boma area on the southern approach to Etosha National Park. Each unit features an en-suite bathroom, ceiling fan, and private veranda. The camp's floodlit waterhole attracts jackals, honey badgers, and occasionally elephants after dark. Guided game drives depart daily into the park through the nearby Anderson Gate, targeting Etosha's famous waterholes where lion, rhino, and large herds of plains game congregate.",
    pricing: { unit: "per_person_per_night", amountUsd: 180 },
    photos: [
      {
        src: "/images/lodges/etosha-safari-camp-1.jpg",
        alt: "Etosha Safari Camp comfortable chalets near Anderson Gate",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "lodge-swakopmund-hotel",
    slug: "swakopmund-hotel",
    category: "lodge",
    name: "Swakopmund Hotel",
    summary:
      "Historic hotel in the heart of Swakopmund with German colonial architecture, ocean views, and adventure concierge.",
    description:
      "Housed in a beautifully restored German colonial building in the centre of Swakopmund, this landmark hotel combines old-world charm with modern luxury. Rooms feature high ceilings, period furniture, and views over the Atlantic or the town's palm-lined avenues. An in-house adventure concierge can arrange sandboarding, quad biking, skydiving, dolphin cruises, and Skeleton Coast fly-in safaris. The hotel's restaurant serves fresh Atlantic seafood and Namibian game dishes paired with local wines.",
    pricing: { unit: "per_person_per_night", amountUsd: 210 },
    photos: [
      {
        src: "/images/lodges/swakopmund-hotel-1.jpg",
        alt: "Swakopmund Hotel classic colonial architecture and palm trees",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
];
