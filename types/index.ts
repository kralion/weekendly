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
  location: string | null;
  hobbies: string[];
  age_range: string;
  day_preferred: "Sábado" | "Domingo";
  created_at: string;
}

export interface Plan {
  id: string;
  creator_id: string;
  category_id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  max_participants: number;
  status: PlanStatus;
  participants: string[];
  created_at: string;
  updated_at: string;
}
