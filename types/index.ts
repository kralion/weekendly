export type PlanStatus = "activo" | "cancelado" | "completado";
export type InvitationStatus = "accepted"  | "rejected" | "pending";

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export enum Gender {
  Hombre = "Hombre",
  Mujer = "Mujer",
  Otro = "Otro",
}

export interface Invitation {
  id: string;
  sender_id: string;
  created_at: Date;
  receiver_id: string;
  sender?: Profile;
  receiver?: Profile;
  plan_id: string;
  status: InvitationStatus;
  type: "request" | "invite";
  message: string;
}

export interface Profile {
  user_id: string;
  username: string;
  ig_username: string | null;
  bio: string | null;
  image_url: string | null;
  hobbies: string[];
  created_at: string;
  residency: string;
  languages: string[];
  phone: string | null;
  gender: Gender;
}

export type ReniecResponse = {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
};

export interface Plan {
  id?: string;
  creator_id: string;
  categories: string[];
  reports?: number;
  title: string;
  is_private: boolean;
  description: string;
  profiles?: Profile;
  location: string;
  date: Date;
  image_url: string;
  max_participants: number;
  status: PlanStatus;
  participants: string[];
}
