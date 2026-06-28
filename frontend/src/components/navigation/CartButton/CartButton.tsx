import { forwardRef } from "react";
import type { CartButtonProps } from "./CartButton.types";
import { IconButton } from "../IconButton/IconButton";
import { ShoppingBag } from "lucide-react";

export const CartButton = forwardRef<HTMLButtonElement, CartButtonProps>(
  ({ count = 0, size = "md", className = "", ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        size={size}
        badgeCount={count}
        ariaLabel={`Open cart drawer, current items: ${count}`}
        className={className}
        icon={
          <ShoppingBag
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

CartButton.displayName = "CartButton";
