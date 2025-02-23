import { z } from "zod";
import type { Category, Profile, Plan, PlanStatus } from "../types";

// Base schemas for primitive validations
const idSchema = z.string().uuid();
const timestampSchema = z.string().datetime();

// Category schema
export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1, "El nombre es requerido"),
  icon: z.string().min(1, "El ícono es requerido"),
  created_at: timestampSchema,
});

// Profile schema
export const profileSchema = z.object({
  user_id: z.string().min(1, "ID de usuario es requerido"),
  username: z
    .string()
    .min(2, "Nombre de usuario debe tener al menos 2 caracteres"),
  bio: z.string().nullable(),
  gender: z.enum(["Hombre", "Mujer", "Otro"], {
    errorMap: () => ({ message: "Selecciona un sexo válido" }),
  }),
  phone: z.string().min(1, "Telefono es requerido"),
  country: z.string().min(1, "Pais es requerido"),
  languages: z.array(z.string()).min(1, "Selecciona al menos un idioma"),
  hobbies: z.array(z.string()).min(1, "Selecciona al menos un hobby"),
  created_at: timestampSchema,
});

// Plan schema
export const planSchema = z.object({
  id: idSchema.optional(),
  creator_id: z.string().min(1, "ID del creador es requerido"),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  title: z.string().min(3, "Título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "Descripción debe tener al menos 10 caracteres"),
  location: z.string().min(1, "Ubicación es requerida"),
  date: z.date().min(new Date(), "Fecha debe ser mayor a hoy"),
  image_url: z.string().url("Debe ser una URL válida"),
  max_participants: z
    .number()
    .min(2, "Mínimo 2 participantes")
    .max(50, "Máximo 50 participantes"),
  status: z.enum(["activo", "cancelado", "completado"], {
    errorMap: () => ({ message: "Estado no válido" }),
  }),
  participants: z.array(z.string()),
});

// Form schemas (for creating/updating)
export const createCategorySchema = categorySchema.omit({
  id: true,
});

export const createPlanSchema = planSchema.omit({
  id: true,
  creator_id: true,
  status: true,
  participants: true,
});

export const updatePlanSchema = createPlanSchema.partial();

// Type inference helpers
export type CategorySchema = z.infer<typeof categorySchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type PlanSchema = z.infer<typeof planSchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type CreatePlanSchema = z.infer<typeof createPlanSchema>;
export type UpdatePlanSchema = z.infer<typeof updatePlanSchema>;
