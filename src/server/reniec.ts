import { createServerFn } from "@tanstack/react-start";

export const validateDni = createServerFn({ method: "GET" })
  .validator((data: { dni: string }) => data)
  .handler(async ({ data }) => {
    const apiURL = "https://api.apis.net.pe/v2/reniec/dni?numero=";
    const token = process.env.API_RENIEC_TOKEN!;

    if (!data.dni) {
      return {
        status: "error" as const,
        help: "DNI es requerido como parámetro de consulta",
      };
    }

    if (data.dni.length !== 8) {
      return {
        status: "error" as const,
        help: "El DNI debe tener 8 dígitos",
      };
    }

    try {
      const response = await fetch(`${apiURL}${data.dni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        return {
          status: "success" as const,
          help: "DNI Encontrado",
          data: result,
        };
      } else {
        return {
          status: "error" as const,
          help: "DNI no existe",
        };
      }
    } catch (error) {
      console.error("Error validating DNI:", error);
      return {
        status: "error" as const,
        help: "Error al validar DNI",
      };
    }
  });
