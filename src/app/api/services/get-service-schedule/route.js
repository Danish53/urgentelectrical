import { NextResponse } from "next/server";
import { GET_SERVICE_SCHEDULE_PATH } from "@/constants/serviceScheduleApi";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const serviceId = body?.service_id;
  const selectedDate = body?.selected_date;

  if (serviceId == null || serviceId === "") {
    return NextResponse.json({ message: "service_id is required." }, { status: 422 });
  }
  if (!selectedDate || typeof selectedDate !== "string") {
    return NextResponse.json({ message: "selected_date is required." }, { status: 422 });
  }

  const result = await upstreamJsonRequest("POST", GET_SERVICE_SCHEDULE_PATH, {
    body: { service_id: Number(serviceId), selected_date: selectedDate },
    authorization: getBearerFromRequest(request),
  });

  return NextResponse.json(result.data, { status: result.status });
}
