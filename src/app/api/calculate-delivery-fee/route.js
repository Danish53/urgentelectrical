import { NextResponse } from "next/server";
import { CHECKOUT_API } from "@/constants/checkoutApi";
import { upstreamPublicJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const postcode = String(body?.postcode ?? "").trim();
  if (!postcode) {
    return NextResponse.json({ message: "Postcode is required." }, { status: 400 });
  }

  const result = await upstreamPublicJsonRequest("POST", CHECKOUT_API.calculateDeliveryFee, {
    body: { postcode },
  });

  return NextResponse.json(result.data, { status: result.status });
}
