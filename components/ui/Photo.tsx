import React from "react";
import Image from "next/image";
import { Photo as PhotoType } from "@/content/types";
import photoMeta from "@/content/generated/photo-meta.json";

const meta: Record<string, { width: number; height: number; blurDataURL: string }> =
  photoMeta as Record<string, { width: number; height: number; blurDataURL: string }>;

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
  const hasRadius = /rounded/.test(className);
  const containerClasses = `relative overflow-hidden ${hasRadius ? "" : "rounded-[14px] "}${className}`.trim();

  if (photo && photo.src) {
    const m = meta[photo.src];

    return (
      <div className={containerClasses}>
        <Image
          src={photo.src}
          alt={photo.alt || label}
          fill={!m}
          {...(m
            ? {
                width: m.width,
                height: m.height,
                placeholder: "blur" as const,
                blurDataURL: m.blurDataURL,
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover" as const,
                  position: "absolute" as const,
                  inset: 0,
                },
              }
            : {})}
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
