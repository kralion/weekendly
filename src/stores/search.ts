import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { Plan } from "~/types";

export interface SearchState {
  results: Plan[];
  loading: boolean;
  search: (search: {
    location?: string;
    date?: string;
    categories?: string[];
  }) => Promise<void>;
  setSearchToNull: () => void;
}

export const useSearch = create<SearchState>((set) => ({
  results: [],
  loading: false,
  search: async (search) => {
    set({ loading: true });
    let query = supabase.from("plans").select("*");

    if (search.location) {
      query = query.ilike("location", `%${search.location.trim()}%`);
    }

    if (search.date) {
      query = query.eq("date", new Date(search.date).toISOString());
    }

    if (search.categories && search.categories.length > 0) {
      query = query.overlaps("categories", search.categories);
    }

    const { data: results, error } = await query;

    if (error) {
      console.error("Search error:", error);
      set({ results: [], loading: false });
      return;
    }

    set({ results: results || [], loading: false });
  },
  setSearchToNull: () => set({ results: [] }),
}));
