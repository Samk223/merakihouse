import { forwardRef } from "react";
import type { BadgeProps } from "./Badge.types";

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", pill = false, icon, className = "", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center font-body font-semibold text-overline tracking-wider rounded-xs px-2 py-0.5 select-none";

    const variantClasses = {
      primary: "bg-accent text-primary",
      secondary: "bg-secondary/10 text-secondary",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
      neutral: "bg-light text-text-secondary border border-border-main",
    };

    const shapeClass = pill ? "rounded-full px-2.5" : "";

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${shapeClass} ${className}`}
        {...props}
      >
        {icon && <span className="mr-1 inline-flex items-center">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
