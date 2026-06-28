import type { HTMLAttributes, ReactNode } from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "left" | "center" | "right";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  align?: DividerAlign;
  inset?: boolean;
  children?: ReactNode;
}
