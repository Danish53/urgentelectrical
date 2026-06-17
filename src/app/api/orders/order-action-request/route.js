import { NextResponse } from "next/server";
import { ORDERS_API } from "@/constants/ordersApi";
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

  const action = String(body?.action ?? "").trim();
  const orderId = body?.order_id;
  const note = String(body?.note ?? "").trim();

  if (!action) {
    return NextResponse.json({ message: "action is required." }, { status: 422 });
  }
  if (orderId == null || orderId === "") {
    return NextResponse.json({ message: "order_id is required." }, { status: 422 });
  }

  const result = await upstreamJsonRequest("POST", ORDERS_API.orderActionRequest, {
    body: {
      action,
      order_id: Number(orderId) || orderId,
      note,
    },
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}
