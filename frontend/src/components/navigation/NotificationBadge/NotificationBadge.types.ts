import type { HTMLAttributes } from "react";

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number;
  maxCount?: number;
  className?: string;
}
