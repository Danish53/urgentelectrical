/** Parse API date strings like "18 May 2026" to ISO date (YYYY-MM-DD). */
export function parseBlogCreatedAtToISO(createdAt) {
  if (!createdAt || typeof createdAt !== "string") {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = Date.parse(createdAt.replace(/,/g, ""));
  if (Number.isNaN(parsed)) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(parsed).toISOString().slice(0, 10);
}

/** Display string from API or ISO. */
export function formatBlogPublishedDisplay(createdAt, publishedISO) {
  if (createdAt && typeof createdAt === "string" && createdAt.trim()) {
    return createdAt.trim();
  }

  if (publishedISO) {
    return new Date(publishedISO).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return "";
}
