import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "solid" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "solid",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-heading font-semibold text-base min-h-[44px] px-5 py-2.5 rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink select-none cursor-pointer text-center";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-sun text-ink hover:bg-[#cf7d18] active:bg-[#bd7114]",
    solid: "bg-forest text-bone hover:bg-[#163920] active:bg-[#102b18]",
    outline:
      "bg-transparent border-2 border-forest text-forest hover:bg-forest hover:text-bone active:bg-[#163920]",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

