"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
  category?: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const removeItem = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== val));
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`w-full space-y-1.5 ${className}`}>
      {label && <label className="block text-xs font-medium text-slate-700">{label}</label>}

      {/* Select Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[38px] w-full bg-white border rounded-lg py-1.5 px-3 flex items-center justify-between gap-2 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
          error
            ? "border-rose-400"
            : isOpen
              ? "border-slate-900 ring-2 ring-slate-900/10"
              : "border-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {selectedValues.length === 0 ? (
            <span className="text-xs sm:text-sm text-slate-400">{placeholder}</span>
          ) : (
            selectedValues.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded border border-slate-200/80"
                >
                  {opt?.label || val}
                  <button
                    type="button"
                    onClick={(e) => removeItem(val, e)}
                    className="text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-w-sm bg-white border border-slate-200 rounded-lg shadow-lg p-2 space-y-1 text-xs">
          {options.length > 5 && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search options..."
              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-slate-900 mb-1"
              autoFocus
            />
          )}

          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <p className="text-slate-400 text-center py-2 text-xs">No options found</p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-900 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
