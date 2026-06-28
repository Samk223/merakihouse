import type { HTMLAttributes } from "react";
import type { IconButtonSize } from "../IconButton/IconButton.types";

export interface SearchButtonProps extends HTMLAttributes<HTMLDivElement> {
  size?: IconButtonSize;
}
