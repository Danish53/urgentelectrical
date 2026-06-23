import LocationsPageClient from "@/components/locations/LocationsPageClient";
import { buildLocationsMetadata, LOCATIONS_JSON_LD } from "@/data/locationsPage";
import { getSiteUrl } from "@/lib/siteUrl";
import "../home1/home1.css";

const meta = buildLocationsMetadata();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  keywords: meta.keywords,
  openGraph: meta.openGraph,
  twitter: meta.twitter,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: meta.alternates,
};

export default function LocationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCATIONS_JSON_LD) }} />
      <LocationsPageClient />
    </>
  );
}
