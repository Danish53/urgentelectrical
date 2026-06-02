import { NextResponse } from "next/server";
import { ORDERS_API } from "@/constants/ordersApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

function getAuthorization(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization;
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context
 */
export async function GET(request, { params }) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const result = await upstreamJsonRequest("GET", ORDERS_API.detail(id), { authorization });
  return NextResponse.json(result.data, { status: result.status });
}
