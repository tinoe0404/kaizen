import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";
import { WhatsAppLink } from "@/components/WhatsAppLink";

const EXPLORE_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/activities", label: "Activities" },
  { href: "/lodges", label: "Lodges" },
  { href: "/vehicle-hire", label: "Vehicle hire" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bone border-t border-forest/30 mt-auto pb-[calc(var(--float-bottom,16px)+56px)]">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Business Info */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading font-bold text-xl text-bone">
              {site.name}
            </h2>
            <p className="text-bone/80 text-sm leading-relaxed max-w-sm">
              {site.tagline}
            </p>
          </div>

          {/* Explore Category Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-lg text-bone">
              Explore
            </h3>
            <ul className="flex flex-col space-y-1">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] text-bone/90 hover:text-sun transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun rounded-[4px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-lg text-bone">
              Company
            </h3>
            <ul className="flex flex-col space-y-1">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] text-bone/90 hover:text-sun transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun rounded-[4px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Block */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-lg text-bone">
              Contact
            </h3>
            <div className="flex flex-col space-y-2 text-sm">
              <WhatsAppLink className="min-h-[44px] flex flex-col justify-center hover:text-sun transition-colors">
                <span className="text-bone/60 text-sm uppercase tracking-wider font-heading">
                  WhatsApp
                </span>
                <span className="text-bone font-medium">
                  {site.whatsappNumber}
                </span>
              </WhatsAppLink>
              <div className="min-h-[44px] flex flex-col justify-center">
                <span className="text-bone/60 text-sm uppercase tracking-wider font-heading">
                  Booking email
                </span>
                <span className="text-bone font-medium">
                  {site.bookingEmail}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-bone/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-bone/60">
          <p>© 2026 {site.name}. [All rights reserved].</p>
          <Link
            href="/contact"
            className="inline-flex items-center min-h-[44px] text-bone/80 hover:text-sun transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </Container>
    </footer>
  );
}
