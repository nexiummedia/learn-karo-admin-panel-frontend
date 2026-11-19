<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Project Guidelines

### 1. Code Quality

- Write clean, simple, readable, production-ready code.
- Follow existing project conventions and patterns.
- Use TypeScript with proper types; avoid `any`.
- Follow SOLID, DRY, and KISS principles pragmatically.
- Avoid overengineering, unnecessary abstractions, and dependencies.
- Remove unused imports, variables, and dead code.

### 2. Architecture & Components

- Use reusable components for repeated UI and logic.
- Keep components small and focused on one responsibility.
- Separate UI, business logic, API calls, and utilities.
- Prefer Server Components; use Client Components only when needed.
- Keep feature-specific code together.
- Use existing shared components before creating new ones.

### 3. UI & UX

- Build responsive, accessible, and consistent interfaces.
- Reuse existing design tokens, styles, and UI components.
- Include loading, empty, error, and success states where appropriate.
- Handle form validation and display meaningful error messages.
- Avoid unnecessary re-renders and premature optimization.

### 4. API & Security

- Centralize API requests and error handling.
- Validate external inputs and API responses where appropriate.
- Never expose secrets or sensitive data to the client.
- Enforce authentication and role-based permissions server-side.
- Do not rely on hidden UI elements for authorization.

### 5. Implementation Rules

- Understand existing code before making changes.
- Make minimal, focused changes.
- Do not modify unrelated files.
- Do not introduce new packages unless necessary.
- Do not duplicate existing functionality.
- Follow the installed Next.js documentation for version-specific APIs.

### 6. Verification (Mandatory)

After completing every task:

- Run ESLint and fix all introduced errors and warnings.
- Run TypeScript type checking and fix errors.
- Run relevant tests if available.
- Verify the affected functionality works.
- Run a production build when appropriate.
- Never claim verification passed unless commands actually ran.

### 7. Final Response

- Briefly summarize what changed.
- List verification commands and results.
- Mention any remaining issues or limitations.

<!-- END:nextjs-agent-rules -->
