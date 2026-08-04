import { NextResponse } from "next/server";
import { buildLocationMapQuery } from "@/lib/locations/buildLocationMapEmbed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * @param {string} query
 * @returns {Promise<{ lat: number, lng: number, label: string } | null>}
 */
async function nominatimSearch(query) {
  const q = String(query ?? "").trim();
  if (!q) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=gb&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "UrgentElectricalWebsite/1.0 (locations map; contact@urgentelectrical.services)",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return null;
  const rows = await res.json();
  const first = Array.isArray(rows) ? rows[0] : null;
  const lat = Number.parseFloat(first?.lat);
  const lng = Number.parseFloat(first?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    label: String(first?.display_name ?? q),
  };
}

/**
 * Build progressive query fallbacks for flaky place names.
 * @param {{ name?: string, cityName?: string, slug?: string, q?: string }} input
 */
function buildQueryCandidates(input) {
  const name = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();
  const slug = String(input.slug ?? "").trim();
  const explicit = String(input.q ?? "").trim();

  /** @type {string[]} */
  const candidates = [];
  const push = (value) => {
    const v = String(value ?? "").trim();
    if (v && !candidates.includes(v)) candidates.push(v);
  };

  if (explicit) push(explicit);
  push(buildLocationMapQuery({ name, cityName, slug }));

  const cleanedName = name
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/^electricians?\s+/i, "")
    .trim();

  if (cleanedName) {
    push(`${cleanedName}, UK`);
    if (cityName) {
      push(`${cleanedName}, ${cityName}, England, UK`);
      push(`${cleanedName}, ${cityName}`);
    }
  }

  // County-style helpers for East Midlands cities
  const countyByCity = {
    nottingham: "Nottinghamshire",
    derby: "Derbyshire",
    leicester: "Leicestershire",
    lincoln: "Lincolnshire",
  };
  const county = countyByCity[cityName.toLowerCase()];
  if (cleanedName && county) {
    push(`${cleanedName}, ${county}, UK`);
  }

  return candidates;
}

/**
 * GET /api/geocode?name=Arnold&cityName=Nottingham
 * Server-side Nominatim proxy (avoids browser CORS / rate-limit gaps).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "";
  const cityName = searchParams.get("cityName") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const q = searchParams.get("q") ?? "";

  const candidates = buildQueryCandidates({ name, cityName, slug, q }).slice(0, 4);

  try {
    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      const hit = await nominatimSearch(candidate);
      if (hit) {
        return NextResponse.json({
          ok: true,
          lat: hit.lat,
          lng: hit.lng,
          query: candidate,
          label: hit.label,
        });
      }
      // Gentle spacing to respect Nominatim usage policy.
      if (i < candidates.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  } catch {
    /* fall through */
  }

  return NextResponse.json(
    { ok: false, message: "Location not found" },
    { status: 404 }
  );
}
