import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Plan } from "@/types";
import { toast } from "sonner-native";

interface PlansState {
  plans: Plan[];
  userPlans: Plan[];
  loading: boolean;
  selectedPlan: Plan | null;
  fetchPlans: () => Promise<void>;
  fetchUserPlans: (userId: string) => Promise<void>;
  fetchPlanById: (id: string) => Promise<void>;
  createPlan: (
    plan: Omit<
      Plan,
      "id" | "status" | "participants" | "created_at" | "updated_at"
    >
  ) => Promise<void>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  joinPlan: (planId: string, userId: string) => Promise<void>;
  leavePlan: (planId: string, userId: string) => Promise<void>;
  setSelectedPlan: (plan: Plan | null) => void;
}

export const usePlans = create<PlansState>((set, get) => ({
  plans: [],
  userPlans: [],
  loading: false,
  selectedPlan: null,

  fetchPlans: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("plans")
        .select("*, profiles:creator_id(*)")
        .eq("status", "activo")
        .order("date", { ascending: true });

      if (error) throw error;
      set({ plans: data });
    } catch (error) {
      toast.error("Error al cargar planes");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserPlans: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .or(`creator_id.eq.${userId},participants.cs.{${userId}}`)
        .order("date", { ascending: true });

      if (error) throw error;
      set({ userPlans: data });
    } catch (error) {
      toast.error("Error al cargar tus planes");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchPlanById: async (id) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      set({ selectedPlan: data });
    } catch (error) {
      toast.error("Error al cargar plan");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createPlan: async (plan) => {
    try {
      const newPlan = {
        ...plan,
        status: "activo" as const,
        participants: [],
      };

      const { data, error } = await supabase
        .from("plans")
        .insert(newPlan)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        plans: [...state.plans, data],
        userPlans: [...state.userPlans, data],
      }));
      toast.success("Plan creado exitosamente");
    } catch (error) {
      toast.error("Error al crear plan");
      console.error(error);
    }
  },

  updatePlan: async (id, plan) => {
    try {
      const { data, error } = await supabase
        .from("plans")
        .update(plan)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? data : p)),
        userPlans: state.userPlans.map((p) => (p.id === id ? data : p)),
        selectedPlan: data,
      }));
      toast.success("Plan actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar plan");
      console.error(error);
    }
  },

  deletePlan: async (id) => {
    try {
      const { error } = await supabase.from("plans").delete().eq("id", id);

      if (error) throw error;

      set((state) => ({
        plans: state.plans.filter((p) => p.id !== id),
        userPlans: state.userPlans.filter((p) => p.id !== id),
        selectedPlan: null,
      }));
      toast.success("Plan eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar plan");
      console.error(error);
    }
  },

  joinPlan: async (planId, userId) => {
    try {
      const plan = get().plans.find((p) => p.id === planId);
      if (!plan) throw new Error("Plan no encontrado");

      if (plan.participants.includes(userId)) {
        toast.error("Ya estás participando en este plan");
        return;
      }

      if (plan.participants.length >= plan.max_participants) {
        toast.error("El plan está lleno");
        return;
      }

      const { data, error } = await supabase
        .from("plans")
        .update({
          participants: [...plan.participants, userId],
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        plans: state.plans.map((p) => (p.id === planId ? data : p)),
        userPlans: [...state.userPlans, data],
        selectedPlan: data,
      }));
      toast.success("Te has unido al plan exitosamente");
    } catch (error) {
      toast.error("Error al unirse al plan");
      console.error(error);
    }
  },

  leavePlan: async (planId, userId) => {
    try {
      const plan = get().plans.find((p) => p.id === planId);
      if (!plan) throw new Error("Plan no encontrado");

      if (!plan.participants.includes(userId)) {
        toast.error("No estás participando en este plan");
        return;
      }

      const { data, error } = await supabase
        .from("plans")
        .update({
          participants: plan.participants.filter((id) => id !== userId),
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        plans: state.plans.map((p) => (p.id === planId ? data : p)),
        userPlans: state.userPlans.filter((p) => p.id !== planId),
        selectedPlan: data,
      }));
      toast.success("Has abandonado el plan exitosamente");
    } catch (error) {
      toast.error("Error al abandonar el plan");
      console.error(error);
    }
  },

  setSelectedPlan: (plan) => {
    set({ selectedPlan: plan });
  },
}));
