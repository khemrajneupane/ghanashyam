import { NextRequest, NextResponse } from "next/server";
import { deleteImage } from "@/backend/controllers/imageControllers";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return deleteImage(request, { params: { id } });
}
