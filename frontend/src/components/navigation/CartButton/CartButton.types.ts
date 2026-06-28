import type { ButtonHTMLAttributes } from "react";
import type { IconButtonSize } from "../IconButton/IconButton.types";

export interface CartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  size?: IconButtonSize;
}
