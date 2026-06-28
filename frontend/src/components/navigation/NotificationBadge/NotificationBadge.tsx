import { forwardRef } from "react";
import type { NotificationBadgeProps } from "./NotificationBadge.types";

export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  ({ count, maxCount = 99, className = "", ...props }, ref) => {
    if (count <= 0) return null;

    const displayCount = count > maxCount ? `${maxCount}+` : count;

    return (
      <span
        ref={ref}
        className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full bg-primary text-white font-body font-semibold text-[10px] leading-none shadow-button animate-scale select-none ${className}`}
        {...props}
      >
        {displayCount}
      </span>
    );
  }
);

NotificationBadge.displayName = "NotificationBadge";
