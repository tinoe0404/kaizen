import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/ui/Photo";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Kaizen Travel and Adventures, our approach to safari planning, and our commitment to Southern African journeys.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const hasValues = Boolean(about.values && about.values.length > 0);
  const hasPhotos = Boolean(about.photos && about.photos.length > 0);

  return (
    <div className="w-full flex flex-col">
      {/* Top Header Section */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            {about.heading}
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[70ch] leading-relaxed">
            {about.intro}
          </p>
        </Container>
      </Section>

      {/* Main Narrative Sections */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="space-y-12 max-w-[70ch]">
            {about.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="font-body text-base sm:text-lg text-ink/80 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Optional Values 3-Column Grid */}
          {hasValues && (
            <div className="mt-16 pt-12 border-t border-sand">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-8">
                What guides us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {about.values?.map((val, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-start"
                  >
                    <h3 className="font-heading font-semibold text-xl text-ink mb-3">
                      {val.title}
                    </h3>
                    <p className="font-body text-sm sm:text-base text-ink/75 leading-relaxed">
                      {val.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Photo Row */}
          {hasPhotos && (
            <div className="mt-16 pt-12 border-t border-sand">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {about.photos?.map((photo, idx) => (
                  <Photo
                    key={idx}
                    photo={photo}
                    label={photo.alt}
                    className="aspect-[4/3] w-full rounded-[14px]"
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Bottom CTA Band */}
      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-6">
            Ready to put it together?
          </h2>
          <Button href="/trip" variant="primary">
            Build your trip
          </Button>
        </Container>
      </Section>
    </div>
  );
}

