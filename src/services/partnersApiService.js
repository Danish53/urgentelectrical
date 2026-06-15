import { PARTNERS_API } from "@/constants/partnersApi";
import { apiRequest } from "@/lib/api/client";
import { parsePartnersResponse } from "@/lib/partners/mapPartner";

/** GET /partners */
export async function fetchPartners() {
  const payload = await apiRequest(PARTNERS_API.list, { method: "GET" });
  return parsePartnersResponse(payload);
}
