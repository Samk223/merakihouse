import type { ButtonHTMLAttributes } from "react";

export interface MobileMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  ariaLabel?: string;
}
