import { NextRequest, NextResponse } from "next/server";
import Image from "../models/images";
import { upload_file, delete_file } from "../utils/cloudinary";
import dbConnect from "../config/dbConnect";
import { getToken } from "next-auth/jwt";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";

// Upload image
export const uploadImageToCloudinary = async (req: NextRequest) => {
  const session = await getToken({ req });
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file)
      return NextResponse.json({ error: "File is required" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const fileUri = `data:${file.type};base64,${base64Data}`;

    const uploadResult = await upload_file(fileUri, "buba-app");

    // Save to database
    await dbConnect();
    const newImage = await Image.create({
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      username: session?.name,
    });

    return NextResponse.json({
      success: true,
      image: newImage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
};

// Get all images
export const getAllImages = async () => {
  await dbConnect();
  const images = await Image.find({});
  return NextResponse.json({ images });
};

// Delete image
export const deleteImage = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getToken({ req });
    try {
      await dbConnect();
      const image = await Image.findById(params.id);

      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      if (!session?.name) throw new Error("Unauthorized");
      await delete_file(image.public_id);
      await Image.findByIdAndDelete(params.id);

      return NextResponse.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Delete failed" },
        { status: 500 }
      );
    }
  }
);
