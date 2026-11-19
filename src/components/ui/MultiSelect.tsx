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
  const [openUpward, setOpenUpward] = useState(false);
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

  // Detect whether to open upward or downward based on viewport room
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 230px space below, flip upward so it never creates page scroll
      setOpenUpward(spaceBelow < 230 && rect.top > 200);
    }
  }, [isOpen]);

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
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      {/* Relative anchor with exact boundaries */}
      <div className="relative w-full">
        {/* Select Box */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[42px] w-full bg-white border rounded-lg py-2 px-3 flex items-center justify-between gap-2 cursor-pointer transition-all hover:border-slate-300 focus:outline-none focus:ring-1 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
              : isOpen
                ? "border-slate-900 ring-1 ring-slate-900"
                : "border-slate-200"
          }`}
        >
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {selectedValues.length === 0 ? (
              <span className="text-xs sm:text-sm text-slate-400">{placeholder}</span>
            ) : (
              selectedValues.map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded border border-slate-200/80 font-medium"
                  >
                    <span>{opt?.label || val}</span>
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

        {/* Dropdown Menu - Perfectly anchored with dynamic top/bottom placement */}
        {isOpen && (
          <div
            className={`absolute left-0 right-0 z-50 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-1 text-xs animate-in fade-in duration-100 ${
              openUpward ? "bottom-full mb-1.5 origin-bottom" : "top-full mt-1.5 origin-top"
            }`}
          >
            {options.length > 4 && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white transition-colors mb-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            )}

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {filteredOptions.length === 0 ? (
                <p className="text-slate-400 text-center py-3 text-xs">No options found</p>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = selectedValues.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(opt.value);
                      }}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
