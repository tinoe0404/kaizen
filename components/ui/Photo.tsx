import React from "react";
import Image from "next/image";
import { Photo as PhotoType } from "@/content/types";

export interface PhotoProps {
  photo?: PhotoType;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function Photo({
  photo,
  label,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: PhotoProps) {
  const containerClasses = `relative overflow-hidden rounded-[14px] ${className}`.trim();

  if (photo && photo.src) {
    return (
      <div className={containerClasses}>
        <Image
          src={photo.src}
          alt={photo.alt || label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  // Tonal forest-based placeholder block
  const displayLabel = label.toUpperCase().startsWith("PHOTO:")
    ? label.toUpperCase()
    : `PHOTO: ${label.toUpperCase()}`;

  return (
    <div
      className={`bg-forest text-bone flex items-center justify-center p-4 text-center select-none ${containerClasses}`}
      aria-label={`Placeholder image for ${label}`}
    >
      <span className="text-xs font-heading font-semibold uppercase tracking-wider text-bone/90">
        {displayLabel}
      </span>
    </div>
  );
}

