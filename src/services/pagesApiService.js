import { PAGES_API } from "@/constants/pagesApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";
import { resolveServiceSlugFromApi } from "@/lib/services/buildBookableService";
import { resolveServiceApiSlugCandidates } from "@/lib/services/resolveServiceDetailSlug";
import { serviceSlug } from "@/lib/slugs";
import { fetchServiceBySlug, fetchServicesList } from "@/services/servicesApiService";

const SITE = "https://www.urgentelectrical.services";

function getPublicSiteOrigin() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "";
  if (apiBase) {
    return apiBase.replace(/\/api\/?$/i, "").replace(/\/$/, "");
  }
  return SITE;
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * @param {Record<string, unknown>} api
 * @param {string} urlSlug
 * @returns {ApiInfoPageDetail}
 */
function pageFromServiceApi(api, urlSlug) {
  const base = normalizePageListItem(/** @type {Record<string, unknown>} */ (api));
  return {
    ...base,
    slug: urlSlug,
    detail:
      (typeof api.long_description === "string" && api.long_description) ||
      (typeof api.description === "string" && api.description) ||
      "",
    long_description:
      typeof api.long_description === "string" ? api.long_description : undefined,
    seo_title: typeof api.seo_title === "string" ? api.seo_title : undefined,
    seo_description:
      typeof api.seo_description === "string" ? api.seo_description : undefined,
  };
}

/** @param {string} slug */
async function fetchPublicCmsPageBySlug(slug) {
  const encoded = encodeURIComponent(slug);
  const url = `${getPublicSiteOrigin()}/public/api/pages/${encoded}`;
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  let payload = null;
  const text = await response.text();
  if (!text) return null;

  try {
    payload = JSON.parse(text);
  } catch {
    return null;
  }

  const page = parsePageDetailResponse(payload);
  return page ? { ...page, slug } : null;
}

/**
 * @typedef {object} ApiInfoPage
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [description]
 * @property {string} [image]
 * @property {string} [page_image]
 * @property {string} [short_description]
 */

/**
 * @typedef {ApiInfoPage & {
 *   detail?: string,
 *   long_description?: string,
 *   seo_title?: string,
 *   seo_description?: string,
 *   updated_at?: string,
 * }} ApiInfoPageDetail
 */

/**
 * @param {Record<string, unknown>} item
 */
function normalizePageSlug(item) {
  const raw = item.slug;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  const title = typeof item.title === "string" ? item.title : "";
  return serviceSlug(title || "page");
}

/**
 * @param {Record<string, unknown>} item
 * @returns {ApiInfoPage}
 */
export function normalizePageListItem(item) {
  const description =
    (typeof item.description === "string" && item.description.trim()) ||
    (typeof item.seo_description === "string" && item.seo_description.trim()) ||
    "";

  return {
    id: Number(item.id) || 0,
    title: String(item.title ?? "Service page"),
    slug: normalizePageSlug(item),
    description,
    image: typeof item.image === "string" ? item.image : undefined,
    page_image: typeof item.page_image === "string" ? item.page_image : undefined,
  };
}

/**
 * @param {unknown} payload
 * @returns {ApiInfoPage[]}
 */
export function parsePagesListResponse(payload) {
  if (!payload || typeof payload !== "object") return [];
  const record = /** @type {Record<string, unknown>} */ (payload);

  let list = null;
  if (record.success === true && Array.isArray(record.data)) {
    list = record.data;
  } else if (Array.isArray(record.data)) {
    list = record.data;
  } else if (Array.isArray(payload)) {
    list = payload;
  }

  if (!list) return [];
  return list
    .filter((item) => item && typeof item === "object")
    .map((item) => normalizePageListItem(/** @type {Record<string, unknown>} */ (item)));
}

/**
 * @param {unknown} payload
 * @returns {ApiInfoPageDetail | null}
 */
export function parsePageDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  let data = null;
  if (record.success === true && record.data && typeof record.data === "object") {
    data = /** @type {Record<string, unknown>} */ (record.data);
  } else if ("title" in record) {
    data = record;
  }

  if (!data) return null;

  const base = normalizePageListItem(data);
  return {
    ...base,
    detail:
      (typeof data.detail === "string" && data.detail) ||
      (typeof data.long_description === "string" && data.long_description) ||
      "",
    long_description:
      typeof data.long_description === "string" ? data.long_description : undefined,
    seo_title: typeof data.seo_title === "string" ? data.seo_title : undefined,
    seo_description: typeof data.seo_description === "string" ? data.seo_description : undefined,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : undefined,
  };
}

/** GET /pages */
export async function fetchPagesList() {
  const payload = await apiRequest(PAGES_API.list, { method: "GET" });
  return parsePagesListResponse(payload);
}

/**
 * Use bookable services as informative cards when /pages is empty or unavailable.
 * @returns {Promise<ApiInfoPage[]>}
 */
async function fetchPagesFromServicesFallback() {
  const { services } = await fetchServicesList();
  return services.map((item) => {
    const description =
      (typeof item.description === "string" && item.description.trim()) || "";
    return {
      id: Number(item.id) || 0,
      title: String(item.title ?? "Electrical service"),
      slug: resolveServiceSlugFromApi(item),
      description,
      image: typeof item.image === "string" ? item.image : undefined,
      page_image: typeof item.image === "string" ? item.image : undefined,
    };
  });
}

/**
 * GET /pages/{slug} — public CMS, then services API (resolved slugs), then local fallback.
 * @param {string} slug
 */
export async function fetchPageBySlug(slug) {
  const urlSlug = String(slug ?? "").trim();
  if (!urlSlug) {
    throw new ApiError("Page slug is required.", { status: 400 });
  }

  const encoded = encodeURIComponent(urlSlug);

  try {
    const payload = await apiRequest(`${PAGES_API.list}/${encoded}`, { method: "GET" });
    const page = parsePageDetailResponse(payload);
    if (page) return { ...page, slug: urlSlug };
  } catch {
    /* CMS /pages API not available on all environments */
  }

  const publicPage = await fetchPublicCmsPageBySlug(urlSlug);
  if (publicPage) return publicPage;

  for (const candidate of resolveServiceApiSlugCandidates(urlSlug)) {
    try {
      const api = await fetchServiceBySlug(candidate);
      return pageFromServiceApi(api, urlSlug);
    } catch {
      /* try next candidate */
    }
  }

  return {
    id: 0,
    title: titleFromSlug(urlSlug),
    slug: serviceSlug(urlSlug) || urlSlug,
    description: "",
  };
}

/**
 * @param {ApiInfoPage | ApiInfoPageDetail | null | undefined} page
 */
export function getPageImageUrl(page) {
  const raw = page?.page_image || page?.image;
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) return trimmed;
  return `${SITE}/${trimmed.replace(/^\/+/, "")}`;
}

/**
 * @param {string} html
 */
function htmlToPlainText(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} text
 * @param {number} maxLength
 */
function truncateText(text, maxLength = 170) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * @param {ApiInfoPage | ApiInfoPageDetail} page
 */
export function getPageShortDescription(page) {
  const fromDesc = typeof page.description === "string" ? page.description.trim() : "";
  if (fromDesc) return truncateText(fromDesc, 170);

  const detail = "detail" in page && typeof page.detail === "string" ? page.detail : "";
  const fromHtml = detail ? htmlToPlainText(detail) : "";
  if (fromHtml) return truncateText(fromHtml, 170);

  return "Learn more about this electrical service and how we can help.";
}

/**
 * Listing cards — fast: list endpoint only, services fallback if needed.
 * @returns {Promise<(ApiInfoPage & { short_description: string })[]>}
 */
export async function fetchPagesWithCardContent() {
  let list = [];

  try {
    list = await fetchPagesList();
  } catch {
    list = [];
  }

  if (!list.length) {
    list = await fetchPagesFromServicesFallback();
  }

  if (!list.length) {
    throw new ApiError("No services available to display.", { status: 0 });
  }

  return list.map((item) => ({
    ...item,
    short_description: getPageShortDescription(item),
  }));
}
