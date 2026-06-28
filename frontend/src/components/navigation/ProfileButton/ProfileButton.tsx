import { forwardRef } from "react";
import type { ProfileButtonProps } from "./ProfileButton.types";

export const ProfileButton = forwardRef<HTMLButtonElement, ProfileButtonProps>(
  ({ avatarSrc, userName, size = "md", className = "", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-11 h-11",
      lg: "w-14 h-14",
      xl: "w-24 h-24",
    };

    const iconSizeClasses = {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-7 h-7",
      xl: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Open user account options"
        className={`relative inline-flex items-center justify-center rounded-full text-current hover:bg-surface-hover/10 active:scale-95 active:duration-75 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={userName || "Profile"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className={`${iconSizeClasses[size]} text-current flex items-center justify-center`}>
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              {/* Outer Circle Arc */}
              <path d="M 42.4 84.7 A 38 38 0 1 1 57.6 84.7" />
              
              {/* Left Shoulder */}
              <path d="M 42.4 84.7 C 42.4 78 43.5 74 43.5 70" />
              
              {/* Right Shoulder */}
              <path d="M 57.6 84.7 C 57.6 78 56.5 74 56.5 70" />
              
              {/* Head Left */}
              <path d="M 43.5 70 C 27 65 27 43 39 38" />
              
              {/* Head Right */}
              <path d="M 56.5 70 C 73 65 73 43 61 38" />
              
              {/* Head Bottom */}
              <path d="M 43.5 70 C 47 73 53 73 56.5 70" />

              {/* Left Ear */}
              <path d="M 39 38 C 39 29 39 24 42.5 24 C 46 24 46 29 46 38" />
              
              {/* Right Ear */}
              <path d="M 54 38 C 54 29 54 24 57.5 24 C 61 24 61 29 61 38" />
              
              {/* Head Top Connector */}
              <path d="M 46 38 L 54 38" />
            </svg>
          </div>
        )}
      </button>
    );
  }
);

ProfileButton.displayName = "ProfileButton";
