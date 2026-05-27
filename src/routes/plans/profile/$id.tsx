import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";

export const Route = createFileRoute("/plans/profile/$id")({
  component: ProfilePage,
});

function ProfilePage() {
  const { id } = Route.useParams();
  const { profile, fetchSpecificProfileById } = useProfiles();

  React.useEffect(() => {
    fetchSpecificProfileById(id);
  }, [id]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex flex-col items-center">
        <img
          src={profile.image_url ?? undefined}
          alt=""
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <Text className="text-2xl font-bold">@{profile.username}</Text>
        <Text className="text-muted-foreground">{profile.bio}</Text>
      </div>
    </div>
  );
}
