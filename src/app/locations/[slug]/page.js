import { notFound } from "next/navigation";
import LocationDetailClient from "@/components/locations/LocationDetailClient";
import {
  buildLocationJsonLd,
  buildLocationMetadata,
} from "@/data/locationDetails";
import { mapLocationDetailFromApi } from "@/lib/locations/mapLocationDetail";
import { getLocationBySlug } from "@/lib/cms/serverLoads";
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
  const jsonLd = buildLocationJsonLd(location);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationDetailClient location={location} />
    </>
  );
}
