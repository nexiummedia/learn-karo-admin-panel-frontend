/**
 * Authentication Service
 *
 * Handles API calls for login, logout, session verification, and token refresh.
 */

import { api } from "@/services/api";
import type { AuthUser } from "../types/auth.types";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export const authService = {
  /**
   * Authenticate user with credentials.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse, LoginCredentials>("/auth/login", credentials, {
      skipAuth: true,
    });
  },

  /**
   * Log out current session on server.
   */
  async logout(): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>("/auth/logout");
  },

  /**
   * Fetch current session user.
   */
  async getCurrentUser(): Promise<AuthUser> {
    return api.get<AuthUser>("/auth/me");
  },
};
