"use client";

import OtherServiceDetailRich from "@/components/pages/OtherServiceDetailRich";
import { getPageDetailLayout } from "@/data/pageDetailMocks";
import { getPageImageUrl } from "@/services/pagesApiService";

/**
 * @param {{
 *   page: import("@/services/pagesApiService").ApiInfoPageDetail,
 *   loadError?: string,
 *   relatedLinks?: { slug: string, label: string, href: string }[],
 *   resolvedServiceAreas?: { name: string, href: string, slug?: string }[] | null,
 * }} props
 */
export default function OtherServiceDetailClient({
  page,
  loadError = "",
  relatedLinks = [],
  resolvedServiceAreas = null,
}) {
  const slug = page?.slug ?? "";
  const richLayout = getPageDetailLayout(slug, page);
  const layout =
    Array.isArray(resolvedServiceAreas) && resolvedServiceAreas.length
      ? { ...richLayout, serviceAreas: resolvedServiceAreas }
      : richLayout;
  const isApiPage = page?.source === "other-services";
  const imageUrl = getPageImageUrl(page);

  const updatedAt = page.updated_at
    ? new Date(page.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <OtherServiceDetailRich
      layout={layout}
      loadError={loadError}
      imageUrl={isApiPage ? imageUrl : imageUrl || richLayout.image}
      updatedAt={updatedAt}
      relatedLinks={relatedLinks}
    />
  );
}
