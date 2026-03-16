import {
  deleteContent,
  getAContentById,
  updateContent,
} from "@/backend/controllers/contentsControllers";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, void>();

router.get(getAContentById);
router.delete(deleteContent);
router.put(updateContent);

export async function GET(request: NextRequest): Promise<NextResponse> {
  return router.run(request) as Promise<NextResponse>;
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return deleteContent(request, { params: { id } });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return updateContent(request, { params: { id } });
}
