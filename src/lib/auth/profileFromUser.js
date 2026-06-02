import { apiToProfileForm } from "@/lib/auth/profileMapper";
import { getUserDisplayName } from "@/lib/auth/userDisplayName";

/**
 * @param {object | null | undefined} user
 */
export function getProfileFromUser(user) {
  if (!user || typeof user !== "object") {
    return apiToProfileForm(null);
  }
  return apiToProfileForm(/** @type {Record<string, unknown>} */ (user));
}

/**
 * @param {string} displayName
 */
export function getProfileInitials(displayName) {
  return displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "UE";
}

export { getUserDisplayName };
