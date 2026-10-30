import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  sand?: boolean;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Section({
  sand = false,
  children,
  className = "",
  as: Component = "section",
  ...props
}: SectionProps) {
  const bgClass = sand ? "bg-sand" : "";
  return (
    <Component
      className={`py-12 md:py-16 ${bgClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

