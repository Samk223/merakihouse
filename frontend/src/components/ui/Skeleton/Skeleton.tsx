import { forwardRef } from "react";
import type { SkeletonProps } from "./Skeleton.types";

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rectangle", animated = true, className = "", ...props }, ref) => {
    const baseClasses = "bg-border-main/50 select-none pointer-events-none";

    const variantClasses = {
      text: "h-3 w-full rounded-sm my-1.5",
      title: "h-6 w-3/4 rounded-sm my-3",
      avatar: "h-12 w-12 rounded-full",
      card: "h-48 w-full rounded-medium",
      rectangle: "h-12 w-full rounded-sm",
      circle: "h-12 w-12 rounded-full",
    };

    // Animation configuration with respect to prefers-reduced-motion
    const animationClass = animated ? "motion-safe:animate-pulse" : "";

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
