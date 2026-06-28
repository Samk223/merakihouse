import { forwardRef } from "react";
import type { MouseEvent } from "react";
import type { ChipProps } from "./Chip.types";

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      active = false,
      disabled = false,
      selectable = false,
      removable = false,
      onRemove,
      icon,
      className = "",
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-body text-body-sm px-3 py-1.5 rounded-full border border-border-main text-text-secondary bg-white hover:bg-surface-hover hover:border-border-hover transition-fast cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-disabled";

    const activeClasses = active
      ? "bg-accent/40 border-primary text-primary hover:bg-accent/50 hover:border-primary-hover"
      : "";

    const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onRemove) {
        onRemove();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={selectable ? onClick : undefined}
        className={`${baseClasses} ${activeClasses} ${selectable ? "" : "cursor-default pointer-events-none"} ${className}`}
        {...props}
      >
        {icon && <span className="mr-1.5 inline-flex items-center">{icon}</span>}
        <span className="leading-none">{children}</span>
        {removable && (
          <button
            type="button"
            aria-label="Remove filter"
            onClick={handleRemoveClick}
            disabled={disabled}
            className="ml-1.5 p-0.5 rounded-full hover:bg-border-color text-text-muted hover:text-text-primary transition-fast cursor-pointer"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </button>
    );
  }
);

Chip.displayName = "Chip";
