import { sameOriginJsonPost } from "@/lib/api/sameOriginPost";

/** Same-origin proxies — avoids Laravel Sanctum CSRF 419 on cross-origin browser POST. */
const AUTH_PROXY = {
  login: "/api/auth/login",
  forgotPassword: "/api/auth/forgot-password",
  verifyOtp: "/api/auth/verify-otp",
  resetPassword: "/api/auth/reset-password",
};

/**
 * @param {unknown} data
 * @returns {{ token: string | null, user: object | null, message: string | null }}
 */
export function parseAuthResponse(data) {
  if (!data || typeof data !== "object") {
    return { token: null, user: null, message: null };
  }

  const nested = data.data && typeof data.data === "object" ? data.data : data;

  const token =
    nested.token ??
    nested.access_token ??
    data.token ??
    data.access_token ??
    null;

  const user = nested.user ?? data.user ?? null;
  const message = data.message ?? nested.message ?? null;

  return { token, user, message };
}

/** @param {unknown} data */
export function parseApiMessage(data) {
  if (!data || typeof data !== "object") return null;
  if (typeof data.message === "string") return data.message;
  if (data.data && typeof data.data.message === "string") return data.data.message;
  return null;
}

/** @param {{ email: string, password: string }} payload */
export function login(payload) {
  return sameOriginJsonPost(AUTH_PROXY.login, payload);
}

/** @param {{ email: string }} payload */
export function forgotPassword(payload) {
  return sameOriginJsonPost(AUTH_PROXY.forgotPassword, payload);
}

/** @param {{ email: string, otp: string }} payload */
export function verifyOtp(payload) {
  return sameOriginJsonPost(AUTH_PROXY.verifyOtp, payload);
}

/** @param {{ email: string, otp: string, password: string, password_confirmation: string }} payload */
export function resetPassword(payload) {
  return sameOriginJsonPost(AUTH_PROXY.resetPassword, payload);
}
