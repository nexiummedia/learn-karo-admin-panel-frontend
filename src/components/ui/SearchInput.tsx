"use client";

import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcutBadge?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className = "",
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      shortcutBadge,
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value);

    return (
      <div className={`relative flex items-center w-full max-w-xs ${className}`}>
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-xs sm:text-sm bg-white border border-slate-200/90 rounded-lg pl-9 pr-9 py-1.5 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-colors shadow-2xs"
          {...props}
        />
        {hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : shortcutBadge ? (
          <span className="absolute right-2.5 text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono pointer-events-none">
            {shortcutBadge}
          </span>
        ) : null}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
