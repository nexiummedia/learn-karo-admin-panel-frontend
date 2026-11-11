/**
 * Centralized API Client Configuration
 */
import { env } from "@/config/env";
import { APP_CONFIG } from "@/lib/constants";
import type { ApiClientConfig } from "./api-types";

/**
 * Global default API configuration.
 * Can be overridden or extended at runtime.
 */
export const defaultApiConfig: ApiClientConfig = {
  baseUrl: env.apiUrl,
  timeoutMs: APP_CONFIG.REQUEST_TIMEOUT_MS,
  defaultHeaders: {
    Accept: "application/json",
  },
  // By default, tokens are not automatically read from localStorage to keep SSR clean
  // and avoid security pitfalls. Features can configure token hooks if needed.
  getAuthToken: undefined,
  onUnauthorized: undefined,
  refreshToken: undefined,
};
