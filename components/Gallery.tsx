"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Photo as PhotoType } from "@/content/types";
import { Photo } from "@/components/ui/Photo";

export interface GalleryProps {
  photos: PhotoType[];
  label: string;
}

export function Gallery({ photos, label }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Case 0: No photos
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full">
        <Photo
          label={label}
          className="aspect-[4/3] w-full rounded-[14px] border border-sand"
        />
      </div>
    );
  }

  // Case 1: Exactly 1 photo
  if (photos.length === 1) {
    const singlePhoto = photos[0];
    return (
      <div className="w-full">
        <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden bg-sand/30 border border-sand">
          <Image
            src={singlePhoto.src}
            alt={singlePhoto.alt || label}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  // Case 2+: 2 or more photos with interactive controls
  const currentPhoto = photos[activeIndex] || photos[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div
      className="w-full flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[14px]"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Photo gallery for ${label}. Use left and right arrow keys to navigate.`}
    >
      {/* Visually hidden live region for screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Photo {activeIndex + 1} of {photos.length}
      </div>

      {/* Main Large Image (4:3) with Prev/Next buttons */}
      <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden bg-sand/30 border border-sand select-none">
        <Image
          src={currentPhoto.src}
          alt={currentPhoto.alt || `${label} - Photo ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority={activeIndex === 0}
          className="object-cover"
        />

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-ink/75 hover:bg-ink text-bone flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sun cursor-pointer z-10"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-ink/75 hover:bg-ink text-bone flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sun cursor-pointer z-10"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Thumbnails Row (scrolls horizontally on small screens) */}
      <div
        className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x"
        aria-label="Photo thumbnails"
      >
        {photos.map((photo, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${photo.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-[8px] overflow-hidden border-2 transition-colors min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                isActive
                  ? "border-forest ring-2 ring-forest/30"
                  : "border-sand hover:border-ink/40"
              }`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

