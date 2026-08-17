/**
 * @param {unknown} value
 * @param {number} [fallback]
 */
export function parsePositiveInt(value, fallback = 1) {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}

/**
 * @param {Record<string, string | string[] | undefined> | null | undefined} params
 * @param {Array<{ id?: string, slug?: string }>} [categories]
 */
export function parseBlogListingParams(params, categories = []) {
  const page = parsePositiveInt(params?.page, 1);
  const raw = Array.isArray(params?.category) ? params.category[0] : params?.category;
  const category = String(raw ?? "all").trim() || "all";
  const allowed = new Set(
    categories.flatMap((item) => [item.id, item.slug]).filter((value) => typeof value === "string" && value)
  );

  if (category !== "all" && allowed.size && !allowed.has(category)) {
    return { page: 1, category: "all" };
  }

  return { page, category };
}

/**
 * @param {{ page?: number, category?: string }} [options]
 */
export function blogListingHref({ page = 1, category = "all" } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}
