import { NextResponse } from "next/server";
import { ORDERS_API } from "@/constants/ordersApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

function getAuthorization(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization;
}

export async function GET(request) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = query ? `${ORDERS_API.list}?${query}` : ORDERS_API.list;

  const result = await upstreamJsonRequest("GET", path, { authorization });
  return NextResponse.json(result.data, { status: result.status });
}
