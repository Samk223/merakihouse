import { forwardRef } from "react";
import type { SpinnerProps } from "./Spinner.types";

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = "md", className = "", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4 border-2",
      md: "w-6 h-6 border-2",
      lg: "w-8 h-8 border-[3px]",
    };

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        className={`inline-block rounded-full border-solid border-current border-t-transparent animate-spin ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";
