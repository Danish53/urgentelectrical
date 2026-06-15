import { NextResponse } from "next/server";
import { COOKIE_API } from "@/constants/cookieApi";
import { getBearerFromRequest } from "@/lib/api/proxyAuth";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function GET(request) {
  const result = await upstreamJsonRequest("GET", COOKIE_API.get, {
    authorization: getBearerFromRequest(request),
  });
  return NextResponse.json(result.data, { status: result.status });
}
