import { PARTNERS } from "@/data/partners";

/**
 * @param {string} name
 * @param {number} index
 */
export function partnerIdFromName(name, index) {
  const slug = String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `partner-${index}`;
}

/**
 * @param {unknown} item
 * @param {number} index
 */
export function mapApiPartner(item, index) {
  const record = /** @type {Record<string, unknown>} */ (item ?? {});
  const name = String(record.partner_name ?? record.name ?? "Partner").trim() || "Partner";
  const image = String(record.image ?? "").trim();

  return {
    id: partnerIdFromName(name, index),
    name,
    image: image || null,
  };
}

/**
 * @param {unknown} payload
 */
export function parsePartnersResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && Array.isArray(record.data)) {
    return record.data.map((item, index) => mapApiPartner(item, index));
  }

  if (Array.isArray(record.data)) {
    return record.data.map((item, index) => mapApiPartner(item, index));
  }

  if (Array.isArray(payload)) {
    return payload.map((item, index) => mapApiPartner(item, index));
  }

  return [];
}

export function getFallbackPartners() {
  return PARTNERS.map(({ id, name, image }) => ({ id, name, image }));
}
