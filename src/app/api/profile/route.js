import { NextResponse } from "next/server";
import { PROFILE_API } from "@/constants/profileApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function GET(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const result = await upstreamJsonRequest("GET", PROFILE_API.get, { authorization });
  return NextResponse.json(result.data, { status: result.status });
}
