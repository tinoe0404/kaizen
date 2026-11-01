export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category:
    | "visas"
    | "seasonality"
    | "money"
    | "health"
    | "logistics";
}

export interface FaqCategoryDef {
  id: "all" | "visas" | "seasonality" | "money" | "health" | "logistics";
  label: string;
}

export const faqCategories: FaqCategoryDef[] = [
  { id: "all", label: "All Questions" },
  { id: "visas", label: "Visas & Entry" },
  { id: "seasonality", label: "Best Time & Seasons" },
  { id: "money", label: "Money & Currency" },
  { id: "health", label: "Health & Packing" },
  { id: "logistics", label: "Transfers & Self-Drive" },
];

export const faqs: FaqItem[] = [
  // ── Visas & Entry Requirements ────────────────────────────────────
  {
    id: "kaza-univisa",
    category: "visas",
    question: "What is the KAZA Univisa and how do I get it?",
    answer:
      "The KAZA Univisa costs $50 USD and allows standard visitors to travel freely between Zimbabwe and Zambia for up to 30 days. It also covers day trips into Botswana through the Kazungula border. It is available on arrival at Victoria Falls Airport, Harare Airport, Victoria Falls border post, and Livingstone Airport. Cash in USD is recommended to pay for the visa upon arrival.",
  },
  {
    id: "botswana-namibia-visas",
    category: "visas",
    question: "Do I need a separate visa for Botswana and Namibia?",
    answer:
      "Citizens of the United States, United Kingdom, European Union, Canada, Australia, and many other nations do not require an advance visa for tourist visits of up to 90 days in either Botswana or Namibia. You will receive an entry stamp at the border post or airport free of charge. Ensure your passport has at least 6 months remaining validity and at least 3 blank pages.",
  },
  {
    id: "child-travel-regulations",
    category: "visas",
    question: "Are there special travel rules for children under 18?",
    answer:
      "Yes. Botswana and Namibia strictly require all children traveling across international borders to carry an unabridged birth certificate showing both parents' details. If traveling with only one parent or a guardian, an affidavit of consent from the non-traveling parent(s) dated within the last 3 months is mandatory.",
  },

  // ── Best Time to Visit & Weather ──────────────────────────────────
  {
    id: "vic-falls-water-levels",
    category: "seasonality",
    question: "When is the best time of year to see Victoria Falls?",
    answer:
      "Victoria Falls is magnificent year-round, but offers distinctly different spectacles: High water peaks from February to May, when the spray is thunderous and visible from miles away (rain jackets essential). Low water runs from August to December, which is ideal for Devil's Pool swims, white-water rafting on the Batoka Gorge, and gorge zip-lining.",
  },
  {
    id: "wildlife-safari-season",
    category: "seasonality",
    question: "When is the best time for wildlife viewing in Chobe and Hwange?",
    answer:
      "The dry winter season from May to October is prime for big game. During these dry months, vegetation thins and massive herds of elephants, buffalo, and predator prides congregate densely along the Chobe River and Hwange waterholes. Temperatures are warm and comfortable by day with cool, crisp evenings.",
  },
  {
    id: "namibia-climate",
    category: "seasonality",
    question: "What is the weather like in the Namib Desert?",
    answer:
      "Namibia enjoys over 300 days of sunshine a year. Daytime temperatures in Sossusvlei and the central desert are pleasant and dry, while winter nights (June to August) can drop close to freezing. Layered clothing is essential for early morning dune climbs and evening stargazing.",
  },

  // ── Money, Currency & Payments ────────────────────────────────────
  {
    id: "zimbabwe-currency-cash",
    category: "money",
    question: "What currency should I bring to Zimbabwe?",
    answer:
      "United States Dollars (USD) are the primary and universal currency for tourism in Zimbabwe. Bring physical USD cash in clean, un-torn bills printed after 2013, as older or torn bills may be declined by vendors. Having small denominations ($5, $10, and $20 notes) is recommended for market purchases, park fees, and guide gratuities.",
  },
  {
    id: "credit-card-acceptance",
    category: "money",
    question: "Can I use credit or debit cards in Southern Africa?",
    answer:
      "Visa and Mastercard are widely accepted at all established hotels, safari lodges, restaurants, and activity centers in Victoria Falls, Kasane (Chobe), and across Namibia. American Express is less commonly accepted. We advise notifying your bank of your travel dates before departure to avoid automated fraud blocks.",
  },
  {
    id: "botswana-namibia-money",
    category: "money",
    question: "What currencies are used in Botswana and Namibia?",
    answer:
      "Botswana uses the Botswana Pula (BWP), while Namibia uses the Namibian Dollar (NAD), which is pegged 1:1 to the South African Rand (ZAR). Both countries have reliable ATMs and accept international credit cards in virtually all towns, lodges, and fuel stations.",
  },

  // ── Health, Safety & Packing ──────────────────────────────────────
  {
    id: "malaria-precautions",
    category: "health",
    question: "Do I need malaria medication?",
    answer:
      "Victoria Falls, Chobe National Park, and northern Namibia are seasonal malaria zones. We strongly recommend consulting your travel physician or healthcare clinic before departure to obtain recommended prophylaxis (such as Atovaquone-Proguanil/Malarone or Doxycycline). Pack effective insect repellent containing DEET or Picaridin and long-sleeved evening clothing.",
  },
  {
    id: "safari-packing-list",
    category: "health",
    question: "What should I pack for open vehicle game drives?",
    answer:
      "Pack neutral, earthy clothing (khakis, tans, greens, and browns). Avoid dark blue and black, which attract tsetse flies in certain riverine areas, as well as bright neon shades. Essential gear includes a wide-brim sun hat, UV sunglasses, high-SPF sunscreen, a compact pair of 8x42 or 10x42 binoculars, and a lightweight fleece or windbreaker for morning drives.",
  },
  {
    id: "drinking-water",
    category: "health",
    question: "Is tap water safe to drink?",
    answer:
      "All reputable safari lodges, hotels, and camps provide complimentary filtered or bottled drinking water in guest rooms, at meals, and aboard game drive vehicles. In major towns, tap water is generally treated, but visitors usually prefer filtered water during their stay.",
  },

  // ── Logistics, Transfers & Self-Drive ─────────────────────────────
  {
    id: "border-crossing-vic-falls-chobe",
    category: "logistics",
    question: "How do transfers work between Victoria Falls and Chobe?",
    answer:
      "Victoria Falls and Chobe National Park (Kasane) are just 80 kilometers apart—approximately a 1-hour scenic drive. When you book a combo itinerary with Kaizen, our team provides seamless door-to-door transfer in comfortable air-conditioned safari vehicles, guiding you through the Kazungula border crossing with complete assistance.",
  },
  {
    id: "cross-border-self-drive",
    category: "logistics",
    question: "Can I drive a rental 4x4 across international borders?",
    answer:
      "Yes. Our 4x4 rental vehicles (including the Toyota Land Cruiser and Hilux Double Cab) are fully licensed for cross-border travel between Zimbabwe, Botswana, and Namibia. We provide the mandatory cross-border letter of authority, police clearance papers, and cross-border road insurance.",
  },
  {
    id: "booking-process-payment",
    category: "logistics",
    question: "How does booking and payment work on Kaizen?",
    answer:
      "You can assemble your dream itinerary or select a curated package on our website to see an instant estimate in USD, EUR, GBP, or ZAR. Once you submit your request, our safari team verifies lodge availability and sends you a formal itinerary with secure payment options (direct wire or online card payment). Your bookings are locked in with personal coordination from arrival to departure.",
  },
];

