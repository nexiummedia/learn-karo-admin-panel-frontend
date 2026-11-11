"use client";

import { useCurrentUser } from "@/features/auth/hooks";

export default function HomePage() {
  // TanStack React Query in action:
  // Automatically handles request caching (staleTime), deduplication, and loading/error states.
  const { user, loading, error } = useCurrentUser();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
      <h1>Next.js + TypeScript Starter Template</h1>
      <p>
        Clean architecture initialized with TanStack React Query, Zustand, and a native Fetch API
        client.
      </p>

      <section
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      >
        <h2>React Query Data Fetching & Caching:</h2>
        <pre style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "4px" }}>
          <code>const &#123; user, loading, error &#125; = useCurrentUser();</code>
        </pre>
        <div>
          {loading && <p>Fetching user from API / cache...</p>}
          {error && <p style={{ color: "red" }}>Status: {error.message}</p>}
          {user && (
            <p>
              Current User: <strong>{user.name}</strong> ({user.email})
            </p>
          )}
          {!loading && !user && !error && <p>No active session found.</p>}
        </div>
      </section>
    </main>
  );
}
