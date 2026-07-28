export const PAGES_API = {
  list: "/pages",
};

/** CMS listing — Laravel paginated `GET /api/other-services` */
export const OTHER_SERVICES_PUBLIC_PATH = "/api/other-services";

/** Detail — `GET /api/other-services/{slug}` (same origin as live site) */
export const OTHER_SERVICES_DETAIL_PATH = "/api/other-services";

/** Authenticated API path when `NEXT_PUBLIC_API_BASE_URL` is set */
export const OTHER_SERVICES_API_PATH = "/other-services";
