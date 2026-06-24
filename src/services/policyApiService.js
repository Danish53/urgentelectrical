import { POLICY_API } from "@/constants/policyApi";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { absoluteCmsUrl } from "@/lib/siteUrl";

/**
 * @typedef {object} ApiPolicyItem
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 */

/**
 * @typedef {object} ApiPolicyDetail
 * @property {number} id
 * @property {string} title
 * @property {string} slug
 * @property {string | null | undefined} [page_image]
 * @property {string | null | undefined} [detail]
 * @property {string | null | undefined} [seo_title]
 * @property {string | null | undefined} [seo_description]
 * @property {string | null | undefined} [updated_at]
 */

/**
 * @typedef {ApiPolicyItem & {
 *   page_image?: string,
 *   short_description?: string,
 * }} PolicyCardItem
 */

/**
 * @param {unknown} payload
 * @returns {ApiPolicyItem[]}
 */
export function parsePoliciesResponse(payload) {
  if (!payload || typeof payload !== "object") return [];
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && Array.isArray(record.data)) {
    return /** @type {ApiPolicyItem[]} */ (record.data);
  }

  if (Array.isArray(record.data)) {
    return /** @type {ApiPolicyItem[]} */ (record.data);
  }

  if (Array.isArray(payload)) {
    return /** @type {ApiPolicyItem[]} */ (payload);
  }

  return [];
}

/**
 * @param {unknown} payload
 * @returns {ApiPolicyDetail | null}
 */
export function parsePolicyDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && record.data && typeof record.data === "object") {
    return /** @type {ApiPolicyDetail} */ (record.data);
  }

  if ("slug" in record && "title" in record) {
    return /** @type {ApiPolicyDetail} */ (record);
  }

  return null;
}

/** GET /policies */
export async function fetchPolicies() {
  const payload = await apiRequest(POLICY_API.list, { method: "GET" });
  const policies = parsePoliciesResponse(payload);

  if (!policies.length) {
    throw new ApiError("No policies returned from server.", { status: 0, data: payload });
  }

  return policies;
}

/**
 * GET /policies/{slug}
 * @param {string} slug
 */
export async function fetchPolicyBySlug(slug) {
  const encoded = encodeURIComponent(slug);
  const payload = await apiRequest(`${POLICY_API.list}/${encoded}`, { method: "GET" });
  const policy = parsePolicyDetailResponse(payload);

  if (!policy) {
    throw new ApiError("Invalid policy detail response from server.", { status: 0, data: payload });
  }

  return policy;
}

/**
 * @param {ApiPolicyDetail | null | undefined} policy
 */
export function getPolicyImageUrl(policy) {
  const raw = policy?.page_image;
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
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} text
 * @param {number} maxLength
 */
function truncateText(text, maxLength = 180) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * @param {ApiPolicyDetail} detail
 */
export function getPolicyShortDescription(detail) {
  const fromSeo = typeof detail?.seo_description === "string" ? detail.seo_description.trim() : "";
  if (fromSeo) return truncateText(fromSeo, 170);

  const fromHtml = typeof detail?.detail === "string" ? htmlToPlainText(detail.detail) : "";
  if (fromHtml) return truncateText(fromHtml, 170);

  return "Read the full policy details and legal terms for this section.";
}

/**
 * For cards: list API + per-policy detail fields (image + short description).
 * @returns {Promise<PolicyCardItem[]>}
 */
export async function fetchPoliciesWithCardContent() {
  const list = await fetchPolicies();

  const enriched = await Promise.all(
    list.map(async (item) => {
      try {
        const detail = await fetchPolicyBySlug(item.slug);
        return {
          ...item,
          page_image: detail.page_image || "",
          short_description: getPolicyShortDescription(detail),
        };
      } catch {
        return {
          ...item,
          page_image: "",
          short_description: `Read full details about our ${item.title.toLowerCase()} standards and legal terms.`,
        };
      }
    })
  );

  return enriched;
}
