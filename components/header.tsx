"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/components/trip/TripProvider";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/activities", label: "Activities" },
  { href: "/lodges", label: "Lodges" },
  { href: "/vehicle-hire", label: "Vehicle hire" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { state, isReady } = useTrip();

  const tripCount = isReady ? state.ids.length : 0;
  const tripLabel = tripCount > 0 ? `Plan your trip (${tripCount})` : "Plan your trip";
  const tripAriaLabel =
    tripCount > 0 ? `Plan your trip, ${tripCount} items` : "Plan your trip";

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-sand sticky top-0 z-40">
      <Container className="flex items-center justify-between h-[88px]">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[8px]"
          aria-label="Kaizen Travel and Adventures home"
          onClick={handleClose}
        >
          <Image
            src="/logo.png"
            alt="Kaizen Travel and Adventures"
            width={116}
            height={72}
            priority
            className="h-[72px] w-auto object-contain"
            style={{ height: "72px", width: "auto" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-6 lg:gap-8"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading font-semibold text-ink hover:text-forest transition-colors min-h-[44px] inline-flex items-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[4px]"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/trip" variant="primary" aria-label={tripAriaLabel}>
            {tripLabel}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          type="button"
          className="md:hidden w-[48px] h-[48px] min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-[8px] border border-sand text-ink hover:bg-sand/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink cursor-pointer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </Container>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden w-full bg-white border-b border-sand shadow-none animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <Container className="py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className="font-heading font-semibold text-lg text-ink hover:text-forest transition-colors min-h-[44px] flex items-center border-b border-sand/40 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[4px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3">
              <Button
                href="/trip"
                variant="primary"
                className="w-full justify-center"
                aria-label={tripAriaLabel}
                onClick={handleClose}
              >
                {tripLabel}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

