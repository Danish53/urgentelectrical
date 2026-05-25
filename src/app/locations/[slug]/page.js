import { notFound } from "next/navigation";
import LocationDetailClient from "@/components/locations/LocationDetailClient";
import {
  buildLocationJsonLd,
  buildLocationMetadata,
  getAllLocationSlugs,
  getLocationBySlug,
  getRelatedLocations,
} from "@/data/locationDetails";
import "../../home1/home1.css";

export function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return { title: "Area not found" };
  return buildLocationMetadata(location);
}

export default async function LocationDetailPage({ params }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const related = getRelatedLocations(location);
  const jsonLd = buildLocationJsonLd(location);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocationDetailClient location={location} related={related} />
    </>
  );
}
