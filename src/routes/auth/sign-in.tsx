import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Bienvenido</h1>
        <p className="text-center text-muted-foreground">
          Inicia sesión en tu cuenta de Weekendly
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/auth/sign-up" className="text-primary font-semibold underline">
            Crea una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
