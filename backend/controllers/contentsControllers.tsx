import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../config/dbConnect";
import Contents from "../models/contents";
import { getToken } from "next-auth/jwt";

const authSecret = process.env.NEXTAUTH_SECRET;

// Upload content
export const uploadContents = catchAsyncErrors(async (req: NextRequest) => {
  await dbConnect();
  const body = await req.json();
  const { title, description } = body;
  const session = await getToken({ req, secret: authSecret });
  const content = await Contents.create({
    title,
    description,
    user: session?.user,
  });
  return NextResponse.json({ success: true, user: content });
});

// Get all contents
export const getAllContents = async () => {
  await dbConnect();
  const contents = await Contents.find({})
    .populate("user", "name email")
    .exec();
  return NextResponse.json({ contents });
};

// Get a content by id
export const getAContentById = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await dbConnect();
    const content = await Contents.findById(params.id)
      .populate("user", "name email")
      .exec();
    if (!content)
      return NextResponse.json(
        { message: "content not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, content });
  },
);

// Delete a content
export const deleteContent = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getToken({ req, secret: authSecret });
    try {
      await dbConnect();
      const contents = await Contents.findById(params.id);
      if (!contents)
        return NextResponse.json(
          { error: "Contents not found" },
          { status: 404 },
        );
      if (!session?.name) throw new Error("Unauthorized");
      // @ts-ignore
      if (session?.user?.role !== "admin") throw new Error("Unauthorized");
      await Contents.findByIdAndDelete(params.id);
      return NextResponse.json({
        success: true,
        message: "Contents deleted successfully",
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Delete failed" },
        { status: 500 },
      );
    }
  },
);

// Update a content
export const updateContent = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await getToken({ req, secret: authSecret });
    try {
      await dbConnect();
      const contents = await Contents.findById(params.id);
      if (!contents)
        return NextResponse.json(
          { error: "Contents not found" },
          { status: 404 },
        );
      if (!session?.name) throw new Error("Unauthorized");
      // @ts-ignore
      if (session?.user?.role !== "admin") throw new Error("Unauthorized");
      const body = await req.json();
      const { title, description } = body;
      if (!title && !description)
        return NextResponse.json(
          { error: "No valid fields provided" },
          { status: 400 },
        );
      if (title) contents.title = title;
      if (description) contents.description = description;
      contents.updatedAt = new Date();
      await contents.save();
      return NextResponse.json({
        success: true,
        message: "Contents updated successfully",
        contents,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Update failed" },
        { status: 500 },
      );
    }
  },
);
