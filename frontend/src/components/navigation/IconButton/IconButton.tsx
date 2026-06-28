import { forwardRef } from "react";
import type { IconButtonProps } from "./IconButton.types";
import { NotificationBadge } from "../NotificationBadge/NotificationBadge";
import { Spinner } from "../../ui/Spinner/Spinner";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = "md", ariaLabel, badgeCount = 0, isLoading = false, disabled, className = "", ...props }, ref) => {
    const baseClasses =
      "relative inline-flex items-center justify-center rounded-full text-text-primary bg-transparent hover:bg-surface-hover active:scale-95 active:bg-surface-hover/80 transition-fast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-disabled select-none";

    const sizeClasses = {
      sm: "w-8 h-8 p-1.5",
      md: "w-11 h-11 p-2.5",
      lg: "w-14 h-14 p-3.5",
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        className={`${baseClasses} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="text-current" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-current">
            {icon}
          </span>
        )}

        {!isLoading && badgeCount > 0 && (
          <NotificationBadge count={badgeCount} />
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
