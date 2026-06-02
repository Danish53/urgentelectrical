import { SITE_ADDRESSES_PROXY } from "@/constants/siteAddressesApi";
import {
  sameOriginAuthGet,
  sameOriginAuthPost,
  sameOriginAuthRequest,
} from "@/lib/api/sameOriginPost";
import {
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
