"use client";

import OtherServiceDetailRich from "@/components/pages/OtherServiceDetailRich";
import { getPageDetailLayout } from "@/data/pageDetailMocks";
import { getPageImageUrl } from "@/services/pagesApiService";

/**
 * @param {{
 *   page: import("@/services/pagesApiService").ApiInfoPageDetail,
 *   loadError?: string,
 * }} props
 */
export default function OtherServiceDetailClient({ page, loadError = "" }) {
  const slug = page?.slug ?? "";
  const richLayout = getPageDetailLayout(slug, page);
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
      layout={richLayout}
      loadError={loadError}
      imageUrl={imageUrl || richLayout.image}
      updatedAt={updatedAt}
    />
  );
}
