import { PROFILE_PROXY } from "@/constants/profileApi";
import { parseProfileResponse, profileFormToApi } from "@/lib/auth/profileMapper";
import { sameOriginAuthGet, sameOriginAuthPost } from "@/lib/api/sameOriginPost";

/** GET /profile (via same-origin proxy) */
export async function fetchProfile() {
  const payload = await sameOriginAuthGet(PROFILE_PROXY.get);
  const profile = parseProfileResponse(payload);
  if (!profile) {
    throw new Error("Could not read profile data from the server.");
  }
  return profile;
}

/**
 * POST /update-profile (via same-origin proxy)
 * @param {import("@/lib/auth/profileMapper").ProfileFormValues} form
 */
export async function updateProfile(form) {
  const body = profileFormToApi(form);
  const payload = await sameOriginAuthPost(PROFILE_PROXY.update, body);
  const profile = parseProfileResponse(payload);
  if (!profile) return body;
  return profile;
}
