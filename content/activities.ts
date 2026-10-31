import { Offering } from "./types";

export const activities: Offering[] = [
  // ── Victoria Falls activities ─────────────────────────────────────
  {
    id: "activity-bunji",
    slug: "bunji",
    category: "activity",
    name: "Bungee Jumping",
    summary:
      "111-meter bungee jump from the Victoria Falls Bridge over the Zambezi River.",
    description:
      "Experience the ultimate adrenaline rush with a 111-meter bungee jump from the iconic Victoria Falls Bridge. Suspended directly over the roaring Zambezi River against the backdrop of the majestic falls, this world-renowned leap combines sheer thrill with breathtaking canyon views. Fully supervised by certified jump masters with international safety standards.",
    pricing: { unit: "per_person", amountUsd: 160 },
    photos: [
      {
        src: "/images/activities/bunji-1.jpg",
        alt: "Thrill seeker bungee jumping from the Victoria Falls Bridge over the Zambezi River",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-rafting",
    slug: "rafting",
    category: "activity",
    name: "White Water Rafting",
    summary:
      "World-class Grade 5 white water rafting down the turbulent Batoka Gorge.",
    description:
      "Recognized globally as one of the premier white-water rafting adventures on earth. Navigate the turbulent churning rapids of the Batoka Gorge directly beneath Victoria Falls, accompanied by expert river guides and full safety equipment. An unforgettable full-day or half-day excursion of high adventure, dramatic canyon scenery, and adrenaline.",
    pricing: { unit: "per_person", amountUsd: 130 },
    photos: [
      {
        src: "/images/activities/rafting-1.jpg",
        alt: "White water rafting team navigating the rapids of the Batoka Gorge on the Zambezi River",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-cruises",
    slug: "cruises",
    category: "activity",
    name: "Zambezi River Cruises",
    summary:
      "Sunset and dinner boat cruises along the upper Zambezi River with wildlife viewing.",
    description:
      "Drift peacefully along the tranquil waters of the upper Zambezi River above Victoria Falls. Enjoy panoramic golden-hour sunsets, complimentary refreshments, and frequent sightings of hippos, crocodiles, elephants on the riverbanks, and vibrant birdlife. A quintessentially relaxing African river safari experience.",
    pricing: { unit: "per_person", amountUsd: 75 },
    photos: [
      {
        src: "/images/activities/cruises-1.jpg",
        alt: "Sunset boat cruise drifting along the tranquil waters of the Zambezi River",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-flights-over-the-falls",
    slug: "flights-over-the-falls",
    category: "activity",
    name: "Flights Over the Falls",
    summary:
      "Scenic helicopter tours offering breathtaking aerial views of Victoria Falls and the Batoka Gorge.",
    description:
      "Take to the skies for an awe-inspiring aerial perspective of Victoria Falls, known locally as the 'Flight of Angels'. Marvel at the sheer scale of the curtain of water, the zigzagging gorges carved by the Zambezi River, and surrounding national park landscapes. Spectacular photo opportunities from specially designed viewing windows.",
    pricing: { unit: "per_person", amountUsd: 175 },
    photos: [
      {
        src: "/images/activities/flights-over-the-falls-1.jpg",
        alt: "Aerial helicopter view of the dramatic gorge and mist of Victoria Falls",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-game-drives",
    slug: "game-drives",
    category: "activity",
    name: "Guided Game Drives",
    summary:
      "Open-vehicle wildlife game drives tracking Africa's Big Five across pristine national parks.",
    description:
      "Embark on sunrise or afternoon game drives in open 4x4 safari vehicles guided by professional trackers. Explore the diverse wilderness habitats of Hwange and Victoria Falls National Parks, tracking lions, leopards, elephant herds, buffalo, and a rich array of plains wildlife in their natural environment.",
    pricing: { unit: "per_person", amountUsd: 110 },
    photos: [
      {
        src: "/images/activities/game-drives-1.jpg",
        alt: "Open 4x4 safari game drive vehicle observing wildlife in the African bush",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-tour-of-zimbabwe",
    slug: "tour-of-zimbabwe",
    category: "activity",
    name: "Tour of Zimbabwe",
    summary:
      "Multi-day guided safari and cultural expedition across Zimbabwe's iconic landmarks.",
    description:
      "A curated travel journey connecting Zimbabwe's greatest treasures: the mist of Victoria Falls, the vast wilderness of Hwange National Park, the granite domes of Matobo Hills, and the ancient stone architecture of Great Zimbabwe. Includes private transportation, certified regional guides, and personalized route coordination.",
    pricing: { unit: "per_person", amountUsd: 850 },
    photos: [
      {
        src: "/images/activities/tour-of-zimbabwe-1.jpg",
        alt: "Scenic view of Victoria Falls and the lush surrounding rainforest landscape",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-gorge-swing",
    slug: "gorge-swing",
    category: "activity",
    name: "Gorge Swing",
    summary:
      "A thrilling 70-meter free-fall swing over the Batoka Gorge with 120-meter pendulum arc.",
    description:
      "Step off the edge of the Batoka Gorge and plunge 70 meters in free-fall before swinging in a massive 120-meter arc over the rapids below. Widely regarded as the highest commercial gorge swing in the world, it combines the rush of a bungee with the exhilaration of a giant pendulum. Available as a solo jump, tandem with a partner, or as a slide along the cable. Safety harnesses and professional guides ensure a secure but unforgettable experience.",
    pricing: { unit: "per_person", amountUsd: 115 },
    photos: [
      {
        src: "/images/activities/gorge-swing-1.jpg",
        alt: "Gorge swing over the Batoka Gorge near Victoria Falls",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-zip-lining",
    slug: "zip-lining",
    category: "activity",
    name: "Zip-lining & Canopy Tour",
    summary:
      "High-wire zip-line adventure through the forest canopy above the Batoka Gorge.",
    description:
      "Soar above the lush canopy lining the Batoka Gorge on a series of zip-line cables spanning up to 250 meters between platforms. The canopy tour combines the thrill of flight with stunning views of the gorge, the Zambezi River, and the spray of Victoria Falls in the distance. Suitable for all ages and fitness levels, with full safety briefing and equipment provided by certified guides.",
    pricing: { unit: "per_person", amountUsd: 85 },
    photos: [
      {
        src: "/images/activities/zip-lining-1.jpg",
        alt: "Zip-line adventure through the forest canopy above the Batoka Gorge",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-devils-pool",
    slug: "devils-pool",
    category: "activity",
    name: "Devil's Pool Swim",
    summary:
      "Swim at the very edge of Victoria Falls in a natural rock pool on Livingstone Island.",
    description:
      "One of the world's most exclusive natural swimming experiences. Accessible only during low-water season (roughly August to January), Devil's Pool is a natural rock pool perched on the lip of Victoria Falls. Guided by trained lifeguards, you wade to the edge and peer over the 108-meter drop while the Zambezi cascades around you. The excursion includes a boat transfer to Livingstone Island and a guided tour of the island's history and geology.",
    pricing: { unit: "per_person", amountUsd: 100 },
    photos: [
      {
        src: "/images/activities/devils-pool-1.jpg",
        alt: "Natural rock pool at the edge of Victoria Falls on Livingstone Island",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-microlight",
    slug: "microlight",
    category: "activity",
    name: "Microlight Flight",
    summary:
      "Open-cockpit microlight flight over Victoria Falls for an unobstructed aerial perspective.",
    description:
      "Experience the spray and roar of Victoria Falls from above in an open-cockpit microlight aircraft. Unlike helicopter tours, the microlight offers a completely unobstructed 360-degree view, bringing you closer to the falls, the gorges, and the surrounding wildlife. Flights range from 15 to 30 minutes and depart from a grass airstrip minutes from town. GoPro cameras are available for hire to capture the experience.",
    pricing: { unit: "per_person", amountUsd: 165 },
    photos: [
      {
        src: "/images/activities/microlight-1.jpg",
        alt: "Microlight aircraft flying over Victoria Falls for aerial tour",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-bridge-tour",
    slug: "bridge-tour",
    category: "activity",
    name: "Historical Bridge Tour",
    summary:
      "Guided walking tour of the iconic Victoria Falls Bridge, its engineering history, and panoramic gorge views.",
    description:
      "Walk across the historic Victoria Falls Bridge — completed in 1905 and spanning 198 meters above the Zambezi. A knowledgeable guide shares the fascinating engineering story of how the bridge was designed by Sir Ralph Freeman and shipped from England, the role of Cecil John Rhodes in its conception, and the bridge's place in Southern African history. The tour includes access to restricted viewpoints over the gorge and spectacular photo opportunities of the falls and the no-man's-land border between Zimbabwe and Zambia.",
    pricing: { unit: "per_person", amountUsd: 40 },
    photos: [
      {
        src: "/images/activities/bridge-tour-1.jpg",
        alt: "Historic Victoria Falls Bridge spanning the gorge over the Zambezi River",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: false,
  },
  {
    id: "activity-elephant-encounter",
    slug: "elephant-encounter",
    category: "activity",
    name: "Elephant Encounter",
    summary:
      "Up-close interaction with rescued African elephants — feeding, walking alongside, and learning about conservation.",
    description:
      "Spend time with a small herd of rescued African elephants at a private sanctuary near Victoria Falls. Under the guidance of experienced elephant handlers, you walk alongside these gentle giants through the bush, hand-feed them, and learn about their individual personalities, rescue stories, and the broader challenges of elephant conservation in Southern Africa. A deeply moving and educational experience suitable for all ages.",
    pricing: { unit: "per_person", amountUsd: 150 },
    photos: [
      {
        src: "/images/activities/elephant-encounter-1.jpg",
        alt: "Traveller walking alongside a rescued African elephant in the bush",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },
  {
    id: "activity-village-tour",
    slug: "village-tour",
    category: "activity",
    name: "Cultural Village Tour",
    summary:
      "Guided tour of a traditional Zimbabwean village with drumming, dancing, and local cuisine.",
    description:
      "Visit a traditional village near Victoria Falls and experience the daily rhythms of Zimbabwean rural life. Your local guide introduces you to village elders, traditional healers, artisans crafting baskets and carvings, and energetic drumming and dancing performances. Sample locally brewed traditional beer and freshly prepared sadza with relish. A percentage of tour proceeds go directly to community development projects in the area.",
    pricing: { unit: "per_person", amountUsd: 45 },
    photos: [
      {
        src: "/images/activities/village-tour-1.jpg",
        alt: "Traditional Zimbabwean village cultural tour with dancing and drumming",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: false,
  },
  {
    id: "activity-jet-boat",
    slug: "jet-boat",
    category: "activity",
    name: "Jet Boat Ride",
    summary:
      "High-speed jet boat ride through the rapids of the Batoka Gorge with 360-degree spins.",
    description:
      "Hold on tight as a powerful jet boat rockets through the lower rapids of the Batoka Gorge at speeds of up to 75 km/h. The skilled pilot navigates standing waves and performs thrilling 360-degree spins, drenching passengers in the spray of the Zambezi. A short but intensely exhilarating ride, ideal for those who want the rapids experience without the full-day commitment of white-water rafting.",
    pricing: { unit: "per_person", amountUsd: 95 },
    photos: [
      {
        src: "/images/activities/jet-boat-1.jpg",
        alt: "High-speed jet boat ride through the rapids of the Batoka Gorge",
      },
    ],
    destinationSlug: "victoria-falls",
    featured: true,
  },

  // ── Chobe, Botswana activities ────────────────────────────────────
  {
    id: "activity-chobe-boat-safari",
    slug: "chobe-boat-safari",
    category: "activity",
    name: "Chobe River Boat Safari",
    summary:
      "Guided boat safari along the Chobe River with close-up views of elephants, hippos, and crocodiles.",
    description:
      "Cruise the Chobe River aboard a purpose-built safari boat and witness one of Africa's greatest wildlife spectacles. Huge herds of elephants gather along the riverbanks to drink and bathe, while hippos surface alongside the vessel, crocodiles sun themselves on sandbanks, and African fish eagles call from the treetops. Morning and sunset departures offer different wildlife behaviour and spectacular golden-hour photography. Boats carry a maximum of 12 guests for an intimate, unhurried experience.",
    pricing: { unit: "per_person", amountUsd: 85 },
    photos: [
      {
        src: "/images/activities/chobe-boat-safari-1.jpg",
        alt: "Safari boat cruising the Chobe River with elephants on the riverbank",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "activity-chobe-game-drive",
    slug: "chobe-game-drive",
    category: "activity",
    name: "Chobe Game Drive",
    summary:
      "Open-vehicle 4x4 game drive through Chobe National Park tracking lion, leopard, buffalo, and wild dog.",
    description:
      "Explore the diverse habitats of Chobe National Park in an open-sided 4x4 safari vehicle with an experienced Botswanan ranger. The park's mosaic of riverine forest, floodplains, and mopane woodland supports exceptional predator populations — including lion, leopard, cheetah, and the rare African wild dog. Morning drives focus on predator activity, while afternoon drives end with golden-hour sightings at waterholes. A cooler box with refreshments is provided on every game drive.",
    pricing: { unit: "per_person", amountUsd: 95 },
    photos: [
      {
        src: "/images/activities/chobe-game-drive-1.jpg",
        alt: "Open 4x4 game drive vehicle in Chobe National Park",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "activity-chobe-day-trip",
    slug: "chobe-day-trip",
    category: "activity",
    name: "Chobe Day Trip",
    summary:
      "Full-day trip from Victoria Falls to Chobe National Park including game drive, boat cruise, and lunch.",
    description:
      "A seamlessly organized full-day excursion departing from Victoria Falls, crossing the Kazungula border into Botswana, and entering Chobe National Park. The package includes a morning game drive through the park, a buffet lunch at a riverside lodge, and an afternoon boat cruise along the Chobe River. All border-crossing formalities, park fees, transport, and meals are included. Return to Victoria Falls by late afternoon. The most popular way to experience Chobe without an overnight stay.",
    pricing: { unit: "per_person", amountUsd: 180 },
    photos: [
      {
        src: "/images/activities/chobe-day-trip-1.jpg",
        alt: "Wildlife at a Chobe National Park waterhole during a day trip",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "activity-chobe-fishing",
    slug: "chobe-fishing",
    category: "activity",
    name: "Chobe Fishing Safari",
    summary:
      "Tiger fishing expedition on the Chobe River with professional guides and tackle provided.",
    description:
      "The Chobe River is one of Southern Africa's premier tiger fishing destinations. Join an experienced fishing guide aboard a fully equipped boat for a half-day or full-day expedition targeting the ferocious tiger fish — known for its explosive strikes and acrobatic leaps. All rods, reels, tackle, and bait are provided. Catch-and-release is practiced to protect the fishery. Between catches, enjoy sightings of elephants, hippos, and waterbirds along the riverbanks.",
    pricing: { unit: "per_person", amountUsd: 120 },
    photos: [
      {
        src: "/images/activities/chobe-fishing-1.jpg",
        alt: "Tiger fishing on the Chobe River with professional guide",
      },
    ],
    destinationSlug: "chobe",
    featured: true,
  },
  {
    id: "activity-chobe-birding",
    slug: "chobe-birding",
    category: "activity",
    name: "Chobe Birding Safari",
    summary:
      "Specialist birding safari targeting Chobe's 450+ species including Pel's fishing owl and African skimmer.",
    description:
      "Chobe National Park is a birding paradise with over 450 recorded species. This specialist birding safari targets the park's most sought-after species, including Pel's fishing owl, African skimmer, slaty egret, western banded snake eagle, and the vibrant carmine bee-eater colonies along the riverbanks. Led by an expert ornithological guide with high-quality optics and reference materials provided. Both boat-based and vehicle-based birding are included for maximum habitat coverage.",
    pricing: { unit: "per_person", amountUsd: 100 },
    photos: [
      {
        src: "/images/activities/chobe-birding-1.jpg",
        alt: "Colourful bird perched on a branch along the Chobe River",
      },
    ],
    destinationSlug: "chobe",
    featured: false,
  },

  // ── Namibia activities ────────────────────────────────────────────
  {
    id: "activity-sossusvlei",
    slug: "sossusvlei",
    category: "activity",
    name: "Sossusvlei Desert Excursion",
    summary:
      "Guided tour of the towering red dunes of Sossusvlei and the surreal clay pan of Deadvlei.",
    description:
      "Visit the iconic Sossusvlei — home to some of the tallest sand dunes on earth, rising over 300 meters above the desert floor. Climb the rust-red slopes of Dune 45 at sunrise for sweeping views across the Namib Desert, then descend into the hauntingly beautiful Deadvlei clay pan where 900-year-old camel thorn trees stand frozen against a cracked white floor. Your guide shares the geology, ecology, and cultural significance of this ancient desert landscape. Park fees and refreshments included.",
    pricing: { unit: "per_person", amountUsd: 195 },
    photos: [
      {
        src: "/images/activities/sossusvlei-1.jpg",
        alt: "Towering red sand dunes of Sossusvlei in the Namib Desert",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "activity-etosha-safari",
    slug: "etosha-safari",
    category: "activity",
    name: "Etosha National Park Safari",
    summary:
      "Multi-day guided safari through Etosha's wildlife-rich waterholes with Big Five sightings.",
    description:
      "Etosha National Park is one of Africa's great wildlife sanctuaries, centred around a vast shimmering salt pan visible from space. The park's network of natural and artificial waterholes concentrate wildlife for exceptional game viewing — including elephant, lion, leopard, black and white rhino, giraffe, cheetah, and vast herds of springbok, oryx, and zebra. Multi-day guided safaris include private transport, professional guide, park entry fees, and accommodation at restcamps within the park.",
    pricing: { unit: "per_person", amountUsd: 350 },
    photos: [
      {
        src: "/images/activities/etosha-safari-1.jpg",
        alt: "Wildlife gathered at an Etosha National Park waterhole",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "activity-sandboarding",
    slug: "sandboarding",
    category: "activity",
    name: "Sandboarding & Quad Biking",
    summary:
      "High-adrenaline sandboarding and quad biking across the towering dunes near Swakopmund.",
    description:
      "The massive coastal dunes near Swakopmund provide the perfect terrain for sandboarding — lying face-down on a specially waxed board and hurtling down near-vertical slopes at speeds of up to 80 km/h. Combine it with a quad biking excursion through the undulating dune fields for a full morning of desert adrenaline. All equipment, safety gear, and transfers from Swakopmund are provided. No prior experience required.",
    pricing: { unit: "per_person", amountUsd: 110 },
    photos: [
      {
        src: "/images/activities/sandboarding-1.jpg",
        alt: "Sandboarding down towering coastal dunes near Swakopmund",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "activity-skeleton-coast",
    slug: "skeleton-coast",
    category: "activity",
    name: "Skeleton Coast Tour",
    summary:
      "Fly-in safari to the remote Skeleton Coast with shipwrecks, seal colonies, and desert-adapted wildlife.",
    description:
      "Explore one of the most remote and dramatic coastlines on earth. The Skeleton Coast is a graveyard of shipwrecks battered by Atlantic fog and ferocious surf, backed by endless gravel plains and towering dune fields. This fly-in safari lands at a remote airstrip to explore the bleached whale bones and rusted hulks that give the coast its name, visit the massive Cape Cross seal colony, and track desert-adapted elephants, lions, and brown hyenas that survive in this extreme environment.",
    pricing: { unit: "per_person", amountUsd: 550 },
    photos: [
      {
        src: "/images/activities/skeleton-coast-1.jpg",
        alt: "Remote Skeleton Coast shoreline with shipwreck and Atlantic waves",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "activity-swakopmund-skydiving",
    slug: "swakopmund-skydiving",
    category: "activity",
    name: "Swakopmund Skydiving",
    summary:
      "Tandem skydive over the Namib Desert and Atlantic coastline from 10,000 feet.",
    description:
      "Leap from a plane at 10,000 feet and free-fall for 35 seconds over the extraordinary landscape where the Namib Desert meets the Atlantic Ocean. The tandem skydive offers unmatched views of Swakopmund, the endless dune sea, and the deep blue coastline. After the free-fall, a 5-minute parachute canopy ride brings you gently down to a beach landing strip. Professional video and photo packages are available. One of Africa's most scenic skydiving locations.",
    pricing: { unit: "per_person", amountUsd: 230 },
    photos: [
      {
        src: "/images/activities/swakopmund-skydiving-1.jpg",
        alt: "Tandem skydiver free-falling over the Namib Desert and Atlantic coastline",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },
  {
    id: "activity-namibia-self-drive",
    slug: "namibia-self-drive",
    category: "activity",
    name: "Namibia Self-Drive Safari",
    summary:
      "Curated self-drive itinerary through Namibia's highlights with pre-booked accommodation and route planning.",
    description:
      "A fully planned self-drive safari connecting Namibia's top destinations: Windhoek, Sossusvlei, Swakopmund, Damaraland, Etosha, and the Waterberg Plateau. We provide a detailed route guide, pre-booked accommodation, vehicle rental coordination, and 24-hour telephone support. Drive at your own pace along well-maintained gravel roads, stopping at iconic viewpoints, hidden waterholes, and charming roadside rest stops. The freedom of independent travel with the security of professional planning.",
    pricing: { unit: "per_person", amountUsd: 1200 },
    photos: [
      {
        src: "/images/activities/namibia-self-drive-1.jpg",
        alt: "Self-drive vehicle on a scenic Namibian gravel road through the desert",
      },
    ],
    destinationSlug: "namibia",
    featured: true,
  },

  // ── test-only placeholders (kept for unit-test compatibility) ──────
  {
    id: "activity-a",
    slug: "activity-a",
    category: "activity",
    name: "[Activity A]",
    summary: "[One line description for Activity A]",
    description:
      "[Comprehensive guide and overview for Activity A placeholder.]",
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
    description:
      "[Comprehensive guide and overview for Activity B placeholder.]",
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
    description:
      "[Comprehensive guide and overview for Activity C placeholder.]",
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
    description:
      "[Comprehensive guide and overview for Activity D placeholder.]",
    pricing: { unit: "per_person", amountUsd: 0 },
    photos: [],
    featured: false,
  },
];
