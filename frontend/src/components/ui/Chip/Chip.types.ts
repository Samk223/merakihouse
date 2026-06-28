import type { HTMLAttributes, ReactNode } from "react";

export interface ChipProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> {
  active?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}
