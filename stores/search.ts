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
        // Ensure the date is in the correct format
        query = query.eq("date", new Date(search.date).toISOString());
    }

    if (search.categories && search.categories.length > 0) {
        // Use overlaps if you want to find any matching categories
        query = query.overlaps("categories", search.categories);
    }

    const { data: results, error } = await query;

    if (error) {
        console.error("Search error:", error);
        set({ results: [], loading: false });
        return; // Optionally return here to stop further execution
    }

    set({ results: results || [], loading: false });
},



  setSearchToNull: () => set({ results: [] }),
}));
