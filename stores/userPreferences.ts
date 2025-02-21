import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "~/types";
import { supabase } from "~/lib/supabase";

interface UserPreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchPreferences: (userId: string) => Promise<void>;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (
    userId: string,
    preferences: Partial<UserPreferences>
  ) => Promise<void>;
  clearPreferences: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      preferences: null,
      isLoading: false,
      error: null,

      fetchPreferences: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("user_preferences")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (error) throw error;
          set({ preferences: data });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      setPreferences: (preferences) => set({ preferences }),

      updatePreferences: async (
        userId: string,
        preferences: Partial<UserPreferences>
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("user_preferences")
            .update(preferences)
            .eq("user_id", userId)
            .select()
            .single();

          if (error) throw error;
          set({ preferences: data });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      clearPreferences: () => set({ preferences: null, error: null }),
    }),
    {
      name: "weekendly-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
