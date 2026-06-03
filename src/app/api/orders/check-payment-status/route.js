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

  const paymentIntentId = body?.payment_intent_id;

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    return NextResponse.json({ message: "payment_intent_id is required." }, { status: 422 });
  }

  const result = await upstreamJsonRequest("POST", CHECKOUT_API.checkPaymentStatus, {
    body: { payment_intent_id: paymentIntentId },
    authorization: getBearerFromRequest(request),
  });

  return NextResponse.json(result.data, { status: result.status });
}
