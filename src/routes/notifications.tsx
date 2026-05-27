import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useInvitations } from "~/stores/useInvitations";
import { Invitation } from "~/types";
import NotificationItem from "~/components/NotificationItem";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const {
    invitations,
    getInvitationsByUserId,
    acceptInvitation,
    rejectInvitation,
  } = useInvitations();
  const [selectedNotification, setSelectedNotification] = React.useState<Invitation | null>(null);
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const navigate = useNavigate();

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    getInvitationsByUserId(user?.id as string);
    setRefreshing(false);
  }, [user?.id]);

  React.useEffect(() => {
    getInvitationsByUserId(user?.id as string);
  }, [user?.id]);

  const handleAcceptInvitation = (notification: Invitation) => {
    acceptInvitation(notification.id);
    setSelectedNotification(null);
  };

  const handleRejectInvitation = (notification: Invitation) => {
    rejectInvitation(notification.id);
    setSelectedNotification(null);
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <div className="px-6 py-4 flex items-center md:mx-auto md:w-1/2">
        <Button variant="secondary" size="icon" className="rounded-full" onClick={() => navigate({ to: "/" })}>
          <ChevronLeft size={24} className="text-primary" />
        </Button>
        <Text className="text-xl font-semibold ml-4 md:text-2xl">Notificaciones</Text>
      </div>

      <div className="px-8 py-4 md:mx-auto md:w-1/2">
        {invitations.length > 0 ? (
          invitations.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <NotificationItem
                notification={notification}
                index={index}
                onAccept={() => handleAcceptInvitation(notification)}
                onReject={() => handleRejectInvitation(notification)}
              />
              <Separator />
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 md:p-16">
            <Text className="text-muted-foreground text-center md:text-lg">
              No tienes notificaciones nuevas
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
