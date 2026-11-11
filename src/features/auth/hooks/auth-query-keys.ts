/**
 * Centralized Query Keys Factory for Authentication
 */
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};
