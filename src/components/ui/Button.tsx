"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-400/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-xs",
      secondary:
        "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-2xs",
      outline:
        "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100",
      ghost:
        "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200",
      danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs",
    };

    const sizeStyles = {
      xs: "text-xs px-2.5 py-1 gap-1.5",
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-3.5 py-2 gap-2",
      lg: "text-sm px-5 py-2.5 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
