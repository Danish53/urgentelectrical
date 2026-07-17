import { formatBlogPublishedDisplay, parseBlogCreatedAtToISO } from "@/lib/blogs/parseBlogDate";
import { sanitizeBlogHtml } from "@/lib/blogs/sanitizeBlogHtml";

import { absoluteCmsUrl, absoluteSiteUrl, getSiteUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
const DEFAULT_AUTHOR = "Urgent Electrical Team";
const DEFAULT_COLOR = "#D3231F";
const FALLBACK_IMAGE = OG_IMAGE_PATH;

function estimateReadMinutes(text) {
  const words = (text || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.min(20, Math.ceil(words / 200) || 5));
}

function resolveImageUrl(image) {
  if (!image || typeof image !== "string") return FALLBACK_IMAGE;
  const trimmed = image.trim();
  const site = getSiteUrl();
  if (!trimmed || trimmed === site || trimmed === `${site}/`) return FALLBACK_IMAGE;
  if (trimmed.startsWith("http")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return absoluteCmsUrl(trimmed);
}

function excerptFromHtml(html, maxLen = 320) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  return text.length > maxLen ? `${text.slice(0, maxLen - 1).trim()}…` : text;
}

/**
 * @param {import("@/services/blogApiService").ApiBlogListItem} api
 * @param {{ categorySlug?: string, categoryLabel?: string, featured?: boolean }} [options]
 */
export function buildBlogPostFromListItem(api, options = {}) {
  const slug = api.slug;
  const publishedISO = parseBlogCreatedAtToISO(api.created_at);
  const excerpt = api.description?.trim() || "";
  const categorySlug = options.categorySlug ?? "all";
  const categoryLabel = options.categoryLabel ?? "Article";
  const displayName =
    typeof api.blog_display_name === "string" ? api.blog_display_name.trim() : "";
  const title = displayName || (typeof api.title === "string" ? api.title : "Article");

  return {
    slug,
    id: slug,
    title,
    excerpt,
    image: resolveImageUrl(api.image),
    color: DEFAULT_COLOR,
    category: categorySlug,
    categoryLabel,
    href: `/blog/${slug}`,
    canonicalUrl: absoluteSiteUrl(`/blog/${slug}`),
    publishedISO,
    publishedDisplay: formatBlogPublishedDisplay(api.created_at, publishedISO),
    readMinutes: estimateReadMinutes(excerpt),
    author: DEFAULT_AUTHOR,
    metaDescription: excerpt.slice(0, 160),
    keywords: [],
    featured: Boolean(options.featured),
    htmlContent: null,
    seoTitle: null,
  };
}

/**
 * @param {Record<string, unknown>} api
 * @param {{ categoryLabel?: string }} [options]
 */
export function buildBlogPostFromDetail(api, options = {}) {
  const slug = String(api.slug ?? "");
  const publishedISO = parseBlogCreatedAtToISO(
    typeof api.created_at === "string" ? api.created_at : ""
  );
  const rawHtml =
    typeof api.long_description === "string" && api.long_description.trim()
      ? api.long_description.trim()
      : "";
  const longHtml = rawHtml ? sanitizeBlogHtml(rawHtml) : null;
  let excerpt = (typeof api.description === "string" ? api.description : "").trim();
  if (!excerpt && longHtml) {
    excerpt = excerptFromHtml(longHtml);
  }
  const seoTitle = typeof api.seo_title === "string" ? api.seo_title.trim() : "";
  const seoDescription =
    typeof api.seo_description === "string" && api.seo_description.trim()
      ? api.seo_description.trim()
      : "";
  const displayName =
    typeof api.blog_display_name === "string" ? api.blog_display_name.trim() : "";
  const title =
    displayName || (typeof api.title === "string" ? api.title : "Article");

  const readSource = longHtml ? longHtml.replace(/<[^>]+>/g, " ") : excerpt;

  return {
    slug,
    id: slug,
    title,
    excerpt,
    image: resolveImageUrl(typeof api.image === "string" ? api.image : null),
    color: DEFAULT_COLOR,
    category: "all",
    categoryLabel: options.categoryLabel ?? "Article",
    href: `/blog/${slug}`,
    canonicalUrl: absoluteSiteUrl(`/blog/${slug}`),
    publishedISO,
    publishedDisplay: formatBlogPublishedDisplay(
      typeof api.created_at === "string" ? api.created_at : "",
      publishedISO
    ),
    readMinutes: estimateReadMinutes(readSource),
    author: DEFAULT_AUTHOR,
    metaDescription: (seoDescription || seoTitle || excerpt).slice(0, 160),
    keywords: seoTitle ? [seoTitle] : [],
    featured: false,
    htmlContent: longHtml,
    seoTitle: seoTitle || null,
  };
}

/**
 * @param {import("@/services/blogApiService").ApiBlogCategory[]} apiCategories
 */
export function buildBlogCategoriesFromApi(apiCategories) {
  const tabs = [{ id: "all", slug: "all", label: "All articles" }];

  for (const cat of apiCategories) {
    if (!cat.slug) continue;
    tabs.push({
      id: cat.slug,
      slug: cat.slug,
      label: cat.category_name,
    });
  }

  return tabs;
}
