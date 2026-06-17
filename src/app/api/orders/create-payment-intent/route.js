import { NextResponse } from "next/server";
import { CHECKOUT_API } from "@/constants/checkoutApi";
import { buildCreatePaymentIntentPayload } from "@/lib/checkout/buildCreatePaymentIntentPayload";
import { createStripePaymentIntentDirect } from "@/lib/checkout/createStripePaymentIntent";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const enrichedBody = buildCreatePaymentIntentPayload(body);

  if (process.env.STRIPE_SECRET_KEY?.trim()) {
    try {
      const direct = await createStripePaymentIntentDirect(enrichedBody);
      if (direct) {
        return NextResponse.json(direct, { status: 200 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create payment session.";
      return NextResponse.json({ message }, { status: 502 });
    }
  }

  const result = await upstreamJsonRequest("POST", CHECKOUT_API.createPaymentIntent, {
    body: enrichedBody,
    authorization: getBearerFromRequest(request),
  });
  return NextResponse.json(result.data, { status: result.status });
}
