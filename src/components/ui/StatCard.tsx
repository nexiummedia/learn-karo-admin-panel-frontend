import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  sparklineVariant?: "green" | "red" | "blue" | "neutral";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle = "Last 30 days",
  trend,
  sparklineVariant = "green",
  className = "",
}) => {
  // Sparkline SVG paths and colors matching the screenshot
  const sparklineColors = {
    green: {
      stroke: "#22c55e",
      fill: "url(#greenGrad)",
      trendBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
    red: {
      stroke: "#ef4444",
      fill: "url(#redGrad)",
      trendBg: "bg-rose-50 text-rose-700 border-rose-200/60",
    },
    blue: {
      stroke: "#3b82f6",
      fill: "url(#blueGrad)",
      trendBg: "bg-sky-50 text-sky-700 border-sky-200/60",
    },
    neutral: {
      stroke: "#64748b",
      fill: "url(#neutralGrad)",
      trendBg: "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const currentTheme = sparklineColors[sparklineVariant];

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                trend.isPositive ? sparklineColors.green.trendBg : sparklineColors.red.trendBg
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>

        <div className="mt-2">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Sparkline curve */}
      <div className="mt-4 h-10 w-full overflow-hidden">
        <svg viewBox="0 0 160 40" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {sparklineVariant === "green" && (
            <>
              <path
                d="M 0 35 Q 30 32, 60 30 T 110 24 T 140 10 L 160 8 L 160 40 L 0 40 Z"
                fill={currentTheme.fill}
              />
              <path
                d="M 0 35 Q 30 32, 60 30 T 110 24 T 140 10 L 160 8"
                fill="none"
                stroke={currentTheme.stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {sparklineVariant === "red" && (
            <>
              <path
                d="M 0 10 Q 30 15, 60 22 T 110 28 T 140 32 L 160 35 L 160 40 L 0 40 Z"
                fill={currentTheme.fill}
              />
              <path
                d="M 0 10 Q 30 15, 60 22 T 110 28 T 140 32 L 160 35"
                fill="none"
                stroke={currentTheme.stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {sparklineVariant === "blue" && (
            <>
              <path
                d="M 0 26 Q 25 18, 55 24 T 100 16 T 135 22 L 160 14 L 160 40 L 0 40 Z"
                fill={currentTheme.fill}
              />
              <path
                d="M 0 26 Q 25 18, 55 24 T 100 16 T 135 22 L 160 14"
                fill="none"
                stroke={currentTheme.stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {sparklineVariant === "neutral" && (
            <>
              <path
                d="M 0 25 Q 40 28, 80 20 T 120 22 L 160 18 L 160 40 L 0 40 Z"
                fill={currentTheme.fill}
              />
              <path
                d="M 0 25 Q 40 28, 80 20 T 120 22 L 160 18"
                fill="none"
                stroke={currentTheme.stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
