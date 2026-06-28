import type { HTMLAttributes } from "react";

export type LogoSize = "sm" | "md" | "lg" | "xl";

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: LogoSize;
  logoSrc?: string;
  altText?: string;
  animate?: boolean;
}
