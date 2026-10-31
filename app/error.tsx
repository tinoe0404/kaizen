"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { site } from "@/content/site";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isWhatsAppValid = normalizeWhatsappNumber(site.whatsappNumber) !== null;

  return (
    <Section className="bg-bone py-20 md:py-32 flex-1 flex items-center justify-center">
      <Container className="text-center flex flex-col items-center max-w-xl">
        <span className="font-heading font-semibold text-sm tracking-[0.18em] text-sun uppercase mb-3">
          ERROR
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-ink">
          Something went wrong on our side.
        </h1>
        <p className="font-body text-ink/75 text-base sm:text-lg mt-4 mb-8 leading-relaxed">
          We are sorry for the disruption. You can try reloading this section, or
          contact our team directly if you need assistance with your trip.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Button
            type="button"
            variant="primary"
            onClick={() => reset()}
          >
            Try again
          </Button>
          <Button href="/" variant="outline">
            Back to home
          </Button>
        </div>

        <div className="pt-8 border-t border-sand w-full flex flex-col items-center">
          <p className="text-sm font-heading font-semibold text-ink/70 mb-3">
            Reach out to our team:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isWhatsAppValid && (
              <WhatsAppLink variant="outline">
                WhatsApp us
              </WhatsAppLink>
            )}
            <a
              href={`mailto:${site.bookingEmail}`}
              className="text-forest hover:underline text-sm font-heading font-semibold min-h-[44px] inline-flex items-center"
            >
              Email: {site.bookingEmail}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

