"use client";

import {
  useAuthUser,
  useIsAuthenticated,
  useAuthHasHydrated,
  useAuthActions,
} from "@/stores/useAuthStore";

/**
 * Convenient facade hook bundling authentication state and actions.
 */
export function useAuth() {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthHasHydrated();
  const actions = useAuthActions();

  return {
    user,
    isAuthenticated,
    hasHydrated,
    ...actions,
  };
}
