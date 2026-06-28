import type { HTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}
