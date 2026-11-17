"use client";

import React, { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Calendar, ChevronRight } from "lucide-react";
import { SearchInput } from "@/components/ui/SearchInput";
import { useUiActions } from "@/stores/useUiStore";

// Safe client-side date subscriber with fixed server snapshot for Next.js prerendering
function useCurrentFormattedDate() {
  return useSyncExternalStore(
    () => () => {},
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    () => "Nov 17, 2026"
  );
}

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { toggleMobileSidebar } = useUiActions();
  const [searchValue, setSearchValue] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);
  const currentDateFormatted = useCurrentFormattedDate();

  // Dynamic breadcrumb generation
  const getBreadcrumbTitle = () => {
    if (!pathname || pathname === "/admin/dashboard") return "Overview";
    const segment = pathname.split("/").pop() || "Dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-700 transition-colors">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{getBreadcrumbTitle()}</span>
        </nav>
      </div>

      {/* Right: Search, Date pill, Notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="hidden sm:block">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
            placeholder="Search leads, courses..."
            shortcutBadge="⌘K"
          />
        </div>

        {/* Date Pill (matching the screenshot) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentDateFormatted}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setHasNotifications(false)}
            title="Notifications"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer relative"
          >
            <Bell className="w-4 h-4" />
            {hasNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
