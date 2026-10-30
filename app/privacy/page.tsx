import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy | Kaizen Travel and Adventures",
  description:
    "Read our privacy notice. Learn what information we collect when you use this website, why we collect it, and how your data is handled.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Top Header Section */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            {privacy.title}
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[70ch] leading-relaxed">
            {privacy.intro}
          </p>
          <p className="text-sm font-heading font-semibold text-ink/50 uppercase tracking-wider mt-4">
            Last updated: {privacy.lastUpdated}
          </p>
        </Container>
      </Section>

      {/* Structured Sections */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="space-y-12 max-w-[70ch]">
            {privacy.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="font-body text-base sm:text-lg text-ink/80 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}

