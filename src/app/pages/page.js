import { buildPagesListingMetadata } from "@/data/pagesSeo";
import OtherServicesPageClient from "@/components/pages/OtherServicesPageClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getSiteUrl } from "@/lib/siteUrl";
import { fetchPagesWithCardContent } from "@/services/pagesApiService";
import "../home1/home1.css";
import "./pages.css";

export const metadata = buildPagesListingMetadata();

const PAGES_LISTING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Other Electrical Services & Guides",
  url: `${getSiteUrl()}/pages`,
  description: "Informative electrical guides from Urgent Electrical Services.",
  isPartOf: { "@id": `${getSiteUrl()}/#website` },
};

export const revalidate = 3600;

export default async function OtherServicesPage() {
  let pages = [];
  let loadError = "";

  try {
    pages = await fetchPagesWithCardContent();
  } catch (error) {
    loadError = getApiErrorMessage(error, "Could not load other services.");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGES_LISTING_JSON_LD) }}
      />
      <OtherServicesPageClient pages={pages} loadError={loadError} />
    </>
  );
}
