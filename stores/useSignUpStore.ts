import { create } from "zustand";

interface SignUpState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  bio: string;
  hobbies: string[];
  languages: string[];
  residency: string;
  phone: string;
  setClerkCredentials: (credentials: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => void;
  setPreferences: (preferences: Partial<SignUpState>) => void;
  reset: () => void;
}

const initialState = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  bio: "",
  hobbies: [],
  languages: [],
  residency: "",
  phone: "",
};

export const useSignUpStore = create<SignUpState>((set) => ({
  ...initialState,
  setClerkCredentials: (credentials) => set(credentials),
  setPreferences: (preferences) =>
    set((state) => ({ ...state, ...preferences })),
  reset: () => set(initialState),
}));
