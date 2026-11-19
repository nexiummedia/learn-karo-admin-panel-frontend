"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useIsSidebarCollapsed, useMobileSidebarOpen, useUiActions } from "@/stores/useUiStore";
import { useAuthStore } from "@/stores/useAuthStore";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isCollapsed = useIsSidebarCollapsed();
  const mobileOpen = useMobileSidebarOpen();
  const { toggleSidebarCollapse, setMobileSidebarOpen } = useUiActions();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const mainNav: NavItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Leads", href: "/admin/leads", icon: Target, badge: "New" },
    { name: "Customers", href: "/admin/customers", icon: GraduationCap },
    { name: "Courses", href: "/admin/courses", icon: BookOpen },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  const secondaryNav: NavItem[] = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Help & Feedback", href: "#", icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 transition-all duration-200 ease-in-out flex flex-col justify-between ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-[72px]" : "w-64"}`}
      >
        {/* Top: Logo & Workspace Switcher */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <div
              className={`flex items-center gap-3 overflow-hidden transition-all ${
                isCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                LK
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs tracking-tight text-slate-900 truncate">
                      LearnKaro LMS
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Enterprise Portal
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            {!isCollapsed && (
              <button
                onClick={toggleSidebarCollapse}
                title="Collapse sidebar"
                className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Collapsed Expand Trigger */}
          {isCollapsed && (
            <div className="hidden lg:flex justify-center py-2 border-b border-slate-100">
              <button
                onClick={toggleSidebarCollapse}
                title="Expand sidebar"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-100/90 text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 pb-1">
              <div className={`border-t border-slate-100 ${isCollapsed ? "mx-1" : "mx-2"}`} />
            </div>

            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 space-y-3">
          {/* User Profile Footer */}
          <div
            className={`border-t border-slate-100 pt-3 flex items-center justify-between ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div
              className={`flex items-center gap-2.5 overflow-hidden ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {user?.name || "Rahul Sharma"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || "admin@learnkaro.com"}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
