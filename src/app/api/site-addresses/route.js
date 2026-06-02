import { NextResponse } from "next/server";
import { SITE_ADDRESSES_API } from "@/constants/siteAddressesApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

function getAuthorization(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization;
}

export async function GET(request) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const path = query ? `${SITE_ADDRESSES_API.list}?${query}` : SITE_ADDRESSES_API.list;

  const result = await upstreamJsonRequest("GET", path, { authorization });
  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(request) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await upstreamJsonRequest("POST", SITE_ADDRESSES_API.list, {
    body,
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}
