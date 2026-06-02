import { NextResponse } from "next/server";
import { PROFILE_API } from "@/constants/profileApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

export async function POST(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await upstreamJsonRequest("POST", PROFILE_API.update, {
    body,
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}
