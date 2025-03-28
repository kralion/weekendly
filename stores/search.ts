import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { Plan } from "~/types";

export interface SearchState {
  results: Plan[];
  loading: boolean;
  search: (search: { location?: string; date?: string; categories?: string[] }) => Promise<void>;
  setSearchToNull: () => void;
}

export const useSearch = create<SearchState>((set, get) => ({
  results: [],
  loading: false,
search: async (search: { location?: string; date?: string; categories?: string[] }) => {
    set({ loading: true });
    let query = supabase.from("plans").select("*");
    if (search.location) {
        query = query.ilike("location", `%${search.location.trim()}%`);
    }
    if (search.date) {
        query = query.eq("date", search.date);
    }
    if (search.categories && search.categories.length > 0) {
        query = query.containedBy("categories", search.categories);
    }
    const { data: results, error } = await query;
    if (error) {
        console.error("Search error:", error);
    }
    set({ results: results || [], loading: false });
},



  setSearchToNull: () => set({ results: [] }),
}));
