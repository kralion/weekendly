import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import { Profile } from "~/types";

interface PlanComment {
  id: string;
  created_at: Date;
  plan_id: string;
  user_id: string;
  message: string;
}

interface CommentWithProfile extends PlanComment {
  profiles?: Profile;
}

interface CommentsState {
  comments: CommentWithProfile[];
  isLoading: boolean;
  error: string | null;
  getCommentsByPlanId: (planId: string) => Promise<void>;
  createComment: (
    comment: Omit<PlanComment, "id" | "created_at">
  ) => Promise<void>;
}

export const useComments = create<CommentsState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  getCommentsByPlanId: async (planId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles (*, user_id)")
        .eq("plan_id", planId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      set({ comments: data as CommentWithProfile[] });
    } catch (error) {
      set({ error: (error as Error).message });
      console.error("Error fetching comments:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createComment: async (comment) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from("comments")
        .insert(comment)
        .select(
          `
          *,
          profiles (*)
        `
        )
        .single();

      if (error) throw error;

      // Update the comments list with the new comment
      set((state) => ({
        comments: [data as CommentWithProfile, ...state.comments].slice(0, 10),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      console.error("Error creating comment:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
