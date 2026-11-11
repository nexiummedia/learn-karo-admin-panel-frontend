/**
 * Authentication Types
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
}

export interface AuthActions {
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<Omit<AuthUser, "id">>) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;
