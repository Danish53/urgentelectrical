/** Laravel session / CSRF cookie bootstrap */
export const COOKIE_API = {
  get: "/cookie",
};

/** Same-origin Next.js proxy (browser → Laravel via server) */
export const COOKIE_PROXY = {
  get: "/api/cookie",
};
