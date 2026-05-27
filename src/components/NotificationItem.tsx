import { Link } from "@tanstack/react-router";
import React from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Invitation } from "~/types";

export default function NotificationItem({
  notification,
  onAccept,
  onReject,
}: {
  notification: Invitation;
  index: number;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Link to="/plans/profile/$id" params={{ id: notification.sender_id }}>
          <img
            src={notification.sender?.image_url ?? undefined}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <div>
          <Text className="font-medium">
            {notification.sender?.username} te invitó a un plan
          </Text>
          <Text className="text-sm text-muted-foreground">
            {notification.message}
          </Text>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onReject}>
          Rechazar
        </Button>
        <Button size="sm" onClick={onAccept}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
