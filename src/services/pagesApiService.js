import {
  OTHER_SERVICES_API_PATH,
  OTHER_SERVICES_DETAIL_PATH,
  OTHER_SERVICES_PUBLIC_PATH,
  PAGES_API,
} from "@/constants/pagesApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";
import { resolveServiceSlugFromApi } from "@/lib/services/buildBookableService";
import { serviceSlug } from "@/lib/slugs";
import { fetchServicesList } from "@/services/servicesApiService";

import { getApiSiteOrigin, absoluteCmsUrl } from "@/lib/siteUrl";
import { SERVER_FETCH } from "@/lib/api/serverFetch";

/**
 * @typedef {object} ApiInfoPage
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string} [description]
 * @property {string} [image]
 * @property {string} [page_image]
 * @property {string} [short_description]
 * @property {string} [full_title]
 */

/**
 * @typedef {object} OtherServicesPaginationMeta
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number} total
 * @property {number} from
 * @property {number} to
 */

/**
 * @typedef {object} OtherServicesListResult
 * @property {(ApiInfoPage & { short_description: string })[]} pages
 * @property {OtherServicesPaginationMeta | null} meta
 */

/**
 * @typedef {ApiInfoPage & {
 *   detail?: string,
 *   long_description?: string,
 *   seo_title?: string,
 *   seo_description?: string,
 *   updated_at?: string,
 *   benefits?: string[],
 *   common_signs?: string[],
 *   how_it_work?: { topic?: string, description?: string, title?: string, text?: string }[],
 *   faqs?: { q: string, a: string }[],
 *   source?: "other-services",
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
 * @param {Record<string, unknown>} item
 * @returns {ApiInfoPage}
 */
export function normalizeOtherServiceListItem(item) {
  const fullTitle = String(item.title ?? "Service page").trim() || "Service page";
  const displayName =
    (typeof item.page_display_name === "string" && item.page_display_name.trim()) || fullTitle;

  return {
    id: 0,
    title: displayName,
    full_title: displayName !== fullTitle ? fullTitle : undefined,
    slug: normalizePageSlug(item),
    description: typeof item.description === "string" ? item.description.trim() : "",
    page_image: typeof item.page_image === "string" ? item.page_image : undefined,
  };
}

/**
 * @param {Record<string, unknown>} data
 * @returns {ApiInfoPageDetail}
 */
export function normalizeOtherServiceDetailItem(data) {
  const fullTitle = String(data.title ?? "Service page").trim() || "Service page";
  const displayName =
    (typeof data.page_display_name === "string" && data.page_display_name.trim()) || fullTitle;
  const description = typeof data.description === "string" ? data.description.trim() : "";

  /** @type {string[] | undefined} */
  const benefits = Array.isArray(data.benefits)
    ? data.benefits
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => String(item).trim())
    : undefined;

  /** @type {string[] | undefined} */
  const common_signs = Array.isArray(data.common_signs)
    ? data.common_signs
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => String(item).trim())
    : undefined;

  /** @type {ApiInfoPageDetail["how_it_work"]} */
  const how_it_work = Array.isArray(data.how_it_work)
    ? data.how_it_work
        .filter((item) => item && typeof item === "object")
        .map((item) => {
          const row = /** @type {Record<string, unknown>} */ (item);
          return {
            topic: String(row.topic ?? row.title ?? "").trim(),
            description: String(row.description ?? row.text ?? "").trim(),
          };
        })
        .filter((item) => item.topic || item.description)
    : undefined;

  /** @type {ApiInfoPageDetail["faqs"] | undefined} */
  let faqs;
  if (data.faqs && typeof data.faqs === "object") {
    const faqRecord = /** @type {Record<string, unknown>} */ (data.faqs);
    const questions = Array.isArray(faqRecord.question) ? faqRecord.question : [];
    const answers = Array.isArray(faqRecord.answer) ? faqRecord.answer : [];
    faqs = questions
      .map((question, index) => ({
        q: String(question ?? "").trim(),
        a: String(answers[index] ?? "").trim(),
      }))
      .filter((item) => item.q);
  }

  return {
    id: Number(data.id) || 0,
    title: displayName,
    full_title: displayName !== fullTitle ? fullTitle : undefined,
    slug: normalizePageSlug(data),
    description,
    page_image: typeof data.page_image === "string" ? data.page_image : undefined,
    seo_title: typeof data.seo_title === "string" ? data.seo_title : undefined,
    seo_description: typeof data.seo_description === "string" ? data.seo_description : undefined,
    detail: description,
    long_description: description || undefined,
    benefits,
    common_signs,
    how_it_work,
    faqs,
    updated_at: typeof data.updated_at === "string" ? data.updated_at : undefined,
    source: "other-services",
  };
}

/**
 * @param {unknown} payload
 * @returns {ApiInfoPageDetail | null}
 */
export function parseOtherServiceDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);
  let data = null;

  if (record.status === true && record.data && typeof record.data === "object") {
    data = /** @type {Record<string, unknown>} */ (record.data);
  } else if (record.success === true && record.data && typeof record.data === "object") {
    data = /** @type {Record<string, unknown>} */ (record.data);
  } else if ("slug" in record || "title" in record) {
    data = record;
  }

  if (!data) return null;
  return normalizeOtherServiceDetailItem(data);
}

/**
 * GET /api/other-services/{slug}
 * @param {string} slug
 * @param {RequestInit} [fetchOptions]
 */
async function fetchOtherServiceDetailPayload(slug, fetchOptions = {}) {
  const encoded = encodeURIComponent(slug);
  const urls = [
    `${getApiSiteOrigin()}${OTHER_SERVICES_DETAIL_PATH}/${encoded}`,
    `${getApiSiteOrigin()}${OTHER_SERVICES_PUBLIC_PATH}/${encoded}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        ...fetchOptions,
      });

      if (!response.ok) continue;

      const text = await response.text();
      if (!text) continue;

      return JSON.parse(text);
    } catch {
      /* try next URL */
    }
  }

  try {
    const payload = await apiRequest(`${OTHER_SERVICES_API_PATH}/${encoded}`, { method: "GET" });
    return payload;
  } catch {
    return null;
  }
}

/**
 * @param {string} slug
 * @returns {Promise<ApiInfoPageDetail | null>}
 */
export async function fetchOtherServiceBySlug(slug) {
  const urlSlug = String(slug ?? "").trim();
  if (!urlSlug) return null;

  const isServer = typeof window === "undefined";
  let payload;

  try {
    payload = await fetchOtherServiceDetailPayload(urlSlug, isServer ? SERVER_FETCH : {});
  } catch {
    return null;
  }

  const page = parseOtherServiceDetailResponse(payload);
  return page ? { ...page, slug: urlSlug } : null;
}

/**
 * @param {unknown} payload
 * @returns {{ pages: ApiInfoPage[], meta: OtherServicesPaginationMeta | null } | null}
 */
export function parseOtherServicesListResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);
  if (!Array.isArray(record.data)) return null;

  const pages = record.data
    .filter((item) => item && typeof item === "object")
    .map((item) => normalizeOtherServiceListItem(/** @type {Record<string, unknown>} */ (item)));

  const current_page = Number(record.current_page);
  const last_page = Number(record.last_page);

  if (!Number.isFinite(current_page) || !Number.isFinite(last_page)) {
    return { pages, meta: null };
  }

  const per_page = Number(record.per_page);
  const total = Number(record.total);
  const from = Number(record.from);
  const to = Number(record.to);
  const safePerPage = Number.isFinite(per_page) && per_page > 0 ? per_page : pages.length;
  const safeTotal = Number.isFinite(total) ? total : pages.length;
  const safeFrom = Number.isFinite(from) ? from : (current_page - 1) * safePerPage + 1;
  const safeTo = Number.isFinite(to) ? to : safeFrom + Math.max(pages.length, 1) - 1;

  return {
    pages,
    meta: {
      current_page,
      last_page,
      per_page: safePerPage,
      total: safeTotal,
      from: safeFrom,
      to: safeTo,
    },
  };
}

async function fetchOtherServicesPayload(page = 1, fetchOptions = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const url = `${getApiSiteOrigin()}${OTHER_SERVICES_PUBLIC_PATH}?page=${safePage}`;
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      ...fetchOptions,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  if (!response.ok) {
    throw new ApiError(`Could not load other services (${response.status}).`, {
      status: response.status,
    });
  }

  const text = await response.text();
  if (!text) {
    throw new ApiError("Empty other services response from server.", { status: 0 });
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("Invalid other services response from server.", { status: 0 });
  }
}

/**
 * GET /api/other-services?page={n}
 * @param {number} [page]
 * @returns {Promise<OtherServicesListResult>}
 */
export async function fetchOtherServicesPage(page = 1) {
  const isServer = typeof window === "undefined";
  const payload = await fetchOtherServicesPayload(page, isServer ? SERVER_FETCH : {});
  const parsed = parseOtherServicesListResponse(payload);

  if (!parsed) {
    throw new ApiError("Invalid other services response from server.", { status: 0, data: payload });
  }

  return {
    pages: parsed.pages.map((item) => ({
      ...item,
      short_description: getPageShortDescription(item),
    })),
    meta: parsed.meta,
  };
}

/** All pages from public other-services API (search / sitemap). */
export async function fetchAllOtherServices() {
  /** @type {(ApiInfoPage & { short_description: string })[]} */
  const all = [];
  let meta = null;
  let page = 1;
  let lastPage = 1;

  do {
    const payload = await fetchOtherServicesPayload(page, SERVER_FETCH);
    const parsed = parseOtherServicesListResponse(payload);
    if (!parsed) break;

    all.push(
      ...parsed.pages.map((item) => ({
        ...item,
        short_description: getPageShortDescription(item),
      }))
    );
    meta = parsed.meta ?? meta;
    lastPage = Math.max(1, Number(parsed.meta?.last_page) || 1);
    page += 1;
  } while (page <= lastPage);

  return { pages: all, meta };
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
 * GET other-services/{slug} only. No soft stub / services fallback pages.
 * @param {string} slug
 * @returns {Promise<ApiInfoPageDetail>}
 */
export async function fetchPageBySlug(slug) {
  const urlSlug = String(slug ?? "").trim();
  if (!urlSlug) {
    throw new ApiError("Page slug is required.", { status: 400 });
  }

  const otherService = await fetchOtherServiceBySlug(urlSlug);
  if (otherService) return otherService;

  throw new ApiError("Page not found.", { status: 404 });
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
  return absoluteCmsUrl(trimmed);
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

  const fullTitle =
    "full_title" in page && typeof page.full_title === "string" ? page.full_title.trim() : "";
  if (fullTitle && fullTitle !== page.title) {
    return truncateText(fullTitle, 170);
  }

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
