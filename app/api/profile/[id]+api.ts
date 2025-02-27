const clerkSecretKey = process.env.CLERK_SECRET_KEY!;
const clerkApiUrl = "https://api.clerk.com/v1/users/";

export async function GET(request: Request, { id }: Record<string, string>) {
  if (!id) {
    return new Response(JSON.stringify({ error: "missing id parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = await fetch(`${clerkApiUrl}${id}`, {
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();
    return Response.json(user);
  } catch (e) {
    console.error("error fetching user", e);
    return new Response(JSON.stringify({ error: "error fetching user" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
