import { NextResponse } from "next/server";
import { CHECKOUT_API } from "@/constants/checkoutApi";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await upstreamJsonRequest("POST", CHECKOUT_API.validateOrderData, {
    body,
    authorization: getBearerFromRequest(request),
  });
  return NextResponse.json(result.data, { status: result.status });
}
