/**
 * Strongly Typed API Error Handling
 */

export interface ApiErrorData {
  message?: string;
  code?: string;
  errors?: Record<string, string[] | string>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: ApiErrorData | null;
  public readonly isNetworkError: boolean;
  public readonly isTimeout: boolean;

  constructor({
    message,
    status = 500,
    statusText = "Internal Server Error",
    data = null,
    isNetworkError = false,
    isTimeout = false,
  }: {
    message: string;
    status?: number;
    statusText?: string;
    data?: ApiErrorData | null;
    isNetworkError?: boolean;
    isTimeout?: boolean;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;

    // Restore prototype chain in transpiled environments
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isBadRequest(): boolean {
    return this.status === 400;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isValidationError(): boolean {
    return this.status === 422;
  }

  get isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Helper to format validation errors into an easily consumable list.
   */
  getValidationErrors(): Record<string, string[]> {
    if (!this.data?.errors) return {};
    const formatted: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(this.data.errors)) {
      formatted[key] = Array.isArray(val) ? val : [val];
    }
    return formatted;
  }
}

/**
 * Type guard to check if an unknown error is an instance of ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
