/** Routes only for guests (redirect to home when logged in) */
export const AUTH_GUEST_PATHS = [
  "/login",
  "/login/forgot-password",
  "/login/verify-otp",
  "/login/reset-password",
];

export function isAuthGuestPath(pathname) {
  return AUTH_GUEST_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
