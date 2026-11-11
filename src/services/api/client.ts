/**
 * Production-Ready Native Fetch API Client.
 *
 * Designed for Next.js App Router (Server & Client Components compatible).
 * Zero third-party HTTP client dependencies (No Axios).
 */

import { ApiError } from "./api-error";
import { defaultApiConfig } from "./api-config";
import type { ApiClientConfig, HttpMethod, QueryParams, RequestOptions } from "./api-types";

export class ApiClient {
  private config: ApiClientConfig;
  private refreshPromise: Promise<string | boolean | null> | null = null;

  constructor(config: ApiClientConfig = defaultApiConfig) {
    this.config = { ...config };
  }

  /**
   * Update configuration at runtime (e.g. setting auth hooks or base URL).
   */
  public setConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration.
   */
  public getConfig(): Readonly<ApiClientConfig> {
    return this.config;
  }

  /**
   * Build the complete request URL with properly formatted query parameters.
   */
  private buildUrl(endpoint: string, params?: QueryParams): string {
    const isAbsolute = /^https?:\/\//i.test(endpoint);
    let fullUrl = endpoint;

    if (!isAbsolute) {
      const base = this.config.baseUrl.replace(/\/+$/, "");
      const path = endpoint.replace(/^\/+/, "");
      fullUrl = `${base}/${path}`;
    }

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          value.forEach((val) => searchParams.append(key, String(val)));
        } else {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    return fullUrl;
  }

  /**
   * Core request dispatcher.
   */
  private async request<TResponse>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = new Headers(this.config.defaultHeaders || {});

    // Merge options headers
    if (options.headers) {
      const customHeaders = new Headers(options.headers);
      customHeaders.forEach((val, key) => headers.set(key, val));
    }

    // Attach authorization header if available and not skipped
    if (!options.skipAuth && this.config.getAuthToken) {
      try {
        const token = await this.config.getAuthToken();
        if (token && !headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.warn("Failed to retrieve auth token for API request:", err);
      }
    }

    // Determine request body and content type
    let requestBody: BodyInit | null | undefined = undefined;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    if (body !== undefined && body !== null) {
      if (isFormData) {
        // Let the browser/runtime set multipart/form-data boundary automatically
        headers.delete("Content-Type");
        requestBody = body as FormData;
      } else if (typeof body === "string" || body instanceof Blob || body instanceof ArrayBuffer) {
        requestBody = body as BodyInit;
      } else {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
        requestBody = JSON.stringify(body);
      }
    }

    // Timeout management with AbortController
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs ?? 30000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (timeoutMs > 0) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);
    }

    // Combine custom signal with timeout signal
    if (options.signal) {
      options.signal.addEventListener("abort", () => controller.abort());
    }

    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
        cache: options.cache,
        credentials: options.credentials ?? "same-origin",
      };

      // Support Next.js specific caching options if provided
      if (options.next) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetchOptions as any).next = options.next;
      }

      const response = await fetch(url, fetchOptions);

      // Handle HTTP 401 Unauthorized with token refresh mechanism
      if (response.status === 401 && !options._retry && this.config.refreshToken) {
        try {
          // Concurrency lock: multiple 401 requests wait for the single refresh promise
          if (!this.refreshPromise) {
            this.refreshPromise = this.config.refreshToken().finally(() => {
              this.refreshPromise = null;
            });
          }

          const refreshResult = await this.refreshPromise;

          if (refreshResult) {
            // Retry the original request once with _retry flag
            return await this.request<TResponse>(method, endpoint, body, {
              ...options,
              _retry: true,
            });
          }
        } catch {
          // Refresh failed
        }

        // Notify unauthorized listener
        if (this.config.onUnauthorized) {
          await this.config.onUnauthorized();
        }
      }

      // Check for HTTP errors
      if (!response.ok) {
        let errorData = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            errorData = text ? { message: text } : null;
          }
        } catch {
          errorData = null;
        }

        const message =
          errorData?.message ||
          `Request failed with status ${response.status} (${response.statusText})`;

        throw new ApiError({
          message,
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        });
      }

      // 204 No Content response
      if (response.status === 204) {
        return null as unknown as TResponse;
      }

      // Parse JSON response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as TResponse;
      }

      // Fallback for non-JSON content
      const textData = await response.text();
      return textData as unknown as TResponse;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }

      const isAbort = (err as Error)?.name === "AbortError" || controller.signal.aborted;

      throw new ApiError({
        message: isAbort
          ? `Request timed out after ${timeoutMs}ms or was aborted`
          : (err as Error)?.message || "Network request failed",
        status: isAbort ? 408 : 0,
        statusText: isAbort ? "Request Timeout" : "Network Error",
        isNetworkError: !isAbort,
        isTimeout: isAbort,
      });
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  public get<TResponse>(endpoint: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("GET", endpoint, undefined, options);
  }

  public post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>("POST", endpoint, body, options);
  }

  public put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>("PUT", endpoint, body, options);
  }

  public patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ): Promise<TResponse> {
    return this.request<TResponse>("PATCH", endpoint, body, options);
  }

  public delete<TResponse>(endpoint: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("DELETE", endpoint, undefined, options);
  }
}

/**
 * Singleton API Client instance.
 */
export const api = new ApiClient();

/**
 * Factory for creating custom API client instances (e.g., third-party APIs).
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
