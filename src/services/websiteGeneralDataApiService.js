import { WEBSITE_GENERAL_DATA_API } from "@/constants/websiteGeneralDataApi";
import { apiRequest } from "@/lib/api/client";
import { mapWebsiteGeneralData } from "@/lib/site/mapWebsiteGeneralData";

/** GET /website-general-data */
export async function fetchWebsiteGeneralData() {
  const payload = await apiRequest(WEBSITE_GENERAL_DATA_API.list, { method: "GET" });
  return mapWebsiteGeneralData(payload);
}
