import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Plan, Profile } from "@/types";
import { toast } from "sonner-native";
import { router } from "expo-router";

interface PlansState {
  plans: Plan[];
  userPlans: Plan[];
  participants: Profile[];
  getPlanById: (id: string) => Promise<Plan | null>;
  loading: boolean;
  setFilteredPlans: (plans: Plan[]) => void;
  selectedPlan: Plan | null;
  filteredPlans: Plan[];
  selectedCategory: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  fetchPlans: () => Promise<void>;
  fetchUserPlans: (userId: string) => Promise<void>;
  fetchPlanById: (id: string) => Promise<void>;
  createPlan: (plan: Omit<Plan, "id">) => Promise<Plan>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  joinPlan: (planId: string, userId: string) => Promise<void>;
  leavePlan: (planId: string, userId: string) => Promise<void>;
  setSelectedPlan: (plan: Plan | null) => void;
  getParticipants: (planId: string) => Promise<void>;
  reportPlan: (planId: string) => Promise<void>;
}

export const usePlans = create<PlansState>((set, get) => ({
  plans: [],
  participants: [],
  userPlans: [],
  loading: false,
  selectedPlan: null,
  filteredPlans: [],
  setFilteredPlans: (plans: Plan[]) => {
    set({ filteredPlans: plans });
  },
  selectedCategory: null,
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const { plans } = get();

    if (!query.trim()) {
      // If search is cleared, revert to category filtering if any
      const { selectedCategory } = get();
      if (selectedCategory) {
        get().setSelectedCategory(selectedCategory);
      }
      return;
    }

    // Clear category selection when searching
    set({ selectedCategory: null });

    // Filter and sort plans by relevance
    const filtered = plans
      .filter((plan) => {
        const titleMatch = plan.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const descriptionMatch = plan.description
          .toLowerCase()
          .includes(query.toLowerCase());
        const locationMatch = plan.location
          .toLowerCase()
          .includes(query.toLowerCase());
        const categoryMatch = plan.categories.some((cat) =>
          cat.toLowerCase().includes(query.toLowerCase())
        );

        return titleMatch || descriptionMatch || locationMatch || categoryMatch;
      })
      .sort((a, b) => {
        // Calculate relevance score
        const getScore = (plan: Plan) => {
          let score = 0;
          const lowerQuery = query.toLowerCase();

          // Title matches are most important
          if (plan.title.toLowerCase().includes(lowerQuery)) score += 10;
          if (plan.title.toLowerCase().startsWith(lowerQuery)) score += 5;

          // Description matches
          if (plan.description.toLowerCase().includes(lowerQuery)) score += 3;

          // Location matches
          if (plan.location.toLowerCase().includes(lowerQuery)) score += 2;

          // Category matches
          if (
            plan.categories.some((cat) =>
              cat.toLowerCase().includes(lowerQuery)
            )
          )
            score += 1;

          return score;
        };

        return getScore(b) - getScore(a);
      });

    set({ filteredPlans: filtered });
  },
  setSelectedCategory: (category) => {
    // If there's a search query, clear it
    const { searchQuery } = get();
    if (searchQuery) {
      set({ searchQuery: "" });
    }

    set({ selectedCategory: category });
    const { plans } = get();

    const categoryName =
      category === "1"
        ? "Música"
        : category === "2"
        ? "Arte"
        : category === "3"
        ? "Deportes"
        : category === "4"
        ? "Cine"
        : category === "5"
        ? "Teatro"
        : category === "6"
        ? "Lectura"
        : category === "7"
        ? "Ocio"
        : "Eventos";

    const filtered = plans.filter((plan) =>
      plan.categories.includes(categoryName)
    );

    set({ filteredPlans: filtered });
  },
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
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
      // Filter for Música by default
      const filtered = data.filter((plan) => {
        const matchesCategory = plan.categories.includes("Música");
        const matchesSearch = plan.title
          .toLowerCase()
          .includes(get().searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
      set({ filteredPlans: filtered });
    } catch (error) {
      toast.error("Error al cargar planes");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getParticipants: async (planId: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in(
          "user_id",
          (
            await supabase.from("plans").select("participants").eq("id", planId)
          ).data?.[0]?.participants
        );
      if (error) throw error;
      set({ participants: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getPlanById: async (id: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("plans")
        .select("*, profiles:creator_id(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
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
        date: plan.date.toISOString(), // Convert Date to ISO string for Supabase
        status: "activo" as const,
      };

      const { data, error } = await supabase
        .from("plans")
        .insert(newPlan)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("No se pudo crear el plan");
      }

      set((state) => ({
        plans: [...state.plans, data],
        userPlans: [...state.userPlans, data],
      }));
      
      toast.success("Plan creado exitosamente");
      router.back();
      return data;
    } catch (error) {
      console.error("Error creating plan:", error);
      const message = error instanceof Error ? error.message : "Error al crear plan";
      toast.error(message);
      throw error; // Re-throw to handle in component
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
      toast.success("Saliste del plan");
    } catch (error) {
      toast.error("Error al abandonar el plan");
      console.error(error);
    }
  },

  reportPlan: async (planId: string) => {
    try {
      set({ loading: true });
      
      const { data: currentPlan, error: fetchError } = await supabase
        .from("plans")
        .select("reports")
        .eq("id", planId)
        .single();

      if (fetchError) throw fetchError;

      const currentReports = currentPlan?.reports || 0;
      
      const { error: updateError } = await supabase
        .from("plans")
        .update({ reports: currentReports + 1 })
        .eq("id", planId);

      if (updateError) throw updateError;

      // Update the local plan state
      const plans = get().plans;
      const updatedPlans = plans.map(plan => 
        plan.id === planId 
          ? { ...plan, reports: (plan.reports || 0) + 1 }
          : plan
      );
      set({ plans: updatedPlans });

    } catch (error) {
      console.error("Error reporting plan:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
