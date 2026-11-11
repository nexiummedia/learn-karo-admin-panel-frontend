/**
 * Centralized TanStack React Query Configuration.
 *
 * Implements best practices for Next.js App Router:
 * - Prevents sharing QueryClient instances across server requests.
 * - Single stable QueryClient on the browser.
 * - Sensible default caching, garbage collection, and retry logic.
 */

import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { isApiError } from "@/services/api/api-error";
import { QUERY_CONFIG } from "./constants";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME,
        gcTime: QUERY_CONFIG.DEFAULT_GC_TIME,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
        retry: (failureCount, error) => {
          // Do not retry client-side 4xx errors (e.g., 400, 401, 403, 404, 422)
          if (isApiError(error) && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < QUERY_CONFIG.DEFAULT_RETRY_COUNT;
        },
      },
      mutations: {
        retry: false,
      },
      dehydrate: {
        // Include pending queries in dehydration for SSR prefetching if needed
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a request-scoped QueryClient on the server,
 * and a singleton QueryClient on the browser.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always make a new query client per request
    return makeQueryClient();
  }
  // Browser: make a new query client once if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
