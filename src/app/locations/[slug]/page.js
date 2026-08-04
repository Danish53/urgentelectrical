import { notFound } from "next/navigation";
import LocationDetailClient from "@/components/locations/LocationDetailClient";
import {
  buildLocationJsonLd,
  buildLocationMetadata,
} from "@/data/locationDetails";
import { LOCATION_AREAS_BY_REGION } from "@/data/locationsPage";
import { mapLocationDetailFromApi } from "@/lib/locations/mapLocationDetail";
import {
  getLocationSlugIndex,
  lookupLocationHref,
  lookupLocationSlug,
} from "@/lib/locations/locationSlugIndex";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";
import { getLocationBySlug } from "@/lib/cms/serverLoads";
import { fetchNearbyLocationsForArea } from "@/services/locationsApiService";
import "../../home1/home1.css";
import "../../pages/pages.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const apiData = await getLocationBySlug(slug);
    const location = mapLocationDetailFromApi(apiData);
    return buildLocationMetadata(location);
  } catch {
    return { title: "Area not found" };
  }
}

/**
 * Resolve static regional area names against live CMS slugs only.
 * @param {{ currentSlug: string, currentName: string, regionId?: string, limit?: number }} input
 */
async function resolveFallbackNearby(input) {
  const limit = input.limit ?? 8;
  const regionId = input.regionId || "nottingham";
  const areas = LOCATION_AREAS_BY_REGION[regionId] ?? [];
  const currentKey = normalizeLocationName(input.currentName);
  const index = await getLocationSlugIndex();

  /** @type {{ name: string, slug: string, href: string }[]} */
  const out = [];
  for (const areaName of areas) {
    if (out.length >= limit) break;
    if (normalizeLocationName(areaName) === currentKey) continue;
    const slug = lookupLocationSlug(areaName, index);
    if (!slug || slug === input.currentSlug) continue;
    out.push({
      name: areaName,
      slug,
      href: lookupLocationHref(areaName, index),
    });
  }
  return out;
}

export default async function LocationDetailPage({ params }) {
  const { slug } = await params;

  let apiData;
  try {
    apiData = await getLocationBySlug(slug);
  } catch {
    notFound();
  }

  const location = mapLocationDetailFromApi(apiData);
  const city = apiData?.city && typeof apiData.city === "object" ? apiData.city : null;

  let nearby = [];
  try {
    nearby = await fetchNearbyLocationsForArea({
      cityName: city?.name || location.cityName || location.regionLabel,
      citySlug: city?.slug || location.citySlug || location.regionId,
      currentSlug: location.slug,
      currentName: location.name,
      limit: 8,
    });
  } catch {
    nearby = [];
  }

  if (!nearby.length) {
    try {
      nearby = await resolveFallbackNearby({
        currentSlug: location.slug,
        currentName: location.name,
        regionId: location.regionId || location.citySlug || "nottingham",
        limit: 8,
      });
    } catch {
      nearby = [];
    }
  }

  // Never keep guessed static nearby that can 404.
  location.nearby = nearby;

  const jsonLd = buildLocationJsonLd(location);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationDetailClient location={location} />
    </>
  );
}
