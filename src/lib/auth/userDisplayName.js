/**
 * @param {object | null | undefined} user
 */
export function getUserDisplayName(user) {
  if (!user || typeof user !== "object") return "My Account";

  if (typeof user.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  const first = user.first_name ?? user.firstName;
  const last = user.last_name ?? user.lastName;
  const combined = [first, last]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => /** @type {string} */ (part).trim())
    .join(" ");

  if (combined) return combined;

  if (typeof user.email === "string" && user.email.includes("@")) {
    const local = user.email.split("@")[0];
    return local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  return "My Account";
}
