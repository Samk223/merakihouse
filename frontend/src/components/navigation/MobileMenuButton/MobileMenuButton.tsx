import { forwardRef } from "react";
import type { MobileMenuButtonProps } from "./MobileMenuButton.types";

export const MobileMenuButton = forwardRef<HTMLButtonElement, MobileMenuButtonProps>(
  ({ isOpen, ariaLabel = "Toggle menu", className = "", ...props }, ref) => {
    const baseClasses =
      "relative inline-flex items-center justify-center w-11 h-11 rounded-full text-text-primary hover:bg-surface-hover transition-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none";

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {/* Animated hamburger/close icon */}
        <div className="flex flex-col items-center justify-center w-5 h-5 gap-1.5">
          <span
            className={`w-5 h-[2px] bg-current rounded-full transition-transform duration-normal ease-emphasized ${
              isOpen ? "transform translate-y-[8px] rotate-45" : ""
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-current rounded-full transition-opacity duration-fast ease-emphasized ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-current rounded-full transition-transform duration-normal ease-emphasized ${
              isOpen ? "transform -translate-y-[8px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>
    );
  }
);

MobileMenuButton.displayName = "MobileMenuButton";
