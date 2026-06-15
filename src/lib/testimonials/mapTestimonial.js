const AVATAR_COLORS = ["#6366f1", "#22c55e", "#14b8a6", "#1e293b", "#e64a19", "#2563eb", "#9333ea"];

/**
 * @param {string} name
 */
function avatarColorForName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * @param {string | null | undefined} iso
 */
export function formatTestimonialDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * @param {string} name
 * @param {number} index
 */
export function testimonialIdFromName(name, index) {
  const slug = String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `review-${index}`;
}

/**
 * @param {unknown} item
 * @param {number} index
 */
export function mapApiTestimonial(item, index) {
  const record = /** @type {Record<string, unknown>} */ (item ?? {});
  const name = String(record.name ?? "Customer").trim() || "Customer";
  const review = String(record.review ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const image = String(record.image ?? "").trim();

  return {
    id: testimonialIdFromName(name, index),
    name,
    date: formatTestimonialDate(String(record.created_at ?? "")),
    text: review,
    image: image || null,
    rating: Number.parseInt(String(record.rating ?? "5"), 10) || 5,
    platform: String(record.platform ?? "").trim() || null,
    avatarBg: avatarColorForName(name),
    initial: name.charAt(0).toUpperCase() || "?",
  };
}
