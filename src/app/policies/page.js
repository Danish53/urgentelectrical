import PoliciesPageClient from "@/components/policies/PoliciesPageClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchPoliciesWithCardContent } from "@/services/policyApiService";
import "../home1/home1.css";

export const metadata = {
  title: "Policies | Urgent Electrical",
  description: "Read Urgent Electrical privacy, cookie and service terms policies.",
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

  return <PoliciesPageClient policies={policies} loadError={loadError} />;
}
