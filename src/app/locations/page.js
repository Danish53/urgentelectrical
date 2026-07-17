import LocationsPageClient from "@/components/locations/LocationsPageClient";
import { buildLocationsMetadata, LOCATIONS_JSON_LD } from "@/data/locationsPage";
import { getSiteUrl } from "@/lib/siteUrl";
import { fetchLocationsPage } from "@/services/locationsApiService";
import "../home1/home1.css";

const meta = buildLocationsMetadata();

/**
 * @param {unknown} value
 * @param {number} fallback
 */
function parsePageParam(value, fallback = 1) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

/**
 * @param {{ searchParams: Promise<Record<string, string | string[] | undefined>> }} context
 */
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const page = parsePageParam(params?.page, 1);
  const site = getSiteUrl();
  const canonical =
    page > 1 ? `${site}/locations?page=${page}` : `${site}/locations`;

  return {
    metadataBase: new URL(site),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      ...meta.openGraph,
      url: canonical,
    },
    twitter: meta.twitter,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical },
  };
}

/**
 * @param {{ searchParams: Promise<Record<string, string | string[] | undefined>> }} context
 */
export default async function LocationsPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = parsePageParam(params?.page, 1);

  let initialLocations = [];
  let initialPagination = null;

  try {
    const result = await fetchLocationsPage(requestedPage);
    initialLocations = result.locations;
    initialPagination = result.pagination;

    // If page is past the end, fall back to last page so links stay valid.
    if (
      initialPagination &&
      requestedPage > initialPagination.lastPage &&
      initialPagination.lastPage >= 1
    ) {
      const last = await fetchLocationsPage(initialPagination.lastPage);
      initialLocations = last.locations;
      initialPagination = last.pagination;
    }
  } catch {
    initialLocations = [];
    initialPagination = null;
  }

  const listKey = initialPagination?.currentPage ?? requestedPage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCATIONS_JSON_LD) }}
      />
      <LocationsPageClient
        key={listKey}
        initialLocations={initialLocations}
        initialPagination={initialPagination}
      />
    </>
  );
}
