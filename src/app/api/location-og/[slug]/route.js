import { getLocationShareImageUrl } from "@/data/locationDetails";
import { mapLocationDetailFromApi } from "@/lib/locations/mapLocationDetail";
import { getLocationBySlug } from "@/lib/cms/serverLoads";
import { getOgImageUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

/**
 * Proxies the location CMS `main_image` on the public site domain so social
 * crawlers (WhatsApp, Facebook, LinkedIn) can fetch a same-origin og:image URL.
 */
export async function GET(_request, context) {
  const { slug } = await context.params;
  const trimmed = String(slug ?? "").trim();
  if (!trimmed) {
    return new Response("Not found", { status: 404 });
  }

  let imageUrl = getOgImageUrl();

  try {
    const apiData = await getLocationBySlug(trimmed);
    const location = mapLocationDetailFromApi(apiData);
    imageUrl = getLocationShareImageUrl(location);
  } catch {
    imageUrl = getOgImageUrl();
  }

  try {
    const upstream = await fetch(imageUrl, { cache: "no-store" });
    if (!upstream.ok) {
      const fallbackRes = await fetch(getOgImageUrl(), { cache: "no-store" });
      if (!fallbackRes.ok) {
        return new Response("Image unavailable", { status: 502 });
      }
      return new Response(await fallbackRes.arrayBuffer(), {
        headers: {
          "Content-Type": fallbackRes.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    return new Response(await upstream.arrayBuffer(), {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new Response("Image unavailable", { status: 502 });
  }
}
