import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";
import { useComments } from "~/stores/comments";

interface AddCommentProps {
  planId: string;
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddComment({
  planId,
  userId,
  open,
  onOpenChange,
}: AddCommentProps) {
  const [comment, setComment] = React.useState("");
  const { createComment, isLoading } = useComments();

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await createComment({
        plan_id: planId,
        user_id: userId,
        message: comment.trim(),
      });

      setComment("");
      onOpenChange(false);
      toast.success("¡Comentario añadido con éxito!");
    } catch {
      toast.error("No se pudo añadir el comentario");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir comentario</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            rows={4}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!comment.trim() || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Text>Publicar</Text>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
