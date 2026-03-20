import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import "~/styles/global.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY. Set it in your .env"
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Weekendly" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <RootDocument>
        <ClerkLoaded>
          <Outlet />
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "w-full max-w-md",
              },
            }}
          />
        </ClerkLoaded>
      </RootDocument>
    </ClerkProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
