import { forwardRef } from "react";
import type { WishlistButtonProps } from "./WishlistButton.types";
import { IconButton } from "../IconButton/IconButton";
import { Heart } from "lucide-react";

export const WishlistButton = forwardRef<HTMLButtonElement, WishlistButtonProps>(
  ({ count = 0, size = "md", className = "", ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        size={size}
        badgeCount={count}
        ariaLabel={`Open wishlist panel, current items: ${count}`}
        className={className}
        icon={
          <Heart
            className="w-5 h-5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        }
        {...props}
      />
    );
  }
);

WishlistButton.displayName = "WishlistButton";
