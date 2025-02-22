export type PlanStatus = "activo" | "cancelado" | "completado";

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface Profile {
  user_id: string;
  username: string;
  bio: string | null;
  hobbies: string[];
  day_preferred: "Sábado" | "Domingo";
  created_at: string;
  country: string;
  languages: string[];
  phone: string;
}

export interface Plan {
  id: string;
  creator_id: string;
  category_id: string;
  title: string;
  description: string;
  image_url: string;
  location: string;
  profiles?: Profile;
  date: Date;
  max_participants: number;
  status: PlanStatus;
  participants: string[];
  created_at: string;
  updated_at: string;
}
