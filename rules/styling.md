# Styling Rules for Windsurf

## Agent Expertise & Behavior

- You are an expert in modern styling approaches across web, mobile, and desktop platforms.
- Maintain a strong focus on accessibility, performance, and design consistency.
- Provide platform-specific styling solutions when necessary.
- Always consider responsive design, dark mode support, and internationalization.

## Cross-Platform Styling Strategies

### Web Development
- Use **Tailwind CSS** as the primary styling approach for web applications.
- Leverage **Shadcn UI** components customized with Tailwind.
- Use CSS variables for theming and maintaining consistency.
- For advanced needs, use **Radix UI** primitives combined with Tailwind.

### Mobile Development
- Use **NativeWind** to apply Tailwind-like styling in React Native.
- Apply platform-specific styles using `Platform.select` or `.ios/.android` file extensions.
- Use responsive utilities like `useWindowDimensions` to adapt to different screen sizes.
- Leverage `expo-navigation-bar` and `expo-status-bar` for full-screen experiences.

### Desktop Development
- For Electron, use web styling approaches (Tailwind CSS).
- For Tauri, consider using CSS modules or styled-components.
- Account for platform-specific behaviors and appearance expectations.

## Design System Implementation

- Create reusable design tokens for:
  - Colors (primary, secondary, neutral, semantic, etc.)
  - Typography (font families, sizes, weights, line heights)
  - Spacing (consistent spacing scale)
  - Borders and shadows
  - Animation timings and easing functions
  - Breakpoints for responsive design
- Implement tokens as CSS/Tailwind variables or in a shared configuration.
- Document the design system thoroughly.

## Component Styling Best Practices

- Compose UI from small, reusable components.
- Use Tailwind/NativeWind's utility-first approach for most styling needs.
- Maintain consistent spacing with a defined spacing scale.
- Use CSS Grid and Flexbox for layouts.
- Use relative units (rem, em) over fixed units (px) where appropriate.
- For web, implement fluid typography with clamp() when appropriate.
- For mobile, avoid fixed dimensions that don't adapt to different screens.

## Responsive Design

### Web
- Implement a mobile-first approach.
- Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.).
- Test on multiple device sizes and browsers.
- Use container queries for component-specific responsiveness.
- Consider using CSS Grid areas for major layout changes between breakpoints.

### Mobile
- Use Flex layouts with proper flex properties.
- Test on both iOS and Android devices with different screen sizes.
- Use `SafeAreaView` consistently for edge content.
- Implement adaptive layouts using percentage-based dimensions.
- For Expo web support, use Web-specific styling with `web:` prefix in NativeWind.

## Dark Mode & Theming

- Support light and dark mode in all applications.
- Create semantic color tokens (e.g., `primary`, not `blue`).
- Use CSS variables or context-based theming for dynamic theme switching.
- For web, support `prefers-color-scheme` media query.
- For mobile, follow platform conventions and user settings.
- Test theme transitions for smoothness and completeness.
- Provide high-contrast theme options for accessibility.

## Animation & Transitions

- Use CSS transitions for simple animations on web.
- Use **Framer Motion** for complex web animations.
- Implement **React Native Reanimated** for performant mobile animations.
- Keep animations subtle and purposeful.
- Respect `prefers-reduced-motion` settings.
- Use consistent timing and easing functions.
- Implement skeleton loaders for content loading states.

## Accessibility in Styling

- Maintain WCAG 2.1 AA compliance.
- Ensure sufficient color contrast (minimum 4.5:1 for normal text).
- Use semantic HTML elements on web.
- Implement focus indicators for interactive elements.
- Ensure touch targets are at least 44x44px on mobile.
- Support dynamic text sizing for users with vision impairments.
- Test with screen readers and keyboard navigation.

## Performance Optimization

- Keep CSS bundle size minimal by using utility-first CSS.
- Avoid unnecessary nesting in CSS.
- Use CSS containment where appropriate.
- Optimize transitions and animations for performance.
- Reduce unnecessary rerenders from style changes.
- Monitor and optimize Cumulative Layout Shift (CLS).
- Use `will-change` CSS property sparingly and intentionally.

## Typography

- Implement a clear typographic hierarchy.
- Limit font families and weights to minimize bundle size.
- Use relative units for font sizes to support user preferences.
- Implement proper line heights for readability.
- Set appropriate letter-spacing and word-spacing.
- Ensure proper font fallbacks.
- For web, use `font-display: swap` for performance.

## Cross-Browser & Cross-Platform Consistency

- Test on multiple browsers and devices.
- Use autoprefixer or similar tools for vendor prefixes.
- Implement polyfills for newer CSS features when necessary.
- Document known platform-specific styling issues.
- Use reset or normalize CSS for consistent starting points.

## Icons & Images

- Use SVG icons when possible for scalability.
- Implement proper sizing and touch targets for interactive icons.
- Optimize images with appropriate formats and compression.
- Use responsive images with srcset on web.
- Implement proper loading strategies (lazy loading, etc.).
- Provide alt text for all images.

## Practical Implementation

- For reusable components, define variants using classNames or cn utility.
- Create prop-based styling variations for components.
- Use composition over complex conditional styling.
- Leverage CSS-in-JS or CSS Modules for component-specific styles when Tailwind is insufficient.
- Document styling patterns and component usage.
- Create a component library or storybook for reference.
