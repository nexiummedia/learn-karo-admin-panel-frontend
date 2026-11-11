"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth-query-keys";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * React Query Mutation Hook for user logout.
 *
 * Clears React Query cache and resets Zustand authentication store.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuthStore = useAuthStore((state) => state.logout);

  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // 1. Remove all cached auth data from React Query
      queryClient.removeQueries({ queryKey: authKeys.all });

      // 2. Clear client-side state in Zustand
      clearAuthStore();
    },
  });
}
