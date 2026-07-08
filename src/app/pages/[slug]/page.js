import { notFound } from "next/navigation";
import { buildPageDetailMetadata, buildPageDetailJsonLd } from "@/data/pagesSeo";
import OtherServiceDetailClient from "@/components/pages/OtherServiceDetailClient";
import { getServiceCategories } from "@/lib/services/getServices";
import { getPageBySlug } from "@/lib/cms/serverLoads";
import { fetchRelatedServiceLinks } from "@/services/relatedServicesApiService";
import "../../home1/home1.css";
import "../pages.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const page = await getPageBySlug(slug);
    return buildPageDetailMetadata(page);
  } catch {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }
}

export default async function OtherServiceDetailPage({ params }) {
  const { slug } = await params;

  let page;
  try {
    page = await getPageBySlug(slug);
  } catch {
    notFound();
  }

  let relatedLinks = [];
  try {
    const { categoryMap } = await getServiceCategories();
    relatedLinks = await fetchRelatedServiceLinks(page.slug || slug, categoryMap);
  } catch {
    relatedLinks = [];
  }

  const jsonLd = page?.slug ? buildPageDetailJsonLd(page) : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <OtherServiceDetailClient page={page} relatedLinks={relatedLinks} />
    </>
  );
}