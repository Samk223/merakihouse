import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import type { NavigationLinkProps } from "./NavigationLink.types";

export const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ to, active = false, leftIcon, rightIcon, badge, hasDropdown = false, className = "", children, ...props }, ref) => {
    const baseClasses =
      "relative inline-flex items-center font-body text-body-sm !font-bold tracking-wider !text-current hover:!text-current uppercase select-none cursor-pointer py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300";

    const linkClasses = ({ isActive }: { isActive: boolean }) => {
      const activeState = isActive || active ? "opacity-100" : "opacity-90 hover:opacity-100";
      return `${baseClasses} ${activeState} group`;
    };

    return (
      <NavLink
        ref={ref}
        to={to}
        className={(navState) => {
          const classesStr = typeof className === "function" ? className(navState) : className;
          return `${linkClasses(navState)} ${classesStr}`;
        }}
        {...props}
      >
        {leftIcon && <span className="mr-1.5 inline-flex items-center">{leftIcon}</span>}
        
        <span className="relative">
          {children}
          {/* Subtle underline hover effect */}
          <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-normal ease-emphasized origin-left" />
        </span>

        {rightIcon && <span className="ml-1.5 inline-flex items-center">{rightIcon}</span>}
        
        {badge && <span className="ml-2 inline-flex items-center">{badge}</span>}

        {hasDropdown && (
          <span className="ml-1 inline-flex items-center opacity-70 group-hover:opacity-100 text-current transition-all duration-300">
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform duration-fast"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        )}
      </NavLink>
    );
  }
);

NavigationLink.displayName = "NavigationLink";
