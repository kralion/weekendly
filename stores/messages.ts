import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Message, ChatMessage } from "~/types";
import { supabase } from "~/lib/supabase";

interface MessagesState {
  messages: Message[];
  activeMatchMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  fetchMatchMessages: (matchId: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "created_at">) => Promise<void>;
  updateMessage: (id: string, read_at: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  setActiveMatchMessages: (messages: ChatMessage[]) => void;
  getMatchMessages: (matchId: string) => Message[];
  getUnreadMessages: (userId: string) => Message[];
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: [],
      activeMatchMessages: [],
      isLoading: false,
      error: null,

      fetchMessages: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

          if (error) throw error;
          set({ messages: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMatchMessages: async (matchId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', matchId)
            .order('created_at', { ascending: true });

          if (error) throw error;
          set({ messages: data || [] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addMessage: async (message) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('messages')
            .insert([message])
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            messages: [...state.messages, data],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      updateMessage: async (id, read_at) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('messages')
            .update({ read_at })
            .eq('id', id)
            .select()
            .single();

          if (error) throw error;
          set((state) => ({
            messages: state.messages.map((message) =>
              message.id === id ? data : message
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMessage: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

          if (error) throw error;
          set((state) => ({
            messages: state.messages.filter((message) => message.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      setMessages: (messages) => set({ messages }),
      setActiveMatchMessages: (messages) => set({ activeMatchMessages: messages }),
  
      getMatchMessages: (matchId) => {
        return get().messages.filter((message) => message.match_id === matchId);
      },
  
      getUnreadMessages: (userId) => {
        return get().messages.filter(
          (message) => message.sender_id !== userId && !message.read_at
        );
      },
    }),
    {
      name: "weekendly-messages",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
