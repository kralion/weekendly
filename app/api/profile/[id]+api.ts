const clerkSecretKey = process.env.CLERK_SECRET_KEY!;
const clerkApiUrl = "https://api.clerk.com/v1/users/";

// Export GET function to handle user profile requests
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
    // Use the Clerk REST API directly with your API key
    const response = await fetch(`${clerkApiUrl}${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Clerk API error:", errorData);
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const userData = await response.json();
    
    // Return a formatted user object with relevant information
    const formattedUser = {
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      username: userData.username,
      imageUrl: userData.image_url || userData.profile_image_url,
      emailAddresses: userData.email_addresses,
      primaryEmailId: userData.primary_email_address_id,
      phoneNumbers: userData.phone_numbers,
      primaryPhoneId: userData.primary_phone_number_id,
      publicMetadata: userData.public_metadata,
      createdAt: userData.created_at,
    };
    
    return new Response(JSON.stringify(formattedUser), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
