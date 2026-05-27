# Weekendly

Web app for discovering and creating weekend plans. Built with TanStack Start, React, Tailwind CSS, Supabase, and Clerk.

## Tech Stack

- **Framework:** TanStack Start (Vite + React)
- **Routing:** TanStack Router (file-based)
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Database:** Supabase
- **State:** Zustand
- **Forms:** React Hook Form + Zod

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/     # React components
├── lib/            # Utilities (supabase, utils)
├── routes/         # TanStack Router file-based routes
├── server/         # Server functions (API logic)
├── stores/         # Zustand stores
├── styles/         # Global CSS
├── types/          # TypeScript types
├── router.tsx      # Router config
├── routeTree.gen.ts # Auto-generated route tree
└── start.tsx       # TanStack Start config
```

## Environment Variables

See `.env.example` for required variables.
