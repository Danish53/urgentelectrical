import { notFound } from "next/navigation";
import OtherServiceDetailClient from "@/components/pages/OtherServiceDetailClient";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchPageBySlug } from "@/services/pagesApiService";
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

  try {
    page = await fetchPageBySlug(slug);
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? Number(error.status) : 0;
    if (status === 404) notFound();
    loadError = getApiErrorMessage(error, "Could not load this page.");
    page = {
      id: 0,
      title: titleFromSlug(slug),
      slug: serviceSlug(slug),
      description: "",
    };
  }

  return <OtherServiceDetailClient page={page} loadError={loadError} />;
}
