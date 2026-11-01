"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTrip } from "@/components/trip/TripProvider";

const NAV_LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/activities", label: "Activities" },
  { href: "/lodges", label: "Lodges" },
  { href: "/vehicle-hire", label: "Vehicle hire" },
];

const MOBILE_EXTRA_LINKS = [
  { href: "/faq", label: "FAQ & Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const wasOpenRef = useRef(false);
  const pathname = usePathname();
  const { state, isReady } = useTrip();

  const tripCount = isReady ? state.ids.length : 0;
  const tripLabel = tripCount > 0 ? `Plan your trip (${tripCount})` : "Plan your trip";
  const tripAriaLabel =
    tripCount > 0 ? `Plan your trip, ${tripCount} items` : "Plan your trip";

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Lock body scroll and handle focus when open/closed
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Move focus to first link
      const timer = setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    } else if (wasOpenRef.current) {
      menuButtonRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Trap focus and handle Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;

        const focusable = [
          menuButtonRef.current,
          ...Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          ),
        ].filter(Boolean) as HTMLElement[];

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const isHome = pathname === "/";

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-colors duration-300 ${
        isHome
          ? "bg-transparent border-b border-white/10"
          : "bg-white border-b border-sand"
      }`}
    >
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
            className={`h-[72px] w-auto object-contain transition-all duration-300 ${
              isHome ? "brightness-0 invert" : ""
            }`}
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
              className={`font-heading font-semibold transition-colors min-h-[44px] inline-flex items-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-[4px] ${
                isHome
                  ? "text-white/90 hover:text-white focus-visible:outline-white"
                  : "text-ink hover:text-forest focus-visible:outline-ink"
              }`}
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
          className={`md:hidden w-[48px] h-[48px] min-h-[48px] min-w-[48px] inline-flex items-center justify-center rounded-[8px] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer ${
            isHome
              ? "border-white/40 text-white hover:bg-white/15 focus-visible:outline-white"
              : "border-sand text-ink hover:bg-sand/40 focus-visible:outline-ink"
          }`}
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
          ref={panelRef}
          id="mobile-navigation"
          className="md:hidden w-full bg-white border-b border-sand shadow-none overflow-y-auto max-h-[calc(100dvh-88px)]"
        >
          <Container className="py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={link.href}
                ref={idx === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={handleClose}
                className="font-heading font-semibold text-lg text-ink hover:text-forest transition-colors min-h-[44px] flex items-center border-b border-sand/40 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[4px]"
              >
                {link.label}
              </Link>
            ))}
            {MOBILE_EXTRA_LINKS.map((link) => (
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

