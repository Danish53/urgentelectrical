/**
 * Remote API/CDN URLs time out via Next.js `/_next/image` in dev and production.
 * Load them directly while keeping optimization for local `/public` assets.
 *
 * @param {string | undefined | null} src
 */
export function isRemoteImageSrc(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

/**
 * @param {string | undefined | null} src
 */
export function shouldUnoptimizeImage(src) {
  return isRemoteImageSrc(src);
}
