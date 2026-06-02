/** Laravel API paths (server proxy) */
export const PROFILE_API = {
  get: "/profile",
  update: "/update-profile",
};

/** Browser → same-origin Next.js routes (avoids CSRF 419) */
export const PROFILE_PROXY = {
  get: "/api/profile",
  update: "/api/profile/update",
};
