import { forwardRef } from "react";
import type { DividerProps } from "./Divider.types";

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", align = "center", inset = false, className = "", children, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";

    const baseClasses = isHorizontal
      ? "flex items-center w-full my-4"
      : "inline-flex h-4 self-center mx-3 border-l border-border-main";

    const insetClass = inset ? (isHorizontal ? "px-6" : "my-2") : "";

    if (!isHorizontal) {
      return (
        <span
          ref={ref as any}
          role="separator"
          aria-orientation="vertical"
          className={`${baseClasses} ${insetClass} ${className}`}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={`${baseClasses} ${insetClass} ${className}`}
        {...props}
      >
        {children ? (
          <>
            <span
              className={`flex-grow border-t border-border-main/50 ${
                align === "left" ? "max-w-[5%]" : ""
              }`}
            />
            <span className="px-3 font-body text-caption text-text-muted select-none">
              {children}
            </span>
            <span
              className={`flex-grow border-t border-border-main/50 ${
                align === "right" ? "max-w-[5%]" : ""
              }`}
            />
          </>
        ) : (
          <span className="w-full border-t border-border-main/50" />
        )}
      </div>
    );
  }
);

Divider.displayName = "Divider";
