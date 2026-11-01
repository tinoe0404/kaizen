import type { Metadata } from "next";
import { faqs } from "@/content/faq";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safari Travel Guide & FAQ",
  description:
    "Essential travel guide and frequently asked questions for Victoria Falls, Chobe (Botswana), and Namibia. Learn about visas, seasons, currency, malaria advice, and border crossings.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="w-full flex flex-col">
      <JsonLd data={faqSchema} />

      {/* Top Banner */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <span className="font-heading font-semibold text-xs uppercase tracking-wider text-sun mb-2 block">
            Traveler Guidance
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            Safari Travel Guide & Frequently Asked Questions
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[700px] leading-relaxed">
            Everything you need to know before packing your bags for Southern
            Africa: from KAZA Univisas and water level seasons to currency
            practicalities and border crossings.
          </p>
        </Container>
      </Section>

      {/* Main Accordion Section */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <FaqAccordion items={faqs} />
        </Container>
      </Section>

      {/* Direct Contact CTA Band */}
      <Section className="bg-ink text-bone py-14 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-bone mb-3">
            Have a question about your specific route?
          </h2>
          <p className="font-body text-bone/85 text-base max-w-xl mx-auto mb-8">
            Our safari team lives and breathes Southern Africa. Message us on
            WhatsApp for real-time guidance on weather, availability, and
            custom itineraries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <WhatsAppLink variant="primary">Message us on WhatsApp</WhatsAppLink>
            <Button
              href="/trip"
              variant="outline"
              className="text-bone border-bone/40 hover:bg-bone/10"
            >
              Build your trip
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}

