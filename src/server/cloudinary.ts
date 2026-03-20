import { createServerFn } from "@tanstack/react-start";

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
};

export const uploadToCloudinary = createServerFn({ method: "POST" })
  .validator((data: { base64Image: string; folder?: string }) => data)
  .handler(async ({ data }) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET!;
    const folder = data.folder ?? "weekendly/plans";

    if (!data.base64Image) {
      throw new Error("No image data provided");
    }

    const formData = new FormData();
    formData.append("file", data.base64Image);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Cloudinary upload failed: ${JSON.stringify(errorData)}`);
    }

    const result = (await uploadResponse.json()) as CloudinaryResponse;
    return {
      status: "success" as const,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    };
  });
