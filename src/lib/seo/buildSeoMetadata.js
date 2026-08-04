import { DOCUMENT_TITLE_BRAND, documentTitle, stripTitleBrand } from "@/lib/seo/documentTitle";

/**
 * Clean page title for `<meta name="title" content="...">` (no brand suffix).
 * @param {string | null | undefined} rawTitle
 */
export function metaNameTitle(rawTitle) {
  let base = stripTitleBrand(rawTitle);
  if (/\bin$/i.test(base)) {
    base = base.replace(/\s+in$/i, "").trim();
  }
  return base || DOCUMENT_TITLE_BRAND;
}

/**
 * Ensures Next.js emits `<meta name="title" content="...">` alongside `<title>`.
 * @param {Record<string, unknown>} metadata
 * @param {string | null | undefined} rawTitle Source SEO/static title (before brand template)
 */
export function withMetaNameTitle(metadata, rawTitle) {
  const fromAbsolute =
    metadata?.title &&
    typeof metadata.title === "object" &&
    typeof /** @type {{ absolute?: string }} */ (metadata.title).absolute === "string"
      ? /** @type {{ absolute: string }} */ (metadata.title).absolute
      : typeof metadata?.title === "string"
        ? metadata.title
        : "";

  const content = metaNameTitle(rawTitle || fromAbsolute);

  return {
    ...metadata,
    other: {
      ...(metadata.other && typeof metadata.other === "object" ? metadata.other : {}),
      title: content,
    },
  };
}

/**
 * Standard title + description + `<meta name="title">` for App Router pages.
 * @param {string | null | undefined} title
 * @param {string | null | undefined} description
 * @param {Record<string, unknown>} [rest]
 */
export function buildSeoMetadata(title, description, rest = {}) {
  const pageTitle = documentTitle(title);
  const desc = String(description ?? "").trim();
  const { other: restOther, openGraph, twitter, ...restFields } = rest;

  return withMetaNameTitle(
    {
      title: pageTitle,
      description: desc,
      ...restFields,
      other: restOther && typeof restOther === "object" ? restOther : undefined,
      openGraph: openGraph
        ? {
            ...openGraph,
            title: openGraph.title ?? pageTitle.absolute,
            description: openGraph.description ?? desc,
          }
        : undefined,
      twitter: twitter
        ? {
            ...twitter,
            title: twitter.title ?? pageTitle.absolute,
            description: twitter.description ?? desc,
          }
        : undefined,
    },
    title
  );
}
