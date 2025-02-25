import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner-native";
import { Invitation } from "@/types";

interface InvitationStore {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  // Actions
  getInvitationsByUserId: (userId: string) => Promise<void>;
  markAsRead: (invitationId: string) => Promise<void>;
  createInvitation: (
    invitation: Omit<Invitation, "id" | "status">
  ) => Promise<void>;
}

export const useInvitations = create<InvitationStore>((set, get) => ({
  invitations: [],
  loading: false,
  error: null,

  getInvitationsByUserId: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("invitations")
        .select(
          `
          *,
          sender:profiles!invitations_sender_id_fkey(*),
          receiver:profiles!invitations_receiver_id_fkey(*)
        `
        )
        .eq("status", "unread")
        .or(`receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ invitations: data });
    } catch (error) {
      toast.error("Error al obtener las invitaciones");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (invitationId) => {
    try {
      set({ loading: true });

      // Delete the invitation after marking as read
      const { error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;

      // Update local state
      const invitations = get().invitations.filter(
        (inv) => inv.id !== invitationId
      );
      set({ invitations });

      toast.success("Invitación marcada como leída");
    } catch (error) {
      toast.error("Error al marcar la invitación como leída");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createInvitation: async (invitation) => {
    try {
      set({ loading: true });
      const { error } = await supabase.from("invitations").insert({
        ...invitation,
        status: "unread",
      });

      if (error) throw error;
      toast.success("Invitación enviada");
    } catch (error) {
      toast.error("Error al enviar la invitación");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
