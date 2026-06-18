import { NextResponse } from "next/server";
import { CHECKOUT_API } from "@/constants/checkoutApi";
import { ORDERS_API } from "@/constants/ordersApi";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";
import { isApiDateString, normalizeApiDate } from "@/lib/schedules";

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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const normalizedDate = normalizeApiDate(body?.selected_date);
  const upstreamBody = {
    ...body,
    ...(normalizedDate ? { selected_date: normalizedDate } : {}),
  };

  if (normalizedDate && !isApiDateString(normalizedDate)) {
    return NextResponse.json(
      { message: "selected_date must be YYYY-MM-DD (e.g. 2026-06-17)." },
      { status: 422 }
    );
  }

  const result = await upstreamJsonRequest("POST", CHECKOUT_API.createOrder, {
    body: upstreamBody,
    authorization: getBearerFromRequest(request),
  });
  return NextResponse.json(result.data, { status: result.status });
}
