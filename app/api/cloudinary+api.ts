const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  bytes: number;
  url: string;
  [key: string]: any;
};

export async function POST(request: Request) {
  try {
    // Extract the base64 and folder from the request
    const { base64Image, folder = "weekendly/plans" } = await request.json();

    if (!base64Image) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create FormData for Cloudinary
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(errorData)}`);
    }

    const data = (await uploadResponse.json()) as CloudinaryResponse;

    // Return the Cloudinary response with the image URL
    return new Response(
      JSON.stringify({
        status: "success",
        data: {
          secure_url: data.secure_url,
          public_id: data.public_id,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    return new Response(
      JSON.stringify({
        status: "error",
        error:
          error instanceof Error ? error.message : "Failed to upload image",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
