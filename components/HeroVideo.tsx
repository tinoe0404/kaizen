"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * A single hero slide: each has a video (mp4 + webm), poster, headline,
 * subtitle, and an optional label badge (e.g. "Explore").
 */
interface HeroSlide {
  mp4: string;
  webm: string;
  poster: string;
  headline: string;
  subtitle: string;
  label?: string;
}

const SLIDES: HeroSlide[] = [
  {
    mp4: "/videos/safari-hero.mp4",
    webm: "/videos/safari-hero.webm",
    poster: "/videos/safari-hero-poster.jpg",
    headline: "Discover Southern\nAfrica's Wild Heart",
    subtitle:
      "Bespoke safari expeditions across Victoria Falls, Chobe and Namibia.",
    label: "Explore",
  },
  {
    mp4: "/videos/victoria-falls.mp4",
    webm: "/videos/victoria-falls.webm",
    poster: "/videos/victoria-falls-poster.jpg",
    headline: "The Smoke\nThat Thunders",
    subtitle:
      "Stand at the edge of Victoria Falls — one of the Seven Natural Wonders of the World.",
    label: "Victoria Falls",
  },
];

const SLIDE_DURATION_MS = 8000;

export function HeroVideo() {
  const [active, setActive] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slideCount = SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      setActive((index + slideCount) % slideCount);
    },
    [slideCount]
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setTimeout(next, SLIDE_DURATION_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, next]);

  // Play the active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        vid.currentTime = 0;
        vid.play().catch(() => {
          /* autoplay may be blocked; poster is shown */
        });
      } else {
        vid.pause();
      }
    });
  }, [active]);

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[520px] max-h-[1200px] overflow-hidden"
      aria-label="Hero slideshow"
    >
      {/* ── Video layers ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.mp4}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className="absolute inset-0 w-full h-full object-cover"
            poster={slide.poster}
            autoPlay={i === 0}
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "none"}
            onLoadedData={() => {
              if (i === 0) setIsLoaded(true);
            }}
          >
            <source src={slide.webm} type="video/webm" />
            <source src={slide.mp4} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* ── Gradient overlay for text legibility ── */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 pointer-events-none"
        aria-hidden="true"
      />
      {/* Secondary left-side gradient for headline area */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Content overlay ── */}
      <div
        className={`relative z-10 flex flex-col justify-end h-full px-5 sm:px-8 md:px-12 lg:px-20 pb-20 sm:pb-24 md:pb-28 lg:pb-32 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Label badge */}
        {SLIDES[active].label && (
          <span className="font-heading font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase text-bone/90 mb-3 sm:mb-4 select-none">
            — {SLIDES[active].label}
          </span>
        )}

        {/* Headline */}
        <h1
          className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] tracking-tight max-w-3xl whitespace-pre-line"
          key={`headline-${active}`}
        >
          {SLIDES[active].headline}
        </h1>

        {/* Subtitle */}
        <p className="font-body text-base sm:text-lg md:text-xl text-white/85 max-w-xl mt-4 sm:mt-5 leading-relaxed">
          {SLIDES[active].subtitle}
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4 mt-6 sm:mt-8">
          <a
            href="/trip"
            className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-full bg-sun text-ink font-heading font-semibold text-base sm:text-lg hover:bg-[#cf7d18] active:bg-[#bd7114] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun select-none"
          >
            Plan a Trip
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#how"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full border-2 border-white/60 text-white font-heading font-semibold text-base sm:text-lg hover:bg-white/15 active:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white select-none"
          >
            How it works
          </a>
        </div>
      </div>

      {/* ── Slide navigation arrows + dots (bottom-left) ── */}
      <div className="absolute z-20 bottom-6 sm:bottom-8 left-5 sm:left-8 md:left-12 lg:left-20 flex items-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:bg-white/15 active:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:bg-white/15 active:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dot indicators — inner dot is decorative, outer button is ≥44px tap target */}
        <div className="flex items-center gap-0 ml-1" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white bg-transparent"
            >
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-8 h-2.5 bg-sun"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Decorative script tagline (bottom-right, like the reference) ── */}
      <div
        className="absolute z-20 bottom-6 sm:bottom-8 right-5 sm:right-8 md:right-12 lg:right-20 hidden sm:block"
        aria-hidden="true"
      >
        <p className="font-body italic text-white/70 text-sm sm:text-base leading-snug text-right select-none">
          Wild Places,
          <br />
          Warmer Hearts
        </p>
      </div>

      {/* ── Scroll-down indicator ── */}
      <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/60">
        <span className="text-xs font-heading tracking-wider uppercase select-none">
          Scroll
        </span>
        <svg
          className="w-4 h-4 animate-bounce"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </section>
  );
}

