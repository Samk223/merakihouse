import { forwardRef, useState } from "react";
import type { AvatarProps } from "./Avatar.types";

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", name, size = "md", status, className = "", ...props }, ref) => {
    const [hasError, setHasError] = useState(false);

    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-12 h-12 text-sm",
      lg: "w-16 h-16 text-base",
      xl: "w-24 h-24 text-xl",
    };

    const statusBadgeSizes = {
      sm: "w-2.5 h-2.5 border",
      md: "w-3 h-3 border-2",
      lg: "w-4 h-4 border-2",
      xl: "w-5 h-5 border-2",
    };

    const statusColors = {
      online: "bg-success",
      offline: "bg-text-muted",
      busy: "bg-danger",
      away: "bg-warning",
    };

    // Calculate fallback initials
    const getInitials = (fullName?: string) => {
      if (!fullName) return "";
      const parts = fullName.trim().split(" ");
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(name);

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center rounded-full font-body font-semibold select-none ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || name || "User avatar"}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full rounded-full bg-accent text-primary border border-primary/20">
            {initials || (
              <svg
                className="w-1/2 h-1/2 text-primary/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
        )}

        {status && (
          <span
            role="presentation"
            className={`absolute bottom-0 right-0 rounded-full border-white ${statusColors[status]} ${statusBadgeSizes[size]}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
