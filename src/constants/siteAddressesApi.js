/** Laravel API paths (server proxy) */
export const SITE_ADDRESSES_API = {
  list: "/site-addresses",
  detail: (id) => `/site-addresses/${id}`,
};

/** Browser → same-origin Next.js routes (avoids CSRF 419) */
export const SITE_ADDRESSES_PROXY = {
  list: "/api/site-addresses",
  detail: (id) => `/api/site-addresses/${encodeURIComponent(id)}`,
};
