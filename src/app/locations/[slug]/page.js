import { notFound } from "next/navigation";
import LocationDetailClient from "@/components/locations/LocationDetailClient";
import {
  buildLocationJsonLd,
  buildLocationMetadata,
} from "@/data/locationDetails";
import { mapLocationDetailFromApi } from "@/lib/locations/mapLocationDetail";
import { getLocationBySlug } from "@/lib/cms/serverLoads";
import { fetchRelatedLocationsForCity } from "@/services/locationsApiService";
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

  try {
    const related = await fetchRelatedLocationsForCity({
      cityName: city?.name || location.cityName || location.regionLabel,
      citySlug: city?.slug || location.citySlug || location.regionId,
      currentSlug: location.slug,
      currentName: location.name,
      limit: 8,
    });
    if (related.length) {
      location.nearby = related;
    }
  } catch {
    /* keep static nearby fallback from mapper */
  }

  const jsonLd = buildLocationJsonLd(location);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationDetailClient location={location} />
    </>
  );
}
