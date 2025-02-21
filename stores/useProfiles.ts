import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import { toast } from "sonner-native";

interface ProfilesState {
  profiles: Profile[];
  currentProfile: Profile | null;
  loading: boolean;
  fetchProfiles: () => Promise<void>;
  fetchProfileById: (userId: string) => Promise<void>;
  createProfile: (profile: Omit<Profile, "created_at">) => Promise<void>;
  updateProfile: (userId: string, profile: Partial<Profile>) => Promise<void>;
  deleteProfile: (userId: string) => Promise<void>;
}

export const useProfiles = create<ProfilesState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  loading: false,

  fetchProfiles: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ profiles: data });
    } catch (error) {
      toast.error("Error al cargar perfiles");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProfileById: async (userId) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      set({ currentProfile: data });
    } catch (error) {
      toast.error("Error al cargar perfil");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createProfile: async (profile) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert(profile)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        profiles: [...state.profiles, data],
        currentProfile: data,
      }));
      toast.success("Perfil creado exitosamente");
    } catch (error) {
      toast.error("Error al crear perfil");
      console.error(error);
    }
  },

  updateProfile: async (userId, profile) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        profiles: state.profiles.map((p) => (p.user_id === userId ? data : p)),
        currentProfile: data,
      }));
      toast.success("Perfil actualizado exitosamente");
    } catch (error) {
      toast.error("Error al actualizar perfil");
      console.error(error);
    }
  },

  deleteProfile: async (userId) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      set((state) => ({
        profiles: state.profiles.filter((p) => p.user_id !== userId),
        currentProfile: null,
      }));
      toast.success("Perfil eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar perfil");
      console.error(error);
    }
  },
}));
