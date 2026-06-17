import { NextResponse } from "next/server";
import { CHECKOUT_API } from "@/constants/checkoutApi";
import { isApiDateString, normalizeApiDate } from "@/lib/schedules";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

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

  const result = await upstreamJsonRequest("POST", CHECKOUT_API.validateOrderData, {
    body: upstreamBody,
    authorization: getBearerFromRequest(request),
  });
  return NextResponse.json(result.data, { status: result.status });
}
