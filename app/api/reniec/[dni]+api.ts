import { ReniecResponse } from "~/types";

const apiURL = "https://api.apis.net.pe/v2/reniec/dni?numero=";
const token = process.env.API_RENIEC_TOKEN!;

export async function GET(request: Request, { dni }: Record<string, string>) {
  if (!dni) {
    return new Response(
      JSON.stringify({
        status: "error",
        help: "DNI es requerido como parámetro de consulta",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (dni.length !== 8) {
    return new Response(
      JSON.stringify({
        status: "error",
        help: "El DNI debe tener 8 dígitos",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(`${apiURL}${dni}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      const data = (await response.json()) as ReniecResponse;
      return new Response(
        JSON.stringify({
          status: "success",
          help: "DNI Encontrado",
          data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ status: "error", help: "DNI no existe" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error validating DNI:", error);
    return new Response(
      JSON.stringify({ status: "error", help: "Error al validar DNI" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
