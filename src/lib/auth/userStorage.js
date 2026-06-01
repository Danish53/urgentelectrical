const USER_KEY = "urgent_auth_user";

/** @returns {object | null} */
export function getStoredAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/** @param {object | null} user */
export function setStoredAuthUser(user) {
  if (typeof window === "undefined") return;
  if (user && typeof user === "object") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearStoredAuthUser() {
  setStoredAuthUser(null);
}
