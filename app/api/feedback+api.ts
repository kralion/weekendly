const notionApiKey = process.env.NOTION_API_KEY!;
const dbId = process.env.NOTION_DATABASE_ID!;
const notionApiUrl = "https://api.notion.com/v1/pages/";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { feedbackText, user } = requestData;

    if (!feedbackText || !feedbackText.trim()) {
      return new Response(JSON.stringify({ error: "missing feedback" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response = await fetch(notionApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: `${user?.firstName || "Anonymous"}`,
                },
              },
            ],
          },
          Message: {
            rich_text: [
              {
                text: {
                  content: feedbackText,
                },
              },
            ],
          },
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Notion API Error:", responseData);
      return new Response(JSON.stringify({ error: "error sending feedback" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error sending feedback:", error);
    return new Response(JSON.stringify({ error: "error sending feedback" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
