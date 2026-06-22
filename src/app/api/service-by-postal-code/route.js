import { NextResponse } from "next/server";
import { SERVICE_BY_POSTAL_CODE_API_PATH } from "@/constants/servicesApi";
import { normalizePostcodeForApi } from "@/lib/postcode/normalizePostcode";
import { upstreamJsonRequest } from "@/lib/api/upstreamProxy";

/** Proxy postcode coverage check — avoids browser CSRF / CORS on cross-origin POST. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source.trim() : "";
  const service_slug = typeof body.service_slug === "string" ? body.service_slug.trim() : "";
  const post_code = normalizePostcodeForApi(body.post_code);

  if (!source || !service_slug || !post_code) {
    return NextResponse.json(
      { error: "source, service_slug and post_code are required." },
      { status: 422 },
    );
  }

  const result = await upstreamJsonRequest("POST", SERVICE_BY_POSTAL_CODE_API_PATH, {
    body: { source, service_slug, post_code },
  });

  return NextResponse.json(result.data, { status: result.status });
}
