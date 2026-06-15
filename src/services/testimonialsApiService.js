import { TESTIMONIALS_API } from "@/constants/testimonialsApi";
import { apiRequest } from "@/lib/api/client";
import { mapApiTestimonial } from "@/lib/testimonials/mapTestimonial";

/**
 * @param {unknown} payload
 */
export function parseTestimonialsResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && Array.isArray(record.data)) {
    return record.data;
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

/** GET /testimonials */
export async function fetchTestimonials() {
  const payload = await apiRequest(TESTIMONIALS_API.list, { method: "GET" });
  const rows = parseTestimonialsResponse(payload);

  return rows.map((item, index) => mapApiTestimonial(item, index));
}
