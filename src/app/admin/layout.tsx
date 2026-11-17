"use client";

import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { useIsSidebarCollapsed } from "@/stores/useUiStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isCollapsed = useIsSidebarCollapsed();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
