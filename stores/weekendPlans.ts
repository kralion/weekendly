import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WeekendPlan } from "~/types";
import { supabase } from "~/lib/supabase";

interface WeekendPlansState {
  plans: WeekendPlan[];
  activePlan: WeekendPlan | null;
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchUserPlans: (userId: string) => Promise<void>;
  addPlan: (plan: Omit<WeekendPlan, "id" | "created_at">) => Promise<void>;
  updatePlan: (id: string, plan: Partial<WeekendPlan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  setActivePlan: (plan: WeekendPlan | null) => void;
  setPlans: (plans: WeekendPlan[]) => void;
}

export const useWeekendPlansStore = create<WeekendPlansState>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlan: null,
      isLoading: false,
      error: null,

      fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("weekend_plans")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ plans: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserPlans: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("weekend_plans")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) throw error;
          set({ plans: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addPlan: async (plan) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("weekend_plans")
            .insert(plan)
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            plans: [data, ...state.plans],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePlan: async (id, plan) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("weekend_plans")
            .update(plan)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            plans: state.plans.map((p) => (p.id === id ? data : p)),
            activePlan: state.activePlan?.id === id ? data : state.activePlan,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deletePlan: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("weekend_plans")
            .delete()
            .eq("id", id);

          if (error) throw error;
          set((state) => ({
            plans: state.plans.filter((p) => p.id !== id),
            activePlan: state.activePlan?.id === id ? null : state.activePlan,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      setActivePlan: (plan) => set({ activePlan: plan }),
      setPlans: (plans) => set({ plans }),
    }),
    {
      name: "weekendly-plans",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
