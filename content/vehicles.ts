import { Offering } from "./types";

export const vehicles: Offering[] = [
  {
    id: "vehicle-private-chauffeur",
    slug: "full-day-chauffeur-safari-vehicle",
    category: "vehicle",
    name: "Full-Day Private Chauffeur & Safari Vehicle",
    summary:
      "Dedicated private air-conditioned vehicle and professional driver for full-day touring, game viewing, and custom itineraries.",
    description:
      "Enjoy complete freedom and comfort around Victoria Falls and regional national parks with your own private vehicle and dedicated chauffeur. Ideal for families, custom photography safaris, and flexible travellers who want to explore at their own pace without coordinating multiple taxis.\n\nWhat's included: up to a full day of private local touring around Victoria Falls town, lodges, the rainforest entrance, craft markets, and scenic viewpoints with fuel, bottled water, and an experienced local driver-guide.\n\nRate: $150 per day per vehicle (up to 10 passengers). Pickup is arranged directly from your Victoria Falls hotel or lodge at your preferred departure time.",
    pricing: {
      unit: "per_group_per_day",
      amountUsd: 150,
    },
    photos: [
      {
        src: "/images/vehicles/safari-van-1.jpg",
        alt: "Private safari minivan with professional chauffeur in Victoria Falls",
      },
    ],
    destinationSlug: "victoria-falls",
    capacity: 10,
    featured: true,
  },
  {
    id: "vehicle-vic-falls-airport",
    slug: "victoria-falls-airport-transfer",
    category: "vehicle",
    name: "Victoria Falls Airport Transfer",
    summary:
      "Reliable private and shuttle transfers between Victoria Falls International Airport (VFA) and all town hotels or lodges.",
    description:
      "Arrive stress-free with door-to-door transfers between Victoria Falls International Airport (VFA) and any Victoria Falls town hotel or safari lodge (~20–22 km, approximately 25 minutes' drive). Your driver monitors incoming flights live—adjusting automatically for delays at no extra charge—and waits inside the arrivals hall holding a name board.\n\nPublished rates: Private taxi transfers are $30 per vehicle (1–4 passengers) or $40 per vehicle (5–7 passengers). Shared airport shuttles are $15 per person (minimum 2 passengers), and 15+ passenger group buses are $120 per bus.\n\nPractical tips: Have USD cash ready on arrival if you are purchasing a single-entry Zimbabwe visa or the $50 KAZA UniVisa at VFA immigration. Multi-currency estimates are available in the trip builder before confirming via WhatsApp or email.",
    pricing: {
      unit: "per_group",
      amountUsd: 30,
    },
    photos: [
      {
        src: "/images/vehicles/toyota-land-cruiser-1.jpg",
        alt: "Air-conditioned Kaizen airport transfer vehicle in Victoria Falls",
      },
    ],
    destinationSlug: "victoria-falls",
    capacity: 7,
    featured: true,
  },
  {
    id: "vehicle-livingstone",
    slug: "livingstone-zambia-transfer",
    category: "vehicle",
    name: "Livingstone Airport & Town Transfer (Zambia)",
    summary:
      "Seamless cross-border transfers across the Victoria Falls Bridge to Livingstone Town and Airport (LVI).",
    description:
      "Direct cross-border transfers connecting Victoria Falls (Zimbabwe) with Livingstone Town and Harry Mwanga Nkumbula International Airport (LVI) in Zambia via the historic Victoria Falls Bridge (~15–25 km, typically 45–60 minutes including border formalities).\n\nPublished rates: Private taxi to Livingstone Town is $40 per vehicle (1–4 passengers), and $60 per vehicle to Livingstone Airport (LVI). Shared shuttle rate is $20 per person (minimum 4 passengers).\n\nBorder & visa logistics: Our driver assists with luggage and guides you through both Zimbabwe and Zambia immigration posts. Eligible travellers planning to visit both sides of the falls or Livingstone Island / Devil's Pool typically use the $50 KAZA UniVisa for multiple crossings between Zimbabwe and Zambia within 30 days.",
    pricing: {
      unit: "per_group",
      amountUsd: 40,
    },
    photos: [
      {
        src: "/images/vehicles/safari-van-1.jpg",
        alt: "Modern transfer vehicle for cross-border trips between Victoria Falls and Livingstone Zambia",
      },
    ],
    destinationSlug: "victoria-falls",
    capacity: 7,
    featured: true,
  },
  {
    id: "vehicle-kasane-chobe",
    slug: "kasane-chobe-botswana-transfer",
    category: "vehicle",
    name: "Kasane & Chobe Transfer (Botswana)",
    summary:
      "Door-to-door transfer connecting Victoria Falls to Kazungula Border and Kasane Town / Chobe Safari Lodges.",
    description:
      "Direct road transfers linking Victoria Falls (Zimbabwe) with the Kazungula Border Bridge and Kasane Town or your Chobe River safari lodge in Botswana (~80 km, typically 1 to 2 hours depending on border queue traffic). Our experienced drivers meet you at your lodge or VFA airport and guide you smoothly through Zimbabwe and Botswana immigration.\n\nPublished rates: Private taxi (1–4 passengers) is $80 per vehicle to Kazungula Border or $120 per vehicle direct to Kasane Town. Shared shuttles (minimum 4 passengers) are $25 per person to Kazungula Border or $35 per person to Kasane Town. Large group buses (15+ passengers) are $230 to Kazungula Border or $420 to Kasane Town.\n\nImportant visa note: The $50 KAZA UniVisa covers same-day trips into Botswana via Kazungula, but staying overnight in Kasane/Chobe invalidates KAZA re-entry into Zimbabwe—ensure your Zimbabwe visa allows double entry if returning after an overnight Chobe stay.",
    pricing: {
      unit: "per_group",
      amountUsd: 80,
    },
    photos: [
      {
        src: "/images/vehicles/toyota-land-cruiser-1.jpg",
        alt: "Kaizen transfer vehicle ready for cross-border journeys to Botswana",
      },
    ],
    destinationSlug: "chobe",
    capacity: 7,
    featured: true,
  },
  {
    id: "vehicle-hwange",
    slug: "hwange-national-park-transfer",
    category: "vehicle",
    name: "Hwange National Park Safari Transfer",
    summary:
      "Comfortable overland highway transfer connecting Victoria Falls to Hwange National Park safari lodges.",
    description:
      "Scenic overland road transfer connecting Victoria Falls town or VFA Airport to Hwange Main Camp and surrounding safari lodges (~100–160 km, typically 2 to 3.5 hours along the sealed Victoria Falls–Bulawayo highway depending on your camp location). Ideal for guests arriving on midday flights who want to reach Hwange in time for afternoon game drives.\n\nPublished rates: Shared shuttle rate is $60 per person (minimum 4 passengers), and group charter buses (15+ passengers) are $600 per bus. Private 4x4 or minibus transfers can also be arranged on request.\n\nPractical notes: Air-conditioned vehicles include complimentary bottled water and generous luggage space for safari duffel bags and camera gear.",
    pricing: {
      unit: "per_person",
      amountUsd: 60,
    },
    photos: [
      {
        src: "/images/vehicles/safari-van-1.jpg",
        alt: "Spacious overland transfer vehicle on the road to Hwange National Park",
      },
    ],
    destinationSlug: "zimbabwe-safaris",
    capacity: 15,
    featured: true,
  },
  {
    id: "vehicle-inter-hotel",
    slug: "inter-hotel-town-taxi",
    category: "vehicle",
    name: "Local Town & Inter-Hotel Taxi Service",
    summary:
      "On-demand private taxi transfers between Victoria Falls hotels, lodges, The Lookout Café, and town center.",
    description:
      "Dependable local point-to-point transfers around Victoria Falls for restaurant reservations, rainforest walks, sunset cruises, The Lookout Café, and lodge-to-lodge hops.\n\nPublished rates: Private taxis (1–4 passengers) are $5 between lodges and town center, $7 to Victoria Falls Border, The Lookout Café, The Boma, or Baines ($10 for 5–7 passengers), and $10 to A'Zambezi River Lodge, Crocodile Farm, or Victoria Falls Safari Lodge. Inter-hotel shared shuttles are $6 per person (minimum 3) or $60 per 15+ passenger bus.\n\nFixed local rates eliminate street haggling and ensure punctual evening return pickups back to your lodge.",
    pricing: {
      unit: "per_group",
      amountUsd: 5,
    },
    photos: [
      {
        src: "/images/vehicles/safari-van-1.jpg",
        alt: "Prompt private chauffeur taxi vehicle in Victoria Falls",
      },
    ],
    destinationSlug: "victoria-falls",
    capacity: 7,
    featured: true,
  },
];
