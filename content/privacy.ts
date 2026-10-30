// DRAFT. Must be reviewed by the client, and by a lawyer if required, before launch.

import { site } from "./site";
import type { PrivacyContent } from "./types";

export const privacyLastUpdated = "2026-10-30";

export const privacy: PrivacyContent = {
  title: "Privacy notice",
  intro:
    "We respect your privacy and handle your personal details transparently. This notice explains what information we collect when you use this website, why we collect it, and how it is managed.",
  lastUpdated: privacyLastUpdated,
  sections: [
    {
      title: "What we collect",
      paragraphs: [
        "When you build a trip and submit a booking request, we collect the details you enter: your name, email address, optional phone or WhatsApp number, and any notes or preferences you include.",
        "We also collect the trip details you assembled: the destinations, activities, lodges, and vehicles you selected, your arrival and departure dates, guest count, and chosen currency.",
      ],
    },
    {
      title: "Why we collect it",
      paragraphs: [
        "We use this information exclusively to check availability for your itinerary, reply to your request, and email you an estimate and confirmation.",
        "We do not use your information for marketing newsletters, promotional blasts, or unsolicited communications.",
      ],
    },
    {
      title: "Who handles your information",
      paragraphs: [
        `Your booking request is emailed directly to our team's operational mailbox (${site.bookingEmail}). It is transmitted through our email delivery provider ([EMAIL PROVIDER]).`,
        "We do not store your booking requests or personal details in a database or cloud customer management system on this website.",
      ],
    },
    {
      title: "What stays on your device",
      paragraphs: [
        "Your trip items, dates, guest count, and selected currency are saved only in your web browser's local storage. This allows your trip selection to persist when you refresh or revisit the page.",
        "No cookies, no analytics, and no advertising trackers are used on this website.",
      ],
    },
    {
      title: "How long we keep your information",
      paragraphs: [
        "We retain the booking request emails in our operational mailbox for [RETENTION PERIOD], after which they are archived or deleted in accordance with our data retention schedule.",
      ],
    },
    {
      title: "Your rights and requests",
      paragraphs: [
        `You may contact us at any time to ask what details we hold regarding your request, or to ask us to correct or delete them. Send your request to ${site.bookingEmail}.`,
      ],
    },
  ],
};
