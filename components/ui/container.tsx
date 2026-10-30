import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`max-w-[1200px] mx-auto px-6 w-full box-border ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

