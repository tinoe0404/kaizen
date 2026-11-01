export type Category = "destination" | "activity" | "lodge" | "vehicle";

export type PricingUnit =
  | "per_person"
  | "per_group"
  | "per_person_per_night"
  | "per_group_per_night"
  | "per_group_per_day";

export interface Pricing {
  unit: PricingUnit;
  amountUsd: number;
}

export interface Photo {
  src: string;
  alt: string;
}

export interface Offering {
  id: string; // unique across the whole site, e.g. "lodge-a"
  slug: string; // unique within its category
  category: Category;
  name: string;
  summary: string; // one line, used on cards
  description: string; // used on the detail page
  pricing: Pricing;
  photos: Photo[]; // may be empty for now
  destinationSlug?: string; // optional link to a destination
  capacity?: number; // optional, e.g. seats in a vehicle
  featured?: boolean;
}

export interface SafariPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  destination: string;
  description: string;
  highlights: string[];
  badge?: string;
  itemIds: string[];
  photo: Photo;
  featured?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSocial {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  whatsappNumber: string;
  bookingEmail: string;
  address: string;
  hours: string;
  social: SiteSocial;
  socialLinks?: SocialLink[];
  privacyNotice?: string;
  contactHeading?: string;
  contactIntro?: string;
  heroPhoto?: Photo;
}

export interface AboutSection {
  title: string;
  paragraphs: string[];
}

export interface AboutValue {
  title: string;
  text: string;
}

export interface AboutContent {
  heading: string;
  intro: string;
  sections: AboutSection[];
  values?: AboutValue[];
  photos?: Photo[];
}

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}

export interface PrivacyContent {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: PrivacySection[];
}

