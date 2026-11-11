"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth-query-keys";
import type { AuthUser } from "../types/auth.types";
import { QUERY_CONFIG } from "@/lib/constants";

export interface UseCurrentUserOptions extends Omit<
  UseQueryOptions<AuthUser, Error>,
  "queryKey" | "queryFn"
> {
  enabled?: boolean;
}

/**
 * React Query Hook to fetch and cache the current authenticated user profile.
 *
 * Usage:
 * ```tsx
 * const { user, loading, error } = useCurrentUser();
 * // or standard React Query properties:
 * const { data, isLoading, isError, refetch } = useCurrentUser();
 * ```
 */
export function useCurrentUser(options?: UseCurrentUserOptions) {
  const query = useQuery<AuthUser, Error>({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME, // Cached for configured stale duration
    gcTime: QUERY_CONFIG.DEFAULT_GC_TIME,
    ...options,
  });

  return {
    ...query,
    // Convenient aliases
    user: query.data ?? null,
    loading: query.isLoading,
  };
}
