import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
}

interface UiActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  theme: "system",

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));

export const useSidebarOpen = () => useUiStore((state) => state.sidebarOpen);
export const useTheme = () => useUiStore((state) => state.theme);
export const useUiActions = () =>
  useUiStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    setTheme: state.setTheme,
  }));
