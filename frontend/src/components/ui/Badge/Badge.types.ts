import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pill?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}
