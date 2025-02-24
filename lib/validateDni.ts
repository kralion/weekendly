import { ReniecResponse } from "~/types";

export const validateDni = async (dni: string) => {
  if (dni.length !== 8) {
    return { status: "error", help: "El DNI debe tener 8 dígitos" };
  }
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_RENIEC_URL}${dni}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_RENIEC_TOKEN}`,
        },
      }
    );
    if (response.status === 200) {
      return {
        status: "success",
        help: "DNI Encontrado",
        data: (await response.json()) as ReniecResponse,
      };
    } else {
      return { status: "error", help: "DNI no existe" };
    }
  } catch (error) {
    return { status: "error", help: "Error al validar DNI" };
  }
};
