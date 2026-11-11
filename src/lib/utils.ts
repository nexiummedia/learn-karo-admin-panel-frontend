/**
 * General Reusable Utility Functions
 */

/**
 * Lightweight class name concatenation helper (alternative to clsx/tailwind-merge
 * when zero-dependency footprint is prioritized).
 */
export function cn(...classes: (string | boolean | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Safely format an error into a human-readable message.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred.";
}

/**
 * Utility to delay execution (useful for mock latency or retry backoff).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
