import OtherServiceDetailClient from "@/components/pages/OtherServiceDetailClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getServiceCategories } from "@/lib/services/getServices";
import { fetchPageBySlug } from "@/services/pagesApiService";
import { fetchRelatedServiceLinks } from "@/services/relatedServicesApiService";
import { serviceSlug } from "@/lib/slugs";
import "../../home1/home1.css";
import "../pages.css";

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const page = await fetchPageBySlug(slug);
    return {
      title: page.seo_title || `${page.title} | Urgent Electrical`,
      description: page.seo_description || page.description || undefined,
    };
  } catch {
    return { title: `${titleFromSlug(slug)} | Urgent Electrical` };
  }
}

export default async function OtherServiceDetailPage({ params }) {
  const { slug } = await params;

  let page = null;
  let loadError = "";
  let relatedLinks = [];

  try {
    page = await fetchPageBySlug(slug);
  } catch (error) {
    loadError = getApiErrorMessage(error, "Could not load this page.");
    page = {
      id: 0,
      title: titleFromSlug(slug),
      slug: serviceSlug(slug),
      description: "",
    };
  }

  try {
    const { categoryMap } = await getServiceCategories();
    relatedLinks = await fetchRelatedServiceLinks(page.slug || slug, categoryMap);
  } catch {
    relatedLinks = [];
  }

  return <OtherServiceDetailClient page={page} loadError={loadError} relatedLinks={relatedLinks} />;
}
