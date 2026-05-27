import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export const Route = createFileRoute("/plans/create")({
  component: CreatePlanPage,
});

function CreatePlanPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <Text className="text-2xl font-bold mb-4">Crear Plan</Text>
      <p className="text-muted-foreground mb-6">
        Formulario de creación de plan (por implementar)
      </p>
      <Button onClick={() => navigate({ to: "/" })}>Volver</Button>
    </div>
  );
}
