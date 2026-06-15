import { NextResponse } from "next/server";

const IDEAL_BASE = "https://api.ideal-postcodes.co.uk/v1";

function getApiKey() {
  return process.env.IDEAL_POSTCODES_API_KEY?.trim() || "";
}

/** Proxy Ideal Postcodes lookup — keeps API key server-side. */
export async function GET(request) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { message: "Postcode lookup is not configured." },
      { status: 500 },
    );
  }

  const postcode = request.nextUrl.searchParams.get("postcode")?.trim();
  if (!postcode) {
    return NextResponse.json({ message: "Postcode is required." }, { status: 400 });
  }

  const page = request.nextUrl.searchParams.get("page")?.trim() || "0";

  try {
    const url = new URL(`${IDEAL_BASE}/postcodes/${encodeURIComponent(postcode)}`);
    url.searchParams.set("api_key", apiKey);
    if (page !== "0") url.searchParams.set("page", page);

    const upstream = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
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
        {
          message: data?.message ?? "Postcode not found.",
          code: data?.code,
          suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
        },
        { status: upstream.status === 404 ? 404 : upstream.status },
      );
    }

    return NextResponse.json({
      addresses: Array.isArray(data?.result) ? data.result : [],
      code: data?.code,
      message: data?.message,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to look up postcode. Please try again." },
      { status: 502 },
    );
  }
}
