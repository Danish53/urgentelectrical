export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** @deprecated Use slugify — kept for existing imports */
export function serviceSlug(name) {
  return slugify(name);
}

export const blogSlug = slugify;
