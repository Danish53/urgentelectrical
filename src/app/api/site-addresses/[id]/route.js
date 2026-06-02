import { NextResponse } from "next/server";
import { SITE_ADDRESSES_API } from "@/constants/siteAddressesApi";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

function getAuthorization(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization;
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context
 */
export async function GET(request, { params }) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const result = await upstreamJsonRequest("GET", SITE_ADDRESSES_API.detail(id), {
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context
 */
export async function PUT(request, { params }) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const result = await upstreamJsonRequest("PUT", SITE_ADDRESSES_API.detail(id), {
    body,
    authorization,
  });

  return NextResponse.json(result.data, { status: result.status });
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ id: string }> }} context
 */
export async function DELETE(request, { params }) {
  const authorization = getAuthorization(request);
  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const result = await upstreamJsonRequest("DELETE", SITE_ADDRESSES_API.detail(id), {
    authorization,
  });

  return NextResponse.json(result.data ?? { success: true }, { status: result.status });
}
