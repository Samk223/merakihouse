import type { HTMLAttributes } from "react";

export type SkeletonVariant = "text" | "title" | "avatar" | "card" | "rectangle" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animated?: boolean;
}
