import { NextResponse } from "next/server";

const HSTS_VALUE = "max-age=31536000; includeSubDomains; preload";
const APEX_HOST = "urgentelectrical.services";
const CANONICAL_HOST = "www.urgentelectrical.services";

/**
 * Always attach HSTS (incl. apex → www redirect responses).
 * Platform-level apex redirects often omit this header; handle it here so
 * both hosts satisfy HSTS audits.
 *
 * @param {import("next/server").NextRequest} request
 */
export function middleware(request) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();

  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    const redirect = NextResponse.redirect(url, 308);
    redirect.headers.set("Strict-Transport-Security", HSTS_VALUE);
    return redirect;
  }

  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", HSTS_VALUE);
  return response;
}

export const config = {
  // Cover `/` and all paths so apex redirects always get HSTS.
  matcher: ["/:path*"],
};
