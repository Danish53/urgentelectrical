import { notFound } from "next/navigation";
import LocationDetailClient from "@/components/locations/LocationDetailClient";
import {
  buildLocationJsonLd,
  buildLocationMetadata,
} from "@/data/locationDetails";
import { mapLocationDetailFromApi } from "@/lib/locations/mapLocationDetail";
import { fetchLocationBySlug } from "@/services/locationsApiService";
import "../../home1/home1.css";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const apiData = await fetchLocationBySlug(slug);
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
    apiData = await fetchLocationBySlug(slug);
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
