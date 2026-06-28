import { forwardRef } from "react";
import type { ButtonProps } from "./Button.types";
import { Spinner } from "../Spinner/Spinner";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      pill = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-body font-semibold tracking-widest uppercase transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] active:duration-75 disabled:pointer-events-none disabled:opacity-disabled select-none";

    const variantClasses = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-button",
      secondary: "bg-secondary text-white hover:bg-secondary-hover shadow-button",
      outline: "border border-solid border-current text-text-primary hover:bg-surface-hover/10 hover:border-solid hover:border-current",
      ghost: "text-text-primary hover:bg-surface-hover/10",
      danger: "bg-danger text-white hover:bg-danger-hover shadow-button",
      success: "bg-success text-white hover:bg-success-hover shadow-button",
    };

    const sizeClasses = {
      sm: "px-6 py-2 text-[10px] leading-normal",
      md: "px-8 py-3.5 text-xs leading-normal",
      lg: "px-10 py-4 text-xs leading-normal",
      icon: "p-3 h-10 w-10 text-xs",
    };

    const widthClass = fullWidth ? "w-full" : "";
    const shapeClass = "rounded-[9999px]";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${shapeClass} ${className}`}
        {...props}
      >
        {isLoading && (
          <Spinner
            size="sm"
            className={`${size === "icon" ? "" : "mr-2"} text-current`}
          />
        )}
        {!isLoading && leftIcon && size !== "icon" && (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        )}
        {size === "icon" ? (!isLoading && children) : children}
        {!isLoading && rightIcon && size !== "icon" && (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
