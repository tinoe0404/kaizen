"use client";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const HERO = {
  mp4: "/videos/victoria-falls.mp4",
  webm: "/videos/victoria-falls.webm",
  poster: "/videos/victoria-falls-poster.jpg",
  headline: "Discover Southern Africa\nWith Kaizen",
  subtitle:
    "Your trusted local tour operator for bespoke safaris, activities, and lodge bookings across Victoria Falls, Chobe, and Namibia.",
  label: "Kaizen Travel & Adventures",
};

export function HeroVideo() {
  // Preload the hero poster image with high priority so it renders before the video loads
  ReactDOM.preload(HERO.poster, { as: "image", fetchPriority: "high" });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = true;
    vid.play().catch(() => {
      /* browser autoplay policy fallback: poster background remains visible */
    });
  }, []);

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[520px] max-h-[1200px] overflow-hidden bg-cover bg-center bg-no-repeat"
      aria-label="Hero showcase"
      style={{
        backgroundColor: "#1a3a2a",
        backgroundImage: `url(${HERO.poster})`,
      }}
    >
      {/* ── Video layer ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          poster={HERO.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
        >
          <source src={HERO.webm} type="video/webm" />
          <source src={HERO.mp4} type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient overlay for text legibility ── */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 pointer-events-none"
        aria-hidden="true"
      />
      {/* Top scrim gradient for header & logo legibility over bright video frames */}
      <div
        className="absolute inset-x-0 top-0 h-28 sm:h-44 bg-gradient-to-b from-black/70 via-black/35 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Secondary left-side gradient for headline area */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Content overlay ── */}
      <div className="relative z-10 flex flex-col justify-end h-full px-4 sm:px-8 md:px-12 lg:px-20 pb-[calc(var(--float-bottom,16px)+3.75rem)] sm:pb-24 md:pb-28 lg:pb-32">
        {/* Label badge */}
        {HERO.label && (
          <span className="font-heading font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase text-bone/90 mb-1.5 sm:mb-4 select-none">
            — {HERO.label}
          </span>
        )}

        {/* Headline */}
        <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.12] sm:leading-[1.08] tracking-tight max-w-3xl whitespace-pre-line">
          {HERO.headline}
        </h1>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-lg md:text-xl text-white/90 max-w-xl mt-2.5 sm:mt-5 leading-relaxed">
          {HERO.subtitle}
        </p>

        {/* CTA */}
        <div className="flex flex-row items-center gap-2.5 sm:gap-4 mt-5 sm:mt-8">
          <a
            href="/trip"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-[48px] px-4 sm:px-7 py-2.5 sm:py-3 rounded-full bg-sun text-ink font-heading font-semibold text-sm sm:text-lg hover:bg-[#cf7d18] active:bg-[#bd7114] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun select-none text-center whitespace-nowrap"
          >
            Plan a Trip
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full border-2 border-white/60 text-white font-heading font-semibold text-sm sm:text-lg hover:bg-white/15 active:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white select-none text-center whitespace-nowrap"
          >
            How it works
          </a>
        </div>
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
