import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  ariaLabel: string;
  badgeCount?: number;
  isLoading?: boolean;
}
