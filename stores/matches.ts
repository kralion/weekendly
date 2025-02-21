import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Match, MatchStatus } from "~/types";
import { supabase } from "~/lib/supabase";

interface MatchesState {
  matches: Match[];
  activeMatch: Match | null;
  isLoading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  fetchUserMatches: (userId: string) => Promise<void>;
  addMatch: (match: Omit<Match, "id" | "created_at">) => Promise<void>;
  updateMatchStatus: (id: string, status: MatchStatus) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  setActiveMatch: (match: Match | null) => void;
  setMatches: (matches: Match[]) => void;
  getMatchesByStatus: (status: MatchStatus) => Match[];
  getUserMatches: (userId: string) => Match[];
}

export const useMatchesStore = create<MatchesState>()(
  persist(
    (set, get) => ({
      matches: [],
      activeMatch: null,
      isLoading: false,
      error: null,

      fetchMatches: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('matches')
            .select('*');

          if (error) throw error;
          set({ matches: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserMatches: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('matches')
            .select('*')
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

          if (error) throw error;
          set({ matches: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addMatch: async (match) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('matches')
            .insert([match])
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            matches: [...state.matches, data],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateMatchStatus: async (id, status) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('matches')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            matches: state.matches.map((match) =>
              match.id === id ? data : match
            ),
            activeMatch:
              state.activeMatch?.id === id ? data : state.activeMatch,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMatch: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set((state) => ({
            matches: state.matches.filter((match) => match.id !== id),
            activeMatch: state.activeMatch?.id === id ? null : state.activeMatch,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveMatch: (match) => set({ activeMatch: match }),
      setMatches: (matches) => set({ matches }),
      
      getMatchesByStatus: (status) => {
        return get().matches.filter((match) => match.status === status);
      },
      
      getUserMatches: (userId) => {
        return get().matches.filter(
          (match) => match.user1_id === userId || match.user2_id === userId
        );
      },
    }),
    {
      name: "weekendly-matches",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
