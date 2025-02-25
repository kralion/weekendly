import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner-native";
import { Invitation } from "@/types";

interface InvitationStore {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  // Actions
  getInvitationById: (invitationId: string) => Promise<Invitation | null>;
  getInvitationsByUserId: (userId: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
  createInvitation: (
    invitation: Omit<Invitation, "id" | "status">
  ) => Promise<void>;
}

export const useInvitations = create<InvitationStore>((set, get) => ({
  invitations: [],
  loading: false,
  error: null,

  getInvitationById: async (invitationId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", invitationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error("Error al obtener la invitación");
      console.error(error);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  getInvitationsByUserId: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ invitations: data || [] });
    } catch (error) {
      toast.error("Error al obtener las invitaciones");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  acceptInvitation: async (invitationId) => {
    try {
      set({ loading: true });

      // First get the invitation to get the plan_id and receiver_id
      const invitation = await get().getInvitationById(invitationId);
      if (!invitation) throw new Error("Invitación no encontrada");

      // Start a transaction using supabase
      const { error: updateInvitationError } = await supabase
        .from("invitations")
        .update({ status: "accepted" })
        .eq("id", invitationId);

      if (updateInvitationError) throw updateInvitationError;

      // Get current plan to check max participants
      const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("participants, max_participants")
        .eq("id", invitation.plan_id)
        .single();

      if (planError) throw planError;

      // Check if plan is full
      if (plan.participants.length >= plan.max_participants) {
        throw new Error("El plan está lleno");
      }

      // Add participant to plan
      const { error: updatePlanError } = await supabase
        .from("plans")
        .update({
          participants: [...plan.participants, invitation.receiver_id],
        })
        .eq("id", invitation.plan_id);

      if (updatePlanError) throw updatePlanError;

      // Update local state
      const invitations = get().invitations.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "accepted" } : inv
      );
      set({ invitations });

      toast.success("Te has unido al plan exitosamente");
    } catch (error: any) {
      if (error.message === "El plan está lleno") {
        toast.error(error.message);
      } else {
        toast.error("Error al aceptar la invitación");
      }
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  declineInvitation: async (invitationId) => {
    try {
      set({ loading: true });
      const { error } = await supabase
        .from("invitations")
        .update({ status: "declined" })
        .eq("id", invitationId);

      if (error) throw error;

      // Update local state
      const invitations = get().invitations.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "declined" } : inv
      );
      set({ invitations });
      toast.success("Invitación rechazada");
    } catch (error) {
      toast.error("Error al rechazar la invitación");
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
        status: "en espera",
      });

      if (error) throw error;
      toast.success("Invitación enviada");

      // Refresh invitations for the sender
      await get().getInvitationsByUserId(invitation.sender_id);
    } catch (error) {
      toast.error("Error al enviar la invitación");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));
