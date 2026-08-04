import {
  LOCATION_API_PAGES_PER_SITEMAP,
  buildCoreSitemapEntries,
  fetchLocationEntriesRange,
  urlEntryXml,
  withTimeout,
  xmlResponse,
} from "@/lib/sitemap/buildSitemap";
import { getSiteUrl } from "@/lib/siteUrl";
import { fetchLocationsPage } from "@/services/locationsApiService";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/**
 * /sitemaps/core.xml and /sitemaps/locations-1.xml, locations-2.xml, ...
 * @param {{ params: Promise<{ chunk: string }> }} context
 */
export async function GET(_request, context) {
  const { chunk } = await context.params;
  const name = String(chunk ?? "").trim().toLowerCase();

  if (name === "core.xml") {
    const entries = await buildCoreSitemapEntries();
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntryXml).join("\n")}
</urlset>
`;
    return xmlResponse(body);
  }

  const match = /^locations-(\d+)\.xml$/i.exec(name);
  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const chunkId = Number(match[1]);
  if (!Number.isFinite(chunkId) || chunkId < 1) {
    return new Response("Not found", { status: 404 });
  }

  const site = getSiteUrl();
  const now = new Date().toISOString();

  let entries = [];
  try {
    const first = await withTimeout(fetchLocationsPage(1), 8000, null);
    const lastPage = Math.max(1, first?.pagination?.lastPage ?? 1);
    const fromPage = (chunkId - 1) * LOCATION_API_PAGES_PER_SITEMAP + 1;
    const toPage = Math.min(chunkId * LOCATION_API_PAGES_PER_SITEMAP, lastPage);

    if (fromPage <= lastPage) {
      entries = await withTimeout(
        fetchLocationEntriesRange(fromPage, toPage, site, now),
        20000,
        [],
      );
    }

    if (!entries.length && chunkId === 1 && first?.locations?.length) {
      entries = first.locations.map((loc) => ({
        url: `${site}/locations/${loc.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      }));
    }
  } catch {
    entries = [];
  }

  if (!entries.length && chunkId === 1) {
    // Do not emit static guessed location slugs — they 404 in CMS and inflate broken-link counts.
    entries = [
      {
        url: `${site}/locations`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.88,
      },
    ];
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntryXml).join("\n")}
</urlset>
`;

  return xmlResponse(body);
}
