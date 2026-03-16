import { getAllUsers } from "@/backend/controllers/authControllers";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";

const router = createEdgeRouter<NextRequest, void>();

router.get(getAllUsers); // anyone should be able to access, so no middleware for protection required.

export async function GET(request: NextRequest): Promise<NextResponse> {
  return router.run(request) as Promise<NextResponse>;
}
