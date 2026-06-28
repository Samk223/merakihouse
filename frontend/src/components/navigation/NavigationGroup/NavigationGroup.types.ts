import type { HTMLAttributes, ReactNode } from "react";

export type NavigationGroupAlign = "left" | "center" | "right";
export type NavigationGroupGap = "sm" | "md" | "lg" | "xl";

export interface NavigationGroupProps extends HTMLAttributes<HTMLDivElement> {
  align?: NavigationGroupAlign;
  gap?: NavigationGroupGap;
  children: ReactNode;
}
