import { buildPageDetailMetadata, buildPageDetailJsonLd } from "@/data/pagesSeo";
import OtherServiceDetailClient from "@/components/pages/OtherServiceDetailClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getServiceCategories } from "@/lib/services/getServices";
import { getPageBySlug } from "@/lib/cms/serverLoads";
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

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const page = await getPageBySlug(slug);
    return buildPageDetailMetadata(page);
  } catch {
    return {
      title: `${titleFromSlug(slug)} | Urgent Electrical`,
      robots: { index: false, follow: false },
    };
  }
}

export default async function OtherServiceDetailPage({ params }) {
  const { slug } = await params;

  let page = null;
  let loadError = "";
  let relatedLinks = [];

  try {
    page = await getPageBySlug(slug);
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

  const jsonLd = page && !loadError && page.slug ? buildPageDetailJsonLd(page) : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <OtherServiceDetailClient page={page} loadError={loadError} relatedLinks={relatedLinks} />
    </>
  );
}
