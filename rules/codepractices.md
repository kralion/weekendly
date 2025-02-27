# Code Practices for Windsurf

## Agent Expertise & Behavior

- You are an expert in clean code principles, software architecture, and modern development workflows.
- Champion maintainable, readable, and testable code above all else.
- Provide specific, actionable feedback on code quality and structure.
- Follow established patterns when modifying existing code.

## TypeScript & Type Safety

- Use **TypeScript** with strict mode enabled for all projects.
- Define explicit types for all variables, parameters, and return values.
- Create interfaces for data structures and component props.
- Use generics to create reusable, type-safe components and functions.
- Prefer interfaces over types for object shapes.
- Avoid using `any` type; use `unknown` when type is truly indeterminate.
- Use type narrowing with type guards.
- Leverage TypeScript utility types (Pick, Omit, Partial, etc.).
- Create type-safe APIs with Zod for runtime validation.
- Use discriminated unions for state modeling.

## Functions & Components

- Create pure functions whenever possible.
- Keep functions small and focused on a single responsibility.
- Use function expressions with arrow syntax for consistency.
- Name functions descriptively with verb-first conventions.
- Prefix event handlers with "handle" (e.g., `handleSubmit`).
- Limit function parameters; use object destructuring for many parameters.
- For React components:
  - Use function components exclusively.
  - Avoid default exports; use named exports.
  - Split large components into smaller ones.
  - Use composition over inheritance.
  - Follow naming conventions: PascalCase for components, camelCase for hooks.

## State Management

- Use React's built-in state management (useState, useReducer) for simple state.
- Implement Zustand for global state management.
- Create separate stores for different domains/features.
- Use context sparingly for theme, auth, or global UI state.
- Keep state as local as possible.
- Normalize complex state shapes.
- Use immutable patterns for state updates.
- Implement selectors to prevent unnecessary rerenders.

## Error Handling

- Use try/catch blocks for async operations.
- Create custom error classes for domain-specific errors.
- Handle errors at appropriate levels of abstraction.
- Implement graceful fallbacks for error states.
- Log errors with context information.
- For React apps, use Error Boundaries.
- Never swallow errors silently.
- Provide user-friendly error messages.

## Code Organization

- Follow a consistent project structure across applications.
- Use feature-based or domain-driven folder organization.
- Group related files together.
- Keep folder nesting to a reasonable depth.
- Use barrel files (`index.ts`) to simplify imports.
- Use absolute imports with path aliases.
- Separate business logic from presentation.
- Create separate folders for hooks, utils, components, and API services.

## Version Control

- Use **Git** and **GitHub** for version control.
- Write meaningful commit messages following conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `chore:` for maintenance tasks
  - `refactor:` for code refactoring
  - `test:` for test-related changes
  - `style:` for styling changes
- Follow a feature-branch workflow with pull requests (PRs) for merges.
- Keep commits small and focused on a single change.
- Require at least one reviewer for PR approvals.
- Use GitHub Actions for CI/CD.
- Protect main branches with branch protection rules.

## Code Quality

- Enforce linting with **ESLint** and formatting with **Prettier**.
- Use **Husky** and **lint-staged** for pre-commit checks.
- Configure ESLint with appropriate rules for each project type.
- Apply consistent formatting across the codebase.
- Use TypeScript's strict mode for type checking.
- Implement a consistent import order.
- Use a consistent naming convention throughout the codebase.
- Follow established patterns in the existing codebase.
- Remove commented-out code; use version control instead.

## Documentation

- Add JSDoc comments for functions, interfaces, and complex logic.
- Include type information in comments for function parameters and return values.
- Document any non-obvious behavior or workarounds.
- Maintain a `README.md` with setup instructions and architecture overview.
- Create architecture diagrams for complex systems.
- Document API endpoints with OpenAPI/Swagger.
- Add comments explaining "why", not "what" (code should be self-documenting for "what").

## Testing

- Write unit tests for pure functions and utility helpers.
- Create component tests focusing on behavior, not implementation.
- Implement integration tests for critical user flows.
- Use end-to-end tests for validating complete features.
- Follow the testing pyramid: more unit tests, fewer E2E tests.
- Use testing libraries appropriate for the platform:
  - For web: Vitest, React Testing Library, Cypress
  - For mobile: Jest, Testing Library, Detox
- Aim for high test coverage on critical business logic.
- Create test fixtures and factory functions for test data.
- Mock external dependencies appropriately.

## Performance Optimization

- Use memoization for expensive computations.
- Implement virtualization for long lists.
- Optimize bundle size with code splitting.
- Use performance monitoring tools.
- Lazy load non-critical components and routes.
- Optimize images and media assets.
- Minimize re-renders in React applications.
- Use appropriate data structures and algorithms for performance-critical code.
- Implement pagination for large data sets.

## Deployment & CI/CD

- Deploy web projects to **Vercel**, **Netlify**, or **AWS Amplify**.
- Deploy mobile apps via **Expo EAS** or native builds.
- Set up CI/CD with **GitHub Actions**.
- Implement staging and production environments.
- Use environment variables for configuration.
- Automate testing in the CI pipeline.
- Configure proper caching strategies.
- Implement progressive rollouts for critical updates.

## Security

- Follow OWASP security guidelines.
- Validate all inputs.
- Implement proper authentication and authorization.
- Store secrets securely (not in source code).
- Keep dependencies updated.
- Use security scanning tools in CI/CD.
- Apply the principle of least privilege.
- Implement proper CORS policies.
- Use HTTPS for all communications.

## Continuous Improvement

- Conduct code reviews for all PRs.
- Allocate time for refactoring and technical debt reduction.
- Stay updated with platform and framework changes.
- Experiment with new features in side projects.
- Share knowledge across the team.
- Establish and follow coding standards.
- Perform regular retrospectives to improve processes.
- Create learning opportunities for all team members.
