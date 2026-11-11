# Production-Ready Next.js + TypeScript Starter Architecture

A clean, non-bloated Next.js + TypeScript starter template focusing purely on **architectural plumbing**:

- **Native Fetch API Client** (zero Axios dependency, full type safety for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Zustand Client State** (zero Redux, atomic selectors, SSR hydration safety).
- **TanStack React Query v5** (request-isolated SSR server state, deterministic cache keys).
- **Zero UI Bloat** (no arbitrary UI components; bring your own design system, Tailwind, shadcn, or CSS).

---

## Table of Contents

1. [Calling All API Client Methods (GET, POST, PUT, PATCH, DELETE)](#1-calling-all-api-client-methods)
2. [What Zustand Does & How to Add Stores](#2-what-zustand-does--how-to-add-stores)
3. [TanStack React Query & Server State Flow](#3-tanstack-react-query--server-state-flow)
4. [Folder Structure](#4-folder-structure)
5. [Environment Variables](#5-environment-variables)
6. [Available Scripts](#6-available-scripts)

---

## 1. Calling All API Client Methods

The API client is located in `src/services/api/client.ts`. It wraps the **native Fetch API** with TypeScript generics, centralized base URLs, timeout handling, query parameter formatting, and error parsing.

Import the client:

```typescript
import { api } from "@/services/api";
```

### 1.1 `GET` Method

Fetches data with automatic JSON parsing and optional query parameters.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 1. Basic GET request
const user = await api.get<User>("/users/123");

// 2. GET request with query params (?page=1&limit=10&search=john)
interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
}

const users = await api.get<PaginatedUsers>("/users", {
  params: {
    page: 1,
    limit: 10,
    search: "john",
  },
});
```

### 1.2 `POST` Method

Sends a JSON payload or `FormData` to create a resource.

```typescript
interface CreateUserPayload {
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

// 1. JSON POST
const createdUser = await api.post<User, CreateUserPayload>("/users", {
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin",
});

// 2. FormData / File Upload (Content-Type header is handled automatically)
const formData = new FormData();
formData.append("avatar", fileBlob, "profile.jpg");
formData.append("userId", "123");

const uploadResult = await api.post<{ avatarUrl: string }>("/users/avatar", formData);
```

### 1.3 `PUT` Method

Completely replaces an existing resource.

```typescript
interface UpdateUserPayload {
  name: string;
  email: string;
  role: string;
}

const replacedUser = await api.put<User, UpdateUserPayload>("/users/123", {
  name: "Jane Smith",
  email: "jane.smith@example.com",
  role: "admin",
});
```

### 1.4 `PATCH` Method

Partially updates an existing resource.

```typescript
interface PartialUpdateUserPayload {
  role?: string;
  status?: "active" | "inactive";
}

const updatedUser = await api.patch<User, PartialUpdateUserPayload>("/users/123", {
  status: "active",
});
```

### 1.5 `DELETE` Method

Deletes a resource and handles 204 No Content or JSON responses.

```typescript
interface DeleteResponse {
  success: boolean;
  id: string;
}

const result = await api.delete<DeleteResponse>("/users/123");
```

### 1.6 Request Options & Next.js Caching

You can pass custom headers, signals, or Next.js App Router caching options to any method:

```typescript
const user = await api.get<User>("/users/me", {
  // Pass an AbortSignal for cancellation
  signal: abortController.signal,

  // Custom timeout in milliseconds (defaults to 30,000ms)
  timeoutMs: 5000,

  // Custom headers
  headers: {
    "X-Custom-Header": "my-value",
  },

  // Skip appending Bearer authorization header if not needed
  skipAuth: true,

  // Next.js App Router native cache options (Server Components)
  cache: "no-store",
  next: {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ["users-cache"],
  },
});
```

### 1.7 Centralized Error Handling

Errors are thrown as strongly typed `ApiError` instances:

```typescript
import { isApiError } from "@/services/api";

try {
  await api.get("/users/invalid-id");
} catch (error) {
  if (isApiError(error)) {
    console.error("Status:", error.status); // 400, 401, 403, 404, 422, 500
    console.error("Status Text:", error.statusText);
    console.error("Server Message:", error.message);

    // Helpers
    if (error.isValidationError) {
      console.log("Field errors:", error.getValidationErrors());
    }
    if (error.isUnauthorized) {
      console.log("Session expired or token missing.");
    }
    if (error.isNetworkError) {
      console.log("Network unreachable or CORS failure.");
    }
  }
}
```

---

## 2. What Zustand Does & How to Add Stores

### What is Zustand?

**Zustand** is a minimalist, fast global state management library for React. Unlike Redux, it requires **zero boilerplate**, no dispatchers, no reducers, and no Context provider wrapping.

### Why use Zustand instead of React Query or Context API?

- **Server State vs Client State**:
  - **TanStack Query** manages **server state** (data fetched from APIs, caching, refetching, background syncing).
  - **Zustand** manages **client UI state** (sidebar toggle, modal dialogs, active filters, draft forms, user session metadata).
- **No Unnecessary Re-renders**: Zustand allows **atomic selectors**. If 10 components use different fields of a store, changing field `A` only re-renders the component subscribed to `A`.

---

### How to Create a New Store

Create your store in `src/stores/` (or inside a feature directory `src/features/<feature>/store/`):

#### Step 1: Define Types & State Interface

```typescript
// src/stores/useCartStore.ts
import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export type CartStore = CartState & CartActions;
```

#### Step 2: Create the Store

```typescript
export const useCartStore = create<CartStore>((set) => ({
  // Initial state
  items: [],
  isOpen: false,

  // Actions
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
```

#### Step 3: Export Atomic Selectors

Export dedicated selector hooks so components don't re-render when unrelated store fields change:

```typescript
// Components calling this only re-render when items change
export const useCartItems = () => useCartStore((state) => state.items);

// Components calling this only re-render when isOpen changes
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

// Actions never change reference, so components using this NEVER re-render
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
  }));
```

#### Step 4: Use in a Component

```tsx
"use client";

import { useCartItems, useCartActions } from "@/stores/useCartStore";

export function CartSummary() {
  const items = useCartItems();
  const { clearCart } = useCartActions();

  return (
    <div>
      <p>Total items: {items.length}</p>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}
```

---

### Persistence & Next.js Hydration Safety

When persisting a Zustand store to `localStorage`, Next.js server-side rendering (SSR) outputs HTML before `localStorage` is read on the browser, which can cause hydration mismatch warnings.

#### Creating a Persisted Store Safely

```typescript
// src/stores/useSettingsStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  theme: "light" | "dark";
  notifications: boolean;
  setTheme: (theme: "light" | "dark") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      notifications: true,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "user_settings",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
```

#### Consuming with `useHydration()`

Use the included `useHydration()` hook (`src/hooks/useHydration.ts`) to guard persisted state:

```tsx
"use client";

import { useHydration } from "@/hooks/useHydration";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function ThemeToggle() {
  const isHydrated = useHydration();
  const theme = useSettingsStore((state) => state.theme);

  // During SSR / initial client pass, show fallback until localStorage is read
  if (!isHydrated) return null;

  return <div>Current Theme: {theme}</div>;
}
```

---

## 3. TanStack React Query: Caching, Data Fetching & State Handling

TanStack React Query v5 manages all **server state**, network caching, automatic deduplication, and background revalidation.

### 3.1 How Caching Works Under the Hood

| Concept                    | Default Setting                | How It Works                                                                                                                                                     |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Query Key (`queryKey`)** | e.g. `["auth", "currentUser"]` | Unique cache identity. All components querying the same key share the same cached response in memory.                                                            |
| **`staleTime`**            | `1 minute`                     | How long data remains "fresh". Within this window, any component requesting this query reads immediately from cache with **zero network requests**.              |
| **`gcTime`**               | `5 minutes`                    | How long inactive query data stays in memory before garbage collection.                                                                                          |
| **Deduplication**          | Automatic                      | If 5 components mount simultaneously on a page requesting the same query, React Query merges them into **only 1 network request**.                               |
| **Stale-While-Revalidate** | Automatic                      | Once data becomes stale, React Query serves the cached data **instantly** to the UI, while silently fetching fresh data in the background and updating the view. |

---

### 3.2 Handling `loading`, `error`, and `data` in UI Components

Call the query hook in any Client Component (`"use client"`). The hook exposes convenient aliases (`user`, `loading`) alongside standard TanStack properties (`isError`, `error`, `refetch`):

```tsx
"use client";

import { useCurrentUser } from "@/features/auth/hooks";

export function ProfileWidget() {
  // Destructure state
  const { user, loading, error, isError, refetch } = useCurrentUser();

  // 1. Loading State (initial fetch or cache miss)
  if (loading) {
    return <p>Loading user profile...</p>;
  }

  // 2. Error State (network failure or non-2xx status)
  if (isError) {
    return (
      <div style={{ color: "red" }}>
        <p>Error: {error?.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  // 3. Null / Unauthenticated State
  if (!user) {
    return <p>No active user session. Please log in.</p>;
  }

  // 4. Success / Data State
  return (
    <div>
      <h3>Welcome, {user.name}!</h3>
      <p>Email: {user.email}</p>
      <span>Role: {user.role}</span>
    </div>
  );
}
```

---

### 3.3 How the Query Hook is Implemented (`src/features/auth/hooks/useCurrentUser.ts`)

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth-query-keys";
import { QUERY_CONFIG } from "@/lib/constants";

export function useCurrentUser() {
  const query = useQuery({
    queryKey: authKeys.currentUser(), // Cache identifier: ["auth", "currentUser"]
    queryFn: () => authService.getCurrentUser(), // Calls native fetch api.get("/auth/me")
    staleTime: QUERY_CONFIG.DEFAULT_STALE_TIME, // Caches in memory for 1 minute
    gcTime: QUERY_CONFIG.DEFAULT_GC_TIME,
  });

  return {
    ...query,
    // Convenient aliases:
    user: query.data ?? null,
    loading: query.isLoading,
  };
}
```

---

### 3.4 Updating & Invalidating the Cache on Mutations (`useLogin` & `useLogout`)

When mutating data (e.g. logging in), you can update the cache directly or invalidate it to trigger a background refetch:

```typescript
// src/features/auth/hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { authKeys } from "./auth-query-keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      // 1. Instantly inject new user into the React Query cache
      queryClient.setQueryData(authKeys.currentUser(), data.user);
    },
  });
}
```

And to clear the cache on logout:

```typescript
// src/features/auth/hooks/useLogout.ts
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clears all cached auth queries from memory
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
```

---

## 4. Folder Structure

```text
src/
├── app/                              # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx                    # Root layout with QueryClientProvider
│   ├── page.tsx                      # Clean placeholder page
│   └── providers.tsx                 # Client QueryClientProvider + DevTools
│
├── config/
│   └── env.ts                        # Centralized type-safe environment variables
│
├── features/                         # Feature-based domain modules
│   └── auth/
│       ├── hooks/
│       │   ├── auth-query-keys.ts    # React Query keys factory
│       │   ├── useCurrentUser.ts     # React Query fetch hook with caching
│       │   ├── useLogin.ts           # React Query mutation hook
│       │   ├── useLogout.ts          # React Query mutation hook
│       │   ├── useAuth.ts            # Zustand facade hook
│       │   └── index.ts              # Barrel export
│       ├── services/
│       │   └── auth.service.ts       # Native fetch HTTP calls
│       ├── store/
│       │   └── auth.store.ts         # Zustand client store re-export
│       └── types/
│           └── auth.types.ts         # Domain TypeScript types
│
├── hooks/
│   ├── useDebounce.ts
│   └── useHydration.ts               # SSR-safe hydration hook
│
├── lib/
│   ├── constants.ts                  # HTTP codes, timeouts, query defaults
│   ├── query-client.ts               # QueryClient factory (SSR isolated)
│   └── utils.ts                      # Helper functions
│
├── services/
│   └── api/                          # Centralized Native Fetch API Client
│       ├── api-config.ts
│       ├── api-error.ts
│       ├── api-types.ts
│       ├── client.ts
│       └── index.ts
│
├── stores/                           # Centralized Zustand client stores
│   ├── useAuthStore.ts
│   └── useUiStore.ts
│
└── types/
    └── common.types.ts               # ApiResponse, PaginatedResponse, etc.
```

---

## 5. Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_ENV=development
```

Access variables safely via `src/config/env.ts`:

```typescript
import { env } from "@/config/env";
```

---

## 6. Available Scripts

| Script                 | Command              | Purpose                                              |
| ---------------------- | -------------------- | ---------------------------------------------------- |
| `npm run dev`          | `next dev`           | Start development server with Turbopack              |
| `npm run build`        | `next build`         | Optimized production build + TypeScript verification |
| `npm run start`        | `next start`         | Start production server                              |
| `npm run lint`         | `eslint .`           | Lint codebase with ESLint                            |
| `npm run lint:fix`     | `eslint . --fix`     | Automatically fix fixable lint errors                |
| `npm run format`       | `prettier --write .` | Format all files with Prettier                       |
| `npm run format:check` | `prettier --check .` | Check formatting compliance                          |
| `npm run type-check`   | `tsc --noEmit`       | Strict TypeScript compiler check                     |

---

## 7. Commit Message Convention & Git Hooks

This repository enforces **Conventional Commits** using **Husky**, **Commitlint**, and **lint-staged** to ensure a consistent, readable Git history.

### 7.1 Commit Message Format

```text
<type>(<optional scope>): <short description>
```

### 7.2 Allowed Types

| Type       | When to Use                                                   | Example                                              |
| ---------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `feat`     | Adding a new feature                                          | `feat(auth): add google sso login`                   |
| `fix`      | Fixing a bug                                                  | `fix(api): handle token refresh race condition`      |
| `docs`     | Documentation changes                                         | `docs: add pre-commit guidelines to readme`          |
| `style`    | Formatting, whitespace, semicolons (no code logic changes)    | `style: reformat tailwind classes`                   |
| `refactor` | Refactoring code without changing behavior or adding features | `refactor(stores): simplify auth store selectors`    |
| `perf`     | Performance improvements                                      | `perf(query): increase staleTime for static queries` |
| `test`     | Adding or updating tests                                      | `test(api): add tests for client error handling`     |
| `build`    | Changes to build tools, dependencies, or package configs      | `build: upgrade tanstack query to v5`                |
| `ci`       | CI/CD pipeline changes                                        | `ci: add github actions typecheck workflow`          |
| `chore`    | Routine maintenance tasks                                     | `chore: update .gitignore and env examples`          |
| `revert`   | Reverting a previous commit                                   | `revert: undo previous api client change`            |

### 7.3 Automated Pre-Commit Workflow

- **`pre-commit`**: Automatically runs `lint-staged` on staged files (runs `eslint --fix` and `prettier --write` on code files, and `prettier` on JSON/MD/CSS). Commits with lint or formatting errors will be blocked.
- **`commit-msg`**: Automatically validates your commit message against `commitlint.config.mjs`. Invalid messages (e.g. `updated stuff`, `wip`, `fixes`) will be rejected with clear instructions.
