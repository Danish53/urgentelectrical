const DEFAULT_TITLE = "We value your privacy";
const DEFAULT_DESCRIPTION =
  "We use cookies to improve your experience, analyse site traffic, and support secure booking.";
const DEFAULT_POLICY_URL = "/policies/cookie-policy";

/**
 * @param {unknown} data
 */
export function mapCookieContent(data) {
  const root = /** @type {Record<string, unknown>} */ (data?.data ?? data ?? {});

  const title = String(root.title ?? root.heading ?? DEFAULT_TITLE).trim() || DEFAULT_TITLE;

  const shortDescription = String(
    root.short_description ?? root.shortDescription ?? "",
  ).trim();
  const longDescription = String(
    root.long_description ?? root.longDescription ?? "",
  ).trim();

  const description = shortDescription || stripHtml(longDescription) || DEFAULT_DESCRIPTION;

  const policyUrl = String(root.policy_url ?? root.policyUrl ?? DEFAULT_POLICY_URL).trim() || DEFAULT_POLICY_URL;
  const policyLinkText = String(
    root.policy_link_text ?? root.policyLinkText ?? "Cookie policy",
  ).trim() || "Cookie policy";

  return {
    title,
    description,
    policyUrl,
    policyLinkText,
    acceptLabel: String(root.accept_label ?? root.acceptLabel ?? "Accept all").trim() || "Accept all",
    rejectLabel: String(root.reject_label ?? root.rejectLabel ?? "Reject all").trim() || "Reject all",
    manageLabel: String(root.manage_label ?? root.manageLabel ?? "Manage").trim() || "Manage",
  };
}

/**
 * @param {string} html
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
