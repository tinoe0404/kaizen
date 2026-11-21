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
      "Enjoy complete freedom and comfort around Victoria Falls and regional national parks with your own private vehicle and dedicated chauffeur. Ideal for families, custom photography safaris, and flexible travelers who want to explore at their own pace without worrying about local taxi hailing or navigation. Includes unlimited mileage within the greater Victoria Falls area, fuel, mineral water, and a knowledgeable local driver-guide. Daily charter rate: $150 per day for the entire group (up to 10 passengers).",
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
      "Arrive stress-free with our premier Victoria Falls Airport transfer service. Your professional driver welcomes you in the arrivals terminal with a personalized name board, assists with your luggage, and escorts you to a clean, air-conditioned vehicle for a smooth ride to your lodge or hotel. We track flights live to accommodate any delays at no extra charge. Available as private taxi transfers ($30 for 1-4 passengers, $40 for 5-7 passengers), shared airport shuttles ($15 per person rack rate, minimum 2 passengers), or chartered 15+ passenger group buses ($120 per bus).",
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
      "Convenient cross-border transfers connecting Victoria Falls (Zimbabwe) with Livingstone Town and Harry Mwanga Nkumbula International Airport (LVI) in Zambia. Enjoy scenic views crossing the iconic Victoria Falls Bridge while our experienced drivers guide you seamlessly through both border immigration and customs posts. Rates: Private taxi to Livingstone Town is $40 per vehicle (1-4 passengers), and $60 per vehicle to Livingstone Airport. Shared shuttle rack rate is $20 per person (minimum 4 passengers).",
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
      "Direct cross-border connections linking Victoria Falls to Kazungula Border post and Kasane Town, the gateway to Chobe National Park in Botswana. Travel in air-conditioned comfort with experienced drivers who assist with border clearance. Private taxi transfer to Kazungula Border: $80 per vehicle (1-4 passengers); direct to Kasane Town: $120 per vehicle. Shared shuttle rack rates: $25 per person to Kazungula Border (min 4), $35 per person to Kasane Town (min 4). Large group bus (15+ passengers): $230 to Kazungula Border, $420 to Kasane Town.",
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
      "Scenic overland transfer linking Victoria Falls to the gates, safari lodges, and wilderness camps of Hwange National Park (approx. 2.5 hours on well-maintained tar road). Travel in spacious, air-conditioned comfort with complimentary bottled water and flexible departure timing to coordinate with game drive schedules. Shared shuttle rack rate: $60 per person (minimum 4 passengers). Group charter bus (15+ passengers): $600 per bus. Private vehicle charter available upon request.",
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
      "Fast, dependable local taxi service for dinners, activities, and lodge transfers around Victoria Falls. Whether heading from your lodge to a local restaurant, the rainforest gate, The Boma Dinner & Drum Show, or The Lookout Café, our private fleet is on standby. Lodges to Town: $5 per vehicle (1-4 passengers). Lodges to Border / The Lookout Café / Baines: $7 per vehicle (1-4 pax), $10 (5-7 pax). Lodges to A'Zambezi River Lodge / Safari Lodge / Crocodile Farm: $10 per vehicle. Inter-hotel shared shuttle: $6 per person (min 3) or $60 per bus (15+ passengers).",
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
    capacity: 7,
    featured: true,
  },
];
