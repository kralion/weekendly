import { z } from "zod";

const idSchema = z.string().uuid();
const timestampSchema = z.string().datetime();

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1, "El nombre es requerido"),
  icon: z.string().min(1, "El ícono es requerido"),
  created_at: timestampSchema,
});

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
  residency: z.string().min(1, "Pais es requerido"),
  languages: z.array(z.string()).min(1, "Selecciona al menos un idioma"),
  hobbies: z.array(z.string()).min(1, "Selecciona al menos un hobby"),
  created_at: timestampSchema,
});

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

export const createPlanSchema = planSchema.omit({
  id: true,
  creator_id: true,
  status: true,
  participants: true,
});

export const updatePlanSchema = createPlanSchema.partial();
