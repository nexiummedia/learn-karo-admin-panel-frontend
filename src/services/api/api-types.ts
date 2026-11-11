/**
 * API Client Type Definitions
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryParams = Record<
  string,
  string | number | boolean | (string | number | boolean)[] | undefined | null
>;

export interface NextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  /**
   * URL Query parameters to append to the endpoint.
   */
  params?: QueryParams;

  /**
   * Timeout in milliseconds before the request is aborted.
   */
  timeoutMs?: number;

  /**
   * If true, skips appending the Authorization header.
   */
  skipAuth?: boolean;

  /**
   * Next.js App Router specific fetch caching and revalidation options.
   */
  next?: NextFetchOptions;

  /**
   * Internal flag to avoid infinite refresh retry loops.
   */
  _retry?: boolean;
}

export interface ApiClientConfig {
  /**
   * Base URL for all relative endpoints (e.g., "https://api.example.com/v1").
   */
  baseUrl: string;

  /**
   * Default headers applied to every request.
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Request timeout in milliseconds (default: 30000ms).
   */
  timeoutMs?: number;

  /**
   * Hook to retrieve the current bearer token.
   * Can be asynchronous or synchronous.
   */
  getAuthToken?: () => string | null | Promise<string | null>;

  /**
   * Hook executed when an unauthorized (401) response is received
   * and any refresh attempts have been exhausted.
   */
  onUnauthorized?: () => void | Promise<void>;

  /**
   * Optional token refresh handler. Prevents multiple concurrent refresh calls.
   * Must return the new access token or true on success, or null/false on failure.
   */
  refreshToken?: () => Promise<string | boolean | null>;
}
