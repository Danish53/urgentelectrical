import { NextResponse } from "next/server";
import { ORDERS_API } from "@/constants/ordersApi";
import { resolveOrderActionId } from "@/lib/orders/orderCancel";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  const authorization = getBearerFromRequest(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const orderId = body?.order_id;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (orderId == null || orderId === "") {
    return NextResponse.json({ message: "order_id is required." }, { status: 422 });
  }
  if (!email) {
    return NextResponse.json({ message: "email is required." }, { status: 422 });
  }

  const result = await upstreamJsonRequest("POST", ORDERS_API.sendOrderPdf, {
    body: {
      order_id: resolveOrderActionId(orderId),
      email,
    },
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}
