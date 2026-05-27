import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Crear cuenta</h1>
        <p className="text-center text-muted-foreground">
          Regístrate en Weekendly
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/auth/sign-in" className="text-primary font-semibold underline">
            Ya tengo cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
