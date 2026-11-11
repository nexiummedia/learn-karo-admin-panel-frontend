import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { APP_CONFIG } from "@/lib/constants";
import type { AuthStore, AuthUser } from "@/features/auth/types/auth.types";

/**
 * Zustand Authentication Store.
 *
 * Manages global client-side authentication status and non-sensitive user metadata.
 * NOTE: Sensitive credentials/access tokens should NOT be stored in localStorage.
 * Tokens should either be handled via HTTP-only cookies or kept in memory.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: (user: AuthUser) =>
        set({
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setHasHydrated: (hydrated: boolean) =>
        set({
          _hasHydrated: hydrated,
        }),
    }),
    {
      name: APP_CONFIG.AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => {
        // Safe check for Next.js SSR
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Only persist non-sensitive user state
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Dedicated atomic selectors to prevent unnecessary component re-renders.
 */
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthHasHydrated = () => useAuthStore((state) => state._hasHydrated);

export const useAuthActions = () =>
  useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    updateUser: state.updateUser,
  }));
