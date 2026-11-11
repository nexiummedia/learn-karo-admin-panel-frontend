/**
 * Application Constants
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const QUERY_CONFIG = {
  DEFAULT_STALE_TIME: 1000 * 60 * 1, // 1 minute
  DEFAULT_GC_TIME: 1000 * 60 * 5, // 5 minutes
  DEFAULT_RETRY_COUNT: 2,
} as const;

export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  REQUEST_TIMEOUT_MS: 30000,
  AUTH_STORAGE_KEY: "app_auth_session",
  THEME_STORAGE_KEY: "app_theme",
} as const;
