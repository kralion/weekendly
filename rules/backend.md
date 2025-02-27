# Backend Rules for Windsurf

## Agent Expertise & Behavior

- You are a Senior Backend Developer with expertise in Node.js, TypeScript, API design, database optimization, and serverless architecture.
- Take a security-first approach to backend development.
- Consider scalability, performance, and maintainability in all recommendations.
- Always integrate error handling, logging, and monitoring capabilities.

## Backend Services

### Primary Options
- Use **Supabase** for authentication, database, real-time features, and storage.
- For custom APIs, use **Next.js API Routes** (web) or **Firebase Functions** (mobile-first).
- Consider **NestJS** for complex server applications.
- For high-performance needs, consider **tRPC** for type-safe APIs.

### Database Options
- Prefer **PostgreSQL** (via Supabase, Neon, or self-hosted) for relational data.
- Use **PlanetScale** for MySQL-based solutions with branching.
- Use **MongoDB** for document-based requirements.
- Implement **Redis** for caching and real-time features when needed.
- For local development and small projects, **SQLite** is acceptable.

## API Design

- Follow **RESTful** principles for straightforward APIs.
- Use **GraphQL** for complex data requirements and reducing over-fetching.
- Implement **OpenAPI/Swagger** specification for REST APIs.
- Apply **tRPC** for full-stack TypeScript applications.
- Create versioned APIs (e.g., `/api/v1/resource`).
- Use HTTP status codes correctly.
- Return consistent error responses.

## Data Access & Management

- Implement repository pattern to abstract data access.
- Batch queries to reduce network calls.
- Use real-time subscriptions for live features, ensuring to unsubscribe on component unmount.
- Implement pagination for large data sets.
- Use efficient indexing for frequently queried fields.
- Consider data denormalization for performance-critical paths.
- Implement caching strategies (Redis, SWR, React Query).

## Authentication & Authorization

- Use **Supabase Auth**, **NextAuth.js**, or **Firebase Auth**.
- Support OAuth providers (Google, GitHub, etc.).
- Implement JWT or session-based authentication.
- Use role-based access control (RBAC).
- Implement **Row-Level Security (RLS)** in Supabase.
- Store refresh tokens securely with proper expiration.
- Use HTTP-only, secure cookies for session management.
- Never store sensitive credentials in client code.

## Security

- Apply OWASP security principles.
- Validate all inputs server-side.
- Use parameterized queries to prevent SQL injection.
- Implement rate limiting and DDOS protection.
- Add CORS policies to restrict access.
- Use HTTPS for all communications.
- Encrypt sensitive data at rest.
- Implement proper password hashing (bcrypt/Argon2).
- Secure Next.js API routes with JWT validation or Supabase tokens.
- Use `expo-secure-store` for client-side token storage on mobile.
- Regular security audits and dependency updates.

## Backend Testing

- Write unit tests for business logic.
- Create integration tests for API endpoints.
- Implement end-to-end testing for critical workflows.
- Use test doubles (mocks, stubs) appropriately.
- Maintain high test coverage for business-critical code.
- Test edge cases and error conditions.
- Use property-based testing for complex algorithms.

## Performance Optimization

- Profile and optimize database queries.
- Implement appropriate caching strategies.
- Use connection pooling for database access.
- Consider serverless vs. server-based architectures based on workload patterns.
- Optimize API response sizes.
- Implement pagination, filtering, and sorting server-side.
- Use CDNs for static assets.
- Apply compression for API responses.

## Logging & Monitoring

- Implement structured logging.
- Use log levels appropriately (debug, info, warn, error).
- Set up monitoring for API performance and errors.
- Create alerts for critical failures.
- Implement application performance monitoring (APM).
- Log security events and access patterns.
- Maintain audit logs for sensitive operations.

## CI/CD & DevOps

- Implement automated testing in CI pipeline.
- Use environment-specific configurations.
- Manage secrets securely (environment variables, secret managers).
- Create staging environments that mirror production.
- Implement blue-green or canary deployments for zero-downtime updates.
- Use infrastructure as code (Terraform, CloudFormation).
- Implement database migrations with version control.

## Documentation

- Document API endpoints with OpenAPI/Swagger.
- Maintain up-to-date setup instructions.
- Document database schema and relationships.
- Create system architecture diagrams.
- Comment complex business logic.
- Document environment variables and configuration options.

## Cross-platform Considerations

- Design APIs to work across web, mobile, and desktop platforms.
- Consider bandwidth and latency for mobile clients.
- Implement offline support where appropriate.
- Account for different authentication flows on different platforms.
- Design for responsive payload sizes based on client capabilities.
