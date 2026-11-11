/**
 * Type-safe Centralized Environment Configuration.
 *
 * Ensures that environment variables are accessed consistently across the app.
 * Variables prefixed with NEXT_PUBLIC_ are bundled into client code.
 * Non-prefixed variables are strictly server-side and will be undefined in the browser.
 */

const isServer = typeof window === "undefined";

export const env = {
  /**
   * The base URL for external or internal API calls.
   * Defaults to '/api/v1' in the browser for relative routing,
   * or 'http://localhost:3000/api/v1' for server-side evaluation.
   */
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL || (isServer ? "http://localhost:3000/api/v1" : "/api/v1"),

  /**
   * Current runtime environment.
   */
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",

  /**
   * Safe check for SSR vs Browser runtime.
   */
  isServer,
  isClient: !isServer,
} as const;

export type Env = typeof env;
