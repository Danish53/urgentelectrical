import { buildPoliciesListingMetadata } from "@/data/policiesPage";
import PoliciesPageClient from "@/components/policies/PoliciesPageClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getSiteUrl } from "@/lib/siteUrl";
import { fetchPoliciesWithCardContent } from "@/services/policyApiService";
import "../home1/home1.css";

export const metadata = buildPoliciesListingMetadata();

const POLICIES_LISTING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Urgent Electrical Policies",
  url: `${getSiteUrl()}/policies`,
  description: "Privacy, cookie, and terms policies for Urgent Electrical Services.",
  isPartOf: { "@id": `${getSiteUrl()}/#website` },
};

export const revalidate = 3600;

export default async function PoliciesPage() {
  let policies = [];
  let loadError = "";

  try {
    policies = await fetchPoliciesWithCardContent();
  } catch (error) {
    loadError = getApiErrorMessage(error, "Could not load policies.");
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(POLICIES_LISTING_JSON_LD) }}
      />
      <PoliciesPageClient policies={policies} loadError={loadError} />
    </>
  );
}
