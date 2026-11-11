"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Idiomatic React hook to safely detect client-side hydration
 * using `useSyncExternalStore` (zero cascading renders, safe for React 19 / Next.js 16).
 *
 * Returns `false` during SSR and initial hydration pass, then `true` on the client.
 */
export function useHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
