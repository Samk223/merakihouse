import { forwardRef } from "react";
import type { NavigationGroupProps } from "./NavigationGroup.types";

export const NavigationGroup = forwardRef<HTMLDivElement, NavigationGroupProps>(
  ({ align = "center", gap = "md", className = "", children, ...props }, ref) => {
    const alignClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    const gapClasses = {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    };

    return (
      <nav
        ref={ref}
        className={`flex items-center ${alignClasses[align]} ${gapClasses[gap]} ${className}`}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

NavigationGroup.displayName = "NavigationGroup";
