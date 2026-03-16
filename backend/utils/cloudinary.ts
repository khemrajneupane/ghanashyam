import { v2 as cloudinary } from "cloudinary"; // ✅ Import the v2 instance directly

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const upload_file = (
  file: string,
  folder: string
): Promise<{ public_id: string; url: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {
        if (error) {
          return reject(error); // ✅ handle error
        }

        if (!result) {
          return reject(new Error("Upload failed with no result."));
        }

        resolve({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    );
  });
};

const delete_file = async (file: string): Promise<boolean> => {
  try {
    const res = await cloudinary.uploader.destroy(file);
    return res?.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return false;
  }
};

export { upload_file, delete_file, cloudinary };
