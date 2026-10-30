"use client";

import React from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { ButtonVariant } from "@/components/ui/button";

let hasWarnedDevelopment = false;

const baseButtonStyles =
  "inline-flex items-center justify-center font-heading font-semibold text-base min-h-[44px] px-5 py-2.5 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink select-none cursor-pointer text-center";

const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: "bg-sun text-ink hover:bg-[#cf7d18] active:bg-[#bd7114]",
  solid: "bg-forest text-bone hover:bg-[#163920] active:bg-[#102b18]",
  outline:
    "bg-transparent border-2 border-forest text-forest hover:bg-forest hover:text-bone active:bg-[#163920]",
  "outline-bone":
    "bg-transparent border-2 border-bone text-bone hover:bg-bone hover:text-ink active:bg-bone/90 focus-visible:outline-bone",
};

export interface WhatsAppLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  message?: string;
  variant?: ButtonVariant;
}

export function WhatsAppLink({
  message,
  variant,
  className = "",
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: WhatsAppLinkProps) {
  const href = whatsappLink(message);

  React.useEffect(() => {
    if (!href && process.env.NODE_ENV === "development" && !hasWarnedDevelopment) {
      hasWarnedDevelopment = true;
      console.warn(
        "[WhatsAppLink] WhatsApp number in /content/site.ts is invalid or a placeholder. Link will not be rendered."
      );
    }
  }, [href]);

  if (!href) {
    return null;
  }

  const combinedClasses = variant
    ? `${baseButtonStyles} ${buttonVariantStyles[variant]} ${className}`.trim()
    : className;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={combinedClasses}
      {...props}
    >
      {children}
    </a>
  );
}
