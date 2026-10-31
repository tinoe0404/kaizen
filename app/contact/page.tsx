import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";
import { safeStr, stripUndefined } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kaizen Travel and Adventures. Contact us via WhatsApp, email, or visit our office.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const isWhatsAppValid = normalizeWhatsappNumber(site.whatsappNumber) !== null;
  const hasSocialLinks = Boolean(site.socialLinks && site.socialLinks.length > 0);

  const agencyData = stripUndefined({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: safeStr(site.name),
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    email: safeStr(site.bookingEmail),
    address: safeStr(site.address),
  });

  const hasAgencyData = Boolean(agencyData.name);

  return (
    <div className="w-full flex flex-col">
      {hasAgencyData && <JsonLd data={agencyData as Record<string, unknown>} />}
      {/* Top Header Section */}
      <Section sand className="py-12 md:py-16 border-b border-forest/10">
        <Container>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
            {site.contactHeading || "Contact us"}
          </h1>
          <p className="font-body text-ink/80 text-base sm:text-lg mt-3 max-w-[640px] leading-relaxed">
            {site.contactIntro ||
              "The quickest way to plan a trip is to build it on the site and send a request. You can also reach us directly."}
          </p>
        </Container>
      </Section>

      {/* Contact Cards Grid */}
      <Section className="bg-bone py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
            {/* WhatsApp Card (hidden if number is invalid) */}
            {isWhatsAppValid && (
              <div className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-xl text-ink mb-2">
                    WhatsApp
                  </h2>
                  <p className="font-body text-sm text-ink/70 mb-4">
                    Message our team directly for availability, quick questions,
                    or trip advice.
                  </p>
                  <p className="font-heading font-semibold text-base text-ink">
                    {site.whatsappNumber}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-sand">
                  <WhatsAppLink
                    variant="solid"
                    message="Hello Kaizen Travel and Adventures, I would like to plan a trip."
                    className="w-full sm:w-auto"
                  >
                    Chat on WhatsApp
                  </WhatsAppLink>
                </div>
              </div>
            )}

            {/* Email Card */}
            <div className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-heading font-semibold text-xl text-ink mb-2">
                  Email
                </h2>
                <p className="font-body text-sm text-ink/70 mb-4">
                  Send your inquiries, flight schedules, or custom group details.
                </p>
                <a
                  href={`mailto:${site.bookingEmail}`}
                  className="font-heading font-semibold text-base text-forest hover:underline break-all inline-flex items-center min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest rounded-[4px]"
                >
                  {site.bookingEmail}
                </a>
              </div>
              <div className="mt-6 pt-4 border-t border-sand text-sm text-ink/60">
                Direct booking and operational inbox
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-heading font-semibold text-xl text-ink mb-2">
                  Address
                </h2>
                <p className="font-body text-sm text-ink/70 mb-4">
                  Our operational base and office location.
                </p>
                <p className="font-body text-base text-ink font-medium leading-relaxed">
                  {site.address}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand text-sm text-ink/60">
                Visits by appointment
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <h2 className="font-heading font-semibold text-xl text-ink mb-2">
                  Opening hours
                </h2>
                <p className="font-body text-sm text-ink/70 mb-4">
                  Standard operating hours for bookings and inquiries.
                </p>
                <p className="font-body text-base text-ink font-medium leading-relaxed">
                  {site.hours}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-sand text-sm text-ink/60">
                Operating in Central Africa Time (CAT)
              </div>
            </div>

            {/* Optional Social Links Card (rendered only if socialLinks has items) */}
            {hasSocialLinks && (
              <div className="bg-white border border-sand rounded-[14px] p-6 sm:p-8 flex flex-col justify-between md:col-span-2">
                <div>
                  <h2 className="font-heading font-semibold text-xl text-ink mb-2">
                    Social links
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {site.socialLinks?.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-[8px] border border-sand text-sm font-heading font-semibold text-ink hover:text-forest hover:border-forest/40 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Bottom CTA Band */}
      <Section sand className="border-t border-forest/10 py-12 md:py-16 text-center">
        <Container>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-ink mb-4">
            Ready to plan your trip?
          </h2>
          <p className="font-body text-ink/75 text-base sm:text-lg max-w-lg mx-auto mb-6">
            Pick your destinations, activities, lodges, and vehicles to get an
            estimated total and send one request.
          </p>
          <Button href="/trip" variant="primary">
            Build your trip
          </Button>
        </Container>
      </Section>
    </div>
  );
}
