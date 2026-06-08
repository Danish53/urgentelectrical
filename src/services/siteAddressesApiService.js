import { SITE_ADDRESSES_PROXY } from "@/constants/siteAddressesApi";
import {
  sameOriginAuthGet,
  sameOriginAuthPost,
  sameOriginAuthRequest,
} from "@/lib/api/sameOriginPost";
import {
  apiRecordToSavedSite,
  parseSiteDetailResponse,
  parseSitesListPayload,
} from "@/lib/sites/siteApiMapper";

/**
 * GET /site-addresses (Laravel: { status, data: { data, current_page, … } })
 * @param {number} [page]
 */
export async function fetchSiteAddresses(page = 1) {
  const url = page > 1 ? `${SITE_ADDRESSES_PROXY.list}?page=${page}` : SITE_ADDRESSES_PROXY.list;
  const payload = await sameOriginAuthGet(url);
  return parseSitesListPayload(payload);
}

/** GET /site-addresses/{id} */
export async function fetchSiteAddressById(id) {
  const payload = await sameOriginAuthGet(SITE_ADDRESSES_PROXY.detail(id));
  const row = parseSiteDetailResponse(payload);
  if (!row) throw new Error("Site address not found.");
  return row;
}

/** POST /site-addresses */
export async function createSiteAddress(body) {
  const payload = await sameOriginAuthPost(SITE_ADDRESSES_PROXY.list, body);
  const row = parseSiteDetailResponse(payload);
  if (!row) return body;
  return row;
}

/** PUT /site-addresses/{id} */
export async function updateSiteAddress(id, body) {
  const payload = await sameOriginAuthRequest(SITE_ADDRESSES_PROXY.detail(id), "PUT", body);
  const row = parseSiteDetailResponse(payload);
  if (!row) return { id, ...body };
  return row;
}

/** DELETE /site-addresses/{id} */
export async function deleteSiteAddress(id) {
  await sameOriginAuthRequest(SITE_ADDRESSES_PROXY.detail(id), "DELETE");
}

/** Fetch all saved site pages for pickers (checkout, etc.) */
export async function fetchAllSiteAddresses() {
  /** @type {import("@/lib/sites/siteTypes").SavedSite[]} */
  const all = [];
  let page = 1;
  let lastPage = 1;

  do {
    const result = await fetchSiteAddresses(page);
    all.push(...result.sites.map((row) => apiRecordToSavedSite(row)));
    lastPage = Math.max(1, Number(result.pagination?.lastPage) || 1);
    page += 1;
  } while (page <= lastPage);

  return all.sort((a, b) => Number(b.primary) - Number(a.primary));
}
