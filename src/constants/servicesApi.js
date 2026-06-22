/** Services API (GET {{base_url}}/services) */
export const SERVICES_API_PATH = "/services";

/** Simple services list — title + slug only (GET {{base_url}}/services/simple-list) */
export const SERVICES_SIMPLE_LIST_API_PATH = "/services/simple-list";

/** Check service coverage by postcode (POST {{base_url}}/service-by-postal-code) */
export const SERVICE_BY_POSTAL_CODE_API_PATH = "/service-by-postal-code";

/** Same-origin proxy for browser POST (avoids CSRF / CORS). */
export const SERVICE_BY_POSTAL_CODE_PROXY = "/api/service-by-postal-code";

/** Service categories (GET {{base_url}}/service-categories) */
export const SERVICE_CATEGORIES_API_PATH = "/service-categories";
