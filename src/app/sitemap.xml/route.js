import { escapeXml, getLocationSitemapChunkCount, xmlResponse } from "@/lib/sitemap/buildSitemap";
import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/**
 * Public sitemap index at /sitemap.xml — Google entry point.
 */
export async function GET() {
  const site = getSiteUrl();
  const now = new Date().toISOString().slice(0, 10);
  const locationChunks = await getLocationSitemapChunkCount();

  const sitemaps = [
    `${site}/sitemaps/core.xml`,
    ...Array.from({ length: locationChunks }, (_, i) => `${site}/sitemaps/locations-${i + 1}.xml`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (loc) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`;

  return xmlResponse(body);
}
