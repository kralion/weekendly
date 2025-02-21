import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";
import { toast } from "sonner-native";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  selectedCategory: Category | null;
  fetchCategories: () => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
  createCategory: (
    category: Omit<Category, "id" | "created_at">
  ) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategories = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  selectedCategory: null,

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      set({ categories: data });
    } catch (error) {
      toast.error("Error al cargar categorías");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  createCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        categories: [...state.categories, data],
      }));
      toast.success("Categoría creada exitosamente");
    } catch (error) {
      toast.error("Error al crear categoría");
      console.error(error);
    }
  },

  updateCategory: async (id, category) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(category)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c)),
      }));
      toast.success("Categoría actualizada exitosamente");
    } catch (error) {
      toast.error("Error al actualizar categoría");
      console.error(error);
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      toast.success("Categoría eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar categoría");
      console.error(error);
    }
  },
}));
