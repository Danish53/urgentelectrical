import OtherServicesPageClient from "@/components/pages/OtherServicesPageClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchPagesWithCardContent } from "@/services/pagesApiService";
import "../home1/home1.css";
import "./pages.css";

export const metadata = {
  title: "Other Services | Urgent Electrical",
  description:
    "Browse informative electrical service guides from Urgent Electrical — specialist help across Nottingham and the East Midlands.",
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

  return <OtherServicesPageClient pages={pages} loadError={loadError} />;
}
