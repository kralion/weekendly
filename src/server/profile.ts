import { createServerFn } from "@tanstack/react-start";

export const fetchProfileById = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY!;
    const clerkApiUrl = "https://api.clerk.com/v1/users/";

    if (!data.id) {
      throw new Error("missing id parameter");
    }

    const response = await fetch(`${clerkApiUrl}${data.id}`, {
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  });
