import { createServerFn } from "@tanstack/react-start";

export const sendFeedback = createServerFn({ method: "POST" })
  .validator((data: { feedbackText: string; user?: { firstName?: string } }) => data)
  .handler(async ({ data }) => {
    const notionApiKey = process.env.NOTION_API_KEY!;
    const dbId = process.env.NOTION_DATABASE_ID!;

    if (!data.feedbackText?.trim()) {
      throw new Error("missing feedback");
    }

    const response = await fetch("https://api.notion.com/v1/pages/", {
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
                  content: data.user?.firstName ?? "Anonymous",
                },
              },
            ],
          },
          Message: {
            rich_text: [
              {
                text: {
                  content: data.feedbackText,
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
      throw new Error("error sending feedback");
    }

    return { success: true };
  });
