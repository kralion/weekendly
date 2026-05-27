import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { usePlans } from "~/stores";
import { useInvitations } from "~/stores/useInvitations";
import { Plan } from "~/types";

export default function InviteDialog({
  open,
  onOpenChange,
  id,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}) {
  const [message, setMessage] = React.useState("");
  const { createInvitation, loading } = useInvitations();
  const [data, setData] = React.useState<Plan | null>(null);
  const { getPlanById } = usePlans();
  const { user } = useUser();

  useEffect(() => {
    if (id) getPlanById(id).then(setData);
  }, [id]);

  const handleInvite = async () => {
    if (!user) {
      toast.error("Selecciona un usuario para invitar");
      return;
    }

    await createInvitation({
      sender_id: user.id,
      plan_id: id,
      receiver_id: data?.creator_id as string,
      message,
      created_at: new Date(),
    });
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitud</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Mensaje de solicitud ..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        <Button size="lg" className="rounded-full mt-4" onClick={handleInvite}>
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Text>Enviar</Text>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
