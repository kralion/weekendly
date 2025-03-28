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
    const categoriesQuery = search.categories
      ? `categories && array['${search.categories.join("','")}'::text[]]`
      : "true";
    const { data: results, error } = await supabase
      .from("plans")
      .select("*")
      .ilike("location", `%${search.location || ""}%`)
      // .or(categoriesQuery)
      // .ilike("date", `%${search.date || ""}%`)
    if (error) console.error(error);
    set({ results: results || [], loading: false });
  },
  setSearchToNull: () => set({ results: [] }),
}));
