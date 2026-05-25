import { AUTH_API } from "@/constants/authApi";
import { apiRequest } from "@/lib/api/client";

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
  return apiRequest(AUTH_API.login, { method: "POST", body: payload });
}

/** @param {{ email: string }} payload */
export function forgotPassword(payload) {
  return apiRequest(AUTH_API.forgotPassword, { method: "POST", body: payload });
}

/** @param {{ email: string, otp: string }} payload */
export function verifyOtp(payload) {
  return apiRequest(AUTH_API.verifyOtp, { method: "POST", body: payload });
}

/** @param {{ email: string, otp: string, password: string, password_confirmation: string }} payload */
export function resetPassword(payload) {
  return apiRequest(AUTH_API.resetPassword, { method: "POST", body: payload });
}
