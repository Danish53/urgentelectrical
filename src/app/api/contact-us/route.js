import { NextResponse } from "next/server";

function getApiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Proxy contact form to Laravel API (avoids browser CSRF 419 on cross-origin POST). */
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

  const first_name = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const last_name = typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!first_name || !last_name || !email || !comment) {
    return NextResponse.json({ message: "All fields are required." }, { status: 422 });
  }

  try {
    const upstream = await fetch(`${apiBase}/contact-us`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, last_name, email, comment }),
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
