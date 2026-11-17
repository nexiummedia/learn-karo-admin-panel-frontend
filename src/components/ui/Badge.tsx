import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "danger" | "warning" | "info" | "purple";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    danger: "bg-rose-50 text-rose-700 border-rose-200/60",
    warning: "bg-amber-50 text-amber-700 border-amber-200/60",
    info: "bg-sky-50 text-sky-700 border-sky-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    success: "bg-emerald-500",
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />}
      {children}
    </span>
  );
};
