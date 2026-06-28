import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavigationLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  to: string;
  active?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  badge?: ReactNode;
  hasDropdown?: boolean;
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
}
