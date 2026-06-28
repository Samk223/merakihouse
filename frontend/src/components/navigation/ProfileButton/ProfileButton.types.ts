import type { ButtonHTMLAttributes } from "react";
import type { AvatarSize } from "../../ui/Avatar/Avatar.types";

export interface ProfileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  avatarSrc?: string;
  userName?: string;
  size?: AvatarSize;
}
