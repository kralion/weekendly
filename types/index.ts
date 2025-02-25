export type PlanStatus = "activo" | "cancelado" | "completado";

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
  receiver_id: string;
  plan_id: string;
  status: string;
  message: string;
}

export interface Profile {
  user_id: string;
  username: string;
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
  title: string;
  description: string;
  profiles?: Profile;
  location: string;
  date: Date;
  image_url: string;
  max_participants: number;
  status: PlanStatus;
  participants: string[];
}
