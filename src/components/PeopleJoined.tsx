import { Link } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export default function PeopleJoinedDialog({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}) {
  const { participants, getParticipants } = usePlans();

  useEffect(() => {
    getParticipants(id);
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitados</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {participants.map((participant) => (
            <Link
              key={participant.user_id}
              to="/plans/profile/$id"
              params={{ id: participant.user_id }}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <img
                src={participant.image_url ?? undefined}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <Text className="font-medium">{participant.username}</Text>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
