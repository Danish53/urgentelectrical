import { getAllBlogPosts } from "@/lib/blogs/getBlogs";
import { ALL_LOCATIONS } from "@/data/locationDetails";
import { getBookableServices } from "@/lib/services/getServices";
import { getSiteUrl } from "@/lib/siteUrl";
import { fetchLocationsPage } from "@/services/locationsApiService";
import { fetchAllOtherServices, fetchPagesList } from "@/services/pagesApiService";
import { fetchPolicies } from "@/services/policyApiService";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const LOCATION_API_PAGES_PER_SITEMAP = 20;
export const LOCATION_FETCH_CONCURRENCY = 10;

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} ms
 * @param {T} fallback
 */
export async function withTimeout(promise, ms, fallback) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * @param {string} value
 */
export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * @param {{ url: string, lastModified?: string, changeFrequency?: string, priority?: number }} entry
 */
export function urlEntryXml(entry) {
  const parts = [`    <loc>${escapeXml(entry.url)}</loc>`];
  if (entry.lastModified) parts.push(`    <lastmod>${entry.lastModified}</lastmod>`);
  if (entry.changeFrequency) parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
  if (typeof entry.priority === "number") {
    parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
  }
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

/**
 * @param {string} body
 */
export function xmlResponse(body) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

async function getPolicyEntries(site, now) {
  try {
    const policies = await withTimeout(fetchPolicies(), 8000, []);
    return policies.map((policy) => ({
      url: `${site}/policies/${policy.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

async function getPageEntries(site, now) {
  try {
    const result = await withTimeout(fetchAllOtherServices(), 10000, null);
    if (result?.pages?.length) {
      return result.pages.map((page) => ({
        url: `${site}/pages/${page.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }
  } catch {
    /* fall through */
  }

  try {
    const pages = await withTimeout(fetchPagesList(), 8000, []);
    return pages.map((page) => ({
      url: `${site}/pages/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export async function buildCoreSitemapEntries() {
  const site = getSiteUrl();
  const now = new Date().toISOString();

  const [bookable, blogPosts, policyEntries, pageEntries] = await Promise.all([
    withTimeout(getBookableServices(), 10000, []),
    withTimeout(getAllBlogPosts(), 10000, []),
    getPolicyEntries(site, now),
    getPageEntries(site, now),
  ]);

  return [
    { url: site, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${site}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/pages`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${site}/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${site}/contact-us`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    { url: `${site}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.88 },
    {
      url: `${site}/niceic-certificate-of-excellence`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...bookable.map((s) => ({
      url: s.canonicalUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    })),
    ...blogPosts.map((p) => ({
      url: p.canonicalUrl,
      lastModified: new Date(p.publishedISO).toISOString(),
      changeFrequency: "monthly",
      priority: 0.75,
    })),
    ...pageEntries,
    ...policyEntries,
  ];
}

/**
 * @param {number} fromPage
 * @param {number} toPage
 * @param {string} site
 * @param {string} now
 */
export async function fetchLocationEntriesRange(fromPage, toPage, site, now) {
  /** @type {{ url: string, lastModified: string, changeFrequency: string, priority: number }[]} */
  const entries = [];

  for (let start = fromPage; start <= toPage; start += LOCATION_FETCH_CONCURRENCY) {
    const end = Math.min(start + LOCATION_FETCH_CONCURRENCY - 1, toPage);
    const pages = [];
    for (let page = start; page <= end; page += 1) pages.push(page);

    const settled = await Promise.allSettled(pages.map((page) => fetchLocationsPage(page)));
    for (const result of settled) {
      if (result.status !== "fulfilled") continue;
      result.value.locations.forEach((loc) => {
        entries.push({
          url: `${site}/locations/${loc.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
    }
  }

  return entries;
}

export async function getLocationSitemapChunkCount() {
  try {
    const first = await withTimeout(fetchLocationsPage(1), 8000, null);
    const lastPage = Math.max(1, first?.pagination?.lastPage ?? 1);
    return Math.max(1, Math.ceil(lastPage / LOCATION_API_PAGES_PER_SITEMAP));
  } catch {
    return Math.max(1, Math.ceil(ALL_LOCATIONS.length / 50));
  }
}
