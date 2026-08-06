import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/siteUrl";

/**
 * Proxy page-visit tracking to Laravel (avoids browser CSRF 419 on cross-origin POST).
 * Forwards the visitor IP so Laravel can still dedupe by IP+URL.
 */
export async function POST(request) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    return NextResponse.json(
      { message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  const display_name =
    typeof body.display_name === "string" ? body.display_name.trim() : "";

  if (!url || !display_name || /^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { message: "url (relative path) and display_name are required." },
      { status: 422 }
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const visitorIp =
    (forwarded ? forwarded.split(",")[0]?.trim() : "") || realIp || "";

  try {
    const upstream = await fetch(`${apiBase}/track-page-visit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(visitorIp
          ? {
              "X-Forwarded-For": visitorIp,
              "X-Real-IP": visitorIp,
            }
          : {}),
      },
      body: JSON.stringify({
        url: url.startsWith("/") ? url : `/${url}`,
        display_name,
      }),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!upstream.ok) {
      return NextResponse.json(
        data ?? { message: `Request failed (${upstream.status})` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the server. Please try again." },
      { status: 502 }
    );
  }
}
