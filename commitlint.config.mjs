/**
 * Conventional Commits Configuration
 *
 * Enforces structured, meaningful commit messages across the team:
 * Format: <type>(<optional scope>): <description>
 *
 * Examples:
 *   feat: add user authentication flow
 *   fix(api): handle 401 token refresh loops
 *   docs: update README with commit rules
 *   refactor(stores): simplify auth store selectors
 */
const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Formatting, missing semicolons, white-space
        "refactor", // Code refactoring without bug fixes or new features
        "perf", // Performance improvements
        "test", // Adding or updating tests
        "build", // Build system, dependency changes (npm, etc.)
        "ci", // CI/CD configurations
        "chore", // Maintenance tasks, config tweaks
        "revert", // Reverting previous commits
      ],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "subject-case": [0], // Allow any case for flexibility
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
  },
};

export default commitlintConfig;
