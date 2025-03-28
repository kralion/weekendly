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
  rejectInvitation: (invitationId: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
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
        .eq("status", "pending")
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

  rejectInvitation: async (invitationId) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from("invitations")
        .update({ status: "rejected" })
        .eq("id", invitationId);

      if (error) throw error;
      toast.success("Invitación rechazada");
      get().getInvitationsByUserId(invitationId);
    } catch (error) {
      toast.error("Error al rechazar la invitación");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  acceptInvitation: async (invitationId) => {
    try {
      set({ loading: true });
      const invitation = get().invitations.find(
        (invitation) => invitation.id === invitationId
      );
      if (!invitation) {
        throw new Error("Invitación no encontrada");
      }
      const { error } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);
      const { error: error2, data: plan } = await supabase
        .from("plans")
        .select("participants")
        .eq("id", invitation.plan_id)
        .single();
      if (error2) throw error2;
      const { error: error3 } = await supabase
        .from("plans")
        .update({
          participants: [...plan.participants, invitation.sender_id],
        })
        .eq("id", invitation.plan_id);
      if (error || error2) throw error || error2;
      toast.success("Invitación aceptada");
      get().getInvitationsByUserId(invitationId);
    } catch (error) {
      toast.error("Error al aceptar la invitación");
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
        status: "pending",
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
