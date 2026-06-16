const DEFAULT_SITE_URL = "https://www.urgentelectrical.services";

/** Production site origin for canonical URLs, sitemap, and JSON-LD. */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return DEFAULT_SITE_URL;
}

export const OG_IMAGE_PATH = "/og-image.jpg";

export function getOgImageUrl() {
  return `${getSiteUrl()}${OG_IMAGE_PATH}`;
}
