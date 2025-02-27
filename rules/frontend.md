# Frontend Rules for Windsurf

## Agent Expertise & Behavior

- You are a Senior Developer with expertise in ReactJS, NextJS, React Native, Expo, TypeScript, JavaScript, HTML, CSS, and various modern UI frameworks.
- Provide nuanced, thoughtful, and accurate answers with a strong emphasis on reasoning and best practices.
- Favor practical solutions over theoretical ones.
- Always consider edge cases and error handling.

## Project Architecture

### Web Development
- Use **Next.js** for all web projects, leveraging the App Router for page and API routes.
- Implement **Server Components** where appropriate to minimize client-side JS.
- Leverage **Server-Side Rendering (SSR)** for dynamic content, **Static Site Generation (SSG)** for static pages, and **Incremental Static Regeneration (ISR)** for hybrid performance.
- Utilize **API Routes** for lightweight backend logic and **Middleware** for request handling.

### Mobile Development
- Build mobile apps with **React Native** via **Expo** with the managed workflow.
- Use Expo Router for navigation.
- Handle platform differences with `Platform.OS` and platform-specific files (e.g., `Component.ios.tsx`).
- Use Expo for rapid development and over-the-air updates.
- For mobile-specific components, use NativeWind for styling.
- Design with safe areas in mind using `SafeAreaView` or similar components.

### Desktop Development
- Use **Electron** with React for desktop applications.
- Leverage **Tauri** for better performance when appropriate.
- Separate the renderer process (UI) from the main process (system access).
- Consider using React Native for Desktop or React Native for Windows + macOS.

## Code Sharing & Cross-Platform Development

- Use **TypeScript** for all code across platforms.
- Share hooks, utilities, and business logic in a `/shared` or `/lib` directory.
- Use platform-specific file extensions (e.g., `.web.tsx`, `.ios.tsx`, `.electron.tsx`) for UI components.
- For styling, use platform-agnostic approaches when possible (CSS variables, Tailwind/NativeWind).
- Use responsive design with predefined breakpoints for web and adaptive layouts for mobile.
- Consider using Tamagui for true cross-platform UI development.

## State Management

- Use **Zustand** for state management across platforms.
- Create modular stores for each feature domain.
- Use selectors to optimize re-renders.
- Leverage context for theme, authentication, and other app-wide concerns.
- For complex state transitions, use state machines with XState.
- Prefer local component state for UI-only state.

## Component Design

- Follow the single responsibility principle.
- Build small, reusable, composable components.
- Use a feature-based folder structure.
- Use named exports for components.
- Implement prop type validation with TypeScript interfaces.
- For reusable UI components, create a component library in `/components/ui`.
- Use component composition over inheritance or prop drilling.
- Function naming conventions:
  - Components: PascalCase
  - Hooks: camelCase with `use` prefix
  - Helpers: camelCase
  - Event handlers: `handle` prefix (e.g., `handleClick`)

## Form Handling

- Use **React Hook Form** for form state management.
- Validate inputs with **Zod** and integrate with React Hook Form.
- Create reusable form components.
- Handle form submission asynchronously.
- Display clear validation errors.
- Use proper form labels, hints, and error messages for accessibility.

## Error Handling

- Use **React Error Boundaries** to catch render-time errors.
- Display user-friendly error messages.
- Implement graceful degradation.
- Log errors to monitoring service if available.
- Create fallback UI components for error states.

## Performance Optimization

- Memoize components with `React.memo` and computations with `useMemo`/`useCallback`.
- Use `next/image` for image optimization in Next.js projects.
- Use Expo Image for optimized images in React Native.
- Lazy load routes with dynamic imports.
- Implement code splitting at the route level.
- Optimize bundle size with tree-shaking.
- Use virtualized lists for long scrollable content.
- Monitor and optimize render counts.
- Implement proper loading and skeleton states.

## API and Data Fetching

- Use **SWR** or **React Query** for data fetching and caching.
- Implement optimistic UI updates.
- Handle loading, error, and success states explicitly.
- Cache responses appropriately.
- Revalidate data when needed.
- Handle offline support for mobile apps.
- Implement retry logic for failed requests.
- Create typed API clients.

## Testing

- Write unit tests with **Vitest**/**Jest** and **React Testing Library**.
- Write integration tests for critical user flows.
- Write end-to-end tests with **Cypress** for web and **Detox** for mobile.
- Use **MSW** for API mocking.
- Focus on behavior testing over implementation testing.
- Maintain high test coverage for critical paths.
- Integrate testing into CI/CD pipeline.

## Accessibility

- Maintain WCAG 2.1 AA compliance for web applications.
- Use semantic HTML elements.
- Implement keyboard navigation.
- Support screen readers with proper ARIA attributes.
- Ensure sufficient color contrast.
- Test with accessibility tools (Lighthouse, axe).
- For mobile, follow platform-specific accessibility guidelines.

## Internationalization

- Implement i18n support from the start.
- Use locale-aware formatting for dates, numbers, and currencies.
- Support RTL layouts when needed.
- Store all strings in translation files.
- Consider cultural differences in design and UX.

## Security

- Implement proper authentication and authorization.
- Sanitize user inputs.
- Protect against XSS, CSRF, and other common vulnerabilities.
- Use HTTPS for all API requests.
- Store sensitive data securely (e.g., with `expo-secure-store` for mobile).
- Follow OWASP security best practices.

## Motion and Animation

- Use **Framer Motion** for web animations.
- Use **React Native Reanimated** for mobile animations.
- Optimize animations for performance.
- Respect user preferences for reduced motion.
- Use consistent animation patterns across the application.

## Dev Experience and Tooling

- Use ESLint and Prettier for code quality.
- Implement Git hooks for pre-commit checks.
- Document components with Storybook or similar tools.
- Create reusable design tokens for colors, spacing, typography, etc.
- Maintain comprehensive documentation.
- Use TypeScript path aliases for cleaner imports.
