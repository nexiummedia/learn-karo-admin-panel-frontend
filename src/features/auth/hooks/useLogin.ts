"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginCredentials, type AuthResponse } from "../services/auth.service";
import { authKeys } from "./auth-query-keys";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * React Query Mutation Hook for user login.
 *
 * Automatically updates React Query cache and syncs user session with Zustand store.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setAuthUser = useAuthStore((state) => state.login);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // 1. Update React Query server cache immediately
      queryClient.setQueryData(authKeys.currentUser(), data.user);

      // 2. Sync client-side session into Zustand store
      setAuthUser(data.user);
    },
  });
}
