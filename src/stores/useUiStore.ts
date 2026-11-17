import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UiState {
  isSidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

interface UiActions {
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: "light",

      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed: boolean) => set({ isSidebarCollapsed: collapsed }),
      toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setMobileSidebarOpen: (open: boolean) => set({ mobileSidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "learnkaro_ui_preferences",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);

// Atomic selectors to prevent unnecessary re-renders
export const useIsSidebarCollapsed = () => useUiStore((state) => state.isSidebarCollapsed);
export const useMobileSidebarOpen = () => useUiStore((state) => state.mobileSidebarOpen);
export const useUiTheme = () => useUiStore((state) => state.theme);

// Stable action selectors - avoids returning a new object reference on every render
export const useUiActions = () => {
  const toggleSidebarCollapse = useUiStore((state) => state.toggleSidebarCollapse);
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed);
  const toggleMobileSidebar = useUiStore((state) => state.toggleMobileSidebar);
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);
  const setTheme = useUiStore((state) => state.setTheme);

  return useMemo(
    () => ({
      toggleSidebarCollapse,
      setSidebarCollapsed,
      toggleMobileSidebar,
      setMobileSidebarOpen,
      setTheme,
    }),
    [
      toggleSidebarCollapse,
      setSidebarCollapsed,
      toggleMobileSidebar,
      setMobileSidebarOpen,
      setTheme,
    ]
  );
};
