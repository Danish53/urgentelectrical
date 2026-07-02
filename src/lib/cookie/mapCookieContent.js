const DEFAULT_TITLE = "We value your privacy";
const DEFAULT_SITE_NAME = "Urgent Electrical";
const DEFAULT_DESCRIPTION =
  "We use cookies to improve your experience, analyse site traffic, and support secure booking.";
const DEFAULT_POLICY_URL = "/policies/cookie-policy";
const DEFAULT_MODAL_INTRO =
  "When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. Because we respect your right to privacy, you can choose not to allow some types of cookies.";

/**
 * @param {unknown} data
 */
export function mapCookieContent(data) {
  const root = /** @type {Record<string, unknown>} */ (data?.data ?? data ?? {});

  const siteName = String(root.site_name ?? root.siteName ?? DEFAULT_SITE_NAME).trim() || DEFAULT_SITE_NAME;
  const title = String(root.title ?? root.heading ?? DEFAULT_TITLE).trim() || DEFAULT_TITLE;

  const shortDescription = String(
    root.short_description ?? root.shortDescription ?? "",
  ).trim();
  const longDescription = String(
    root.long_description ?? root.longDescription ?? "",
  ).trim();

  const description = shortDescription || stripHtml(longDescription) || DEFAULT_DESCRIPTION;
  const modalIntro = String(root.modal_intro ?? root.modalIntro ?? DEFAULT_MODAL_INTRO).trim() || DEFAULT_MODAL_INTRO;

  const policyUrl = String(root.policy_url ?? root.policyUrl ?? DEFAULT_POLICY_URL).trim() || DEFAULT_POLICY_URL;
  const policyLinkText = String(
    root.policy_link_text ?? root.policyLinkText ?? "Review our cookie policy",
  ).trim() || "Review our cookie policy";

  return {
    siteName,
    title,
    description,
    modalIntro,
    policyUrl,
    policyLinkText,
    acceptLabel: String(root.accept_label ?? root.acceptLabel ?? "Accept All Cookies").trim() || "Accept All Cookies",
    rejectLabel: String(root.reject_label ?? root.rejectLabel ?? "Reject all cookies").trim() || "Reject all cookies",
    manageLabel: String(root.manage_label ?? root.manageLabel ?? "Customise").trim() || "Customise",
    allowAllLabel: String(root.allow_all_label ?? root.allowAllLabel ?? "Allow All").trim() || "Allow All",
    confirmLabel: String(root.confirm_label ?? root.confirmLabel ?? "Confirm My Choices").trim() || "Confirm My Choices",
    continueWithoutLabel:
      String(root.continue_without_label ?? root.continueWithoutLabel ?? "Continue without accepting").trim() ||
      "Continue without accepting",
    preferencesTitle:
      String(root.preferences_title ?? root.preferencesTitle ?? "Manage Consent Preferences").trim() ||
      "Manage Consent Preferences",
    modalTitle:
      String(root.modal_title ?? root.modalTitle ?? "Privacy Preference Center").trim() ||
      "Privacy Preference Center",
    bannerHeading: String(root.banner_heading ?? root.bannerHeading ?? "").trim(),
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
