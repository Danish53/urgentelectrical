/**
 * @param {string} query
 */
export function normalizeSearchQuery(query) {
  return query.trim().toLowerCase();
}

/**
 * @param {string} query
 * @param {string} [title]
 * @param {string} [description]
 */
export function matchesListSearch(query, title, description) {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;

  const haystack = `${title ?? ""} ${description ?? ""}`.toLowerCase();
  return haystack.includes(normalized);
}
