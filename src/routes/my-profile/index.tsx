import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export const Route = createFileRoute("/my-profile/")({
  component: MyProfilePage,
});

function MyProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <Text className="text-2xl font-bold mb-4">Mi Perfil</Text>
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <Text className="text-xl font-semibold">{user?.firstName} {user?.lastName}</Text>
          <Text className="text-muted-foreground">@{user?.username}</Text>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={() => navigate({ to: "/my-profile/edit" })}>
          Editar perfil
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/my-profile/my-plans" })}>
          Mis planes
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/my-profile/matches" })}>
          Matches
        </Button>
      </div>
    </div>
  );
}
