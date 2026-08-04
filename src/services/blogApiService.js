import { BLOG_API } from "@/constants/blogApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";

/**
 * @typedef {object} ApiBlogCategory
 * @property {string} category_name
 * @property {string} slug
 */

/**
 * @typedef {object} ApiBlogListItem
 * @property {string} title
 * @property {string | null | undefined} [blog_display_name]
 * @property {string} slug
 * @property {string} description
 * @property {string | null} image
 * @property {string} created_at
 * @property {string | null | undefined} [seo_title]
 * @property {string | null | undefined} [seo_description]
 */

/**
 * @typedef {object} BlogsPaginationMeta
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number} total
 */

/**
 * @typedef {object} BlogsListResult
 * @property {ApiBlogListItem[]} blogs
 * @property {BlogsPaginationMeta | null} meta
 * @property {Record<string, string | null> | null} links
 */

/**
 * @param {unknown} payload
 * @returns {ApiBlogCategory[]}
 */
export function parseBlogCategoriesResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.status === true && Array.isArray(record.data)) {
    return /** @type {ApiBlogCategory[]} */ (record.data);
  }

  if (Array.isArray(record.data)) {
    return /** @type {ApiBlogCategory[]} */ (record.data);
  }

  if (Array.isArray(payload)) {
    return /** @type {ApiBlogCategory[]} */ (payload);
  }

  return [];
}

/**
 * @param {unknown} payload
 * @returns {BlogsListResult | null}
 */
export function parseBlogsListResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);
  const data = record.data;

  if (!Array.isArray(data)) return null;

  const meta =
    record.meta && typeof record.meta === "object"
      ? /** @type {BlogsPaginationMeta} */ (record.meta)
      : null;

  const links =
    record.links && typeof record.links === "object"
      ? /** @type {Record<string, string | null>} */ (record.links)
      : null;

  return {
    blogs: /** @type {ApiBlogListItem[]} */ (data),
    meta,
    links,
  };
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
export function parseBlogDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.status === true && record.data && typeof record.data === "object") {
    return /** @type {Record<string, unknown>} */ (record.data);
  }

  if ("slug" in record && "title" in record) {
    return record;
  }

  return null;
}

/** GET /blog-categories */
export async function fetchBlogCategories() {
  const payload = await apiRequest(BLOG_API.categories, { method: "GET" });
  const categories = parseBlogCategoriesResponse(payload);

  if (!categories.length) {
    throw new ApiError("No blog categories returned from server.", { status: 0, data: payload });
  }

  return categories;
}

function blogsPathForPage(page, categorySlug) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (categorySlug && categorySlug !== "all") {
    params.set("category", categorySlug);
  }
  return `${BLOG_API.list}?${params.toString()}`;
}

/**
 * GET /blogs — single page
 * @param {{ page?: number, category?: string }} [options]
 * @returns {Promise<BlogsListResult>}
 */
export async function fetchBlogsPage(options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const category = options.category?.trim() || "";

  const payload = await apiRequest(blogsPathForPage(page, category), { method: "GET" });
  const parsed = parseBlogsListResponse(payload);

  if (!parsed) {
    throw new ApiError("Invalid blogs response from server.", { status: 0, data: payload });
  }

  return parsed;
}

/**
 * GET /blogs — all pages (for sitemap / static params)
 * @param {{ category?: string }} [options]
 */
export async function fetchAllBlogs(options = {}) {
  /** @type {ApiBlogListItem[]} */
  const all = [];
  let meta = null;
  let links = null;
  let page = 1;
  let lastPage = 1;

  do {
    const result = await fetchBlogsPage({ page, category: options.category });
    all.push(...result.blogs);
    meta = result.meta ?? meta;
    links = result.links ?? links;
    lastPage = Math.max(1, Number(result.meta?.last_page) || 1);
    page += 1;
  } while (page <= lastPage);

  return { blogs: all, meta, links };
}

/**
 * GET /blogs/{slug}
 * @param {string} slug
 */
export async function fetchBlogBySlug(slug) {
  const encoded = encodeURIComponent(slug);
  const payload = await apiRequest(`${BLOG_API.list}/${encoded}`, { method: "GET" });
  const data = parseBlogDetailResponse(payload);

  if (!data) {
    throw new ApiError("Invalid blog detail response from server.", { status: 0, data: payload });
  }

  return data;
}
