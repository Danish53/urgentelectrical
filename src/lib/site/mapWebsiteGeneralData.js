import {
  CONTACT_ADDRESS,
  CONTACT_BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/data/contactPage";

/** @param {string} tel */
export function formatUkPhoneDisplay(tel) {
  const digits = String(tel ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return String(tel ?? "").trim();
}

/** @param {string} tel */
export function normalizePhoneTel(tel) {
  const digits = String(tel ?? "").replace(/\D/g, "");
  return digits || CONTACT_PHONE_TEL;
}

export const DEFAULT_SITE_DATA = {
  title: CONTACT_BUSINESS_NAME,
  shortTitle: "Urgent Electrical Services",
  logo: "/logo.jpg",
  image: null,
  contactNumber: CONTACT_PHONE_TEL,
  contactNumberDisplay: CONTACT_PHONE_DISPLAY,
  email: CONTACT_EMAIL,
  address: CONTACT_ADDRESS.full,
  socialLinks: [
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/urgentelectrical" },
    { id: "twitter", label: "Twitter", href: "https://www.twitter.com" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/urgentelectrical" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com" },
  ],
};

/**
 * @param {unknown} item
 */
function readSocialLink(item) {
  const href = String(item?.href ?? "").trim();
  if (!href || href === "#") return null;
  return item;
}

/**
 * @param {unknown} payload
 */
export function mapWebsiteGeneralData(payload) {
  const root = /** @type {Record<string, unknown>} */ (payload ?? {});
  const data = /** @type {Record<string, unknown>} */ (
    root.data && typeof root.data === "object" ? root.data : root
  );

  const title = String(data.title ?? DEFAULT_SITE_DATA.title).trim() || DEFAULT_SITE_DATA.title;
  const contactNumber = normalizePhoneTel(String(data.contact_number ?? DEFAULT_SITE_DATA.contactNumber));

  const socialLinks = [
    readSocialLink({
      id: "facebook",
      label: "Facebook",
      href: data.facebook_link,
    }),
    readSocialLink({
      id: "twitter",
      label: "Twitter",
      href: data.twitter_link,
    }),
    readSocialLink({
      id: "youtube",
      label: "YouTube",
      href: data.youtube_link,
    }),
    readSocialLink({
      id: "linkedin",
      label: "LinkedIn",
      href: data.linkedin_lik ?? data.linkedin_link,
    }),
  ].filter(Boolean);

  return {
    title,
    shortTitle: title.replace(/\s+Limited$/i, "").trim() || DEFAULT_SITE_DATA.shortTitle,
    logo: String(data.logo ?? DEFAULT_SITE_DATA.logo).trim() || DEFAULT_SITE_DATA.logo,
    image: String(data.image ?? "").trim() || null,
    contactNumber,
    contactNumberDisplay: formatUkPhoneDisplay(contactNumber),
    email: String(data.email ?? DEFAULT_SITE_DATA.email).trim() || DEFAULT_SITE_DATA.email,
    address: String(data.address ?? DEFAULT_SITE_DATA.address).trim() || DEFAULT_SITE_DATA.address,
    socialLinks: socialLinks.length ? socialLinks : DEFAULT_SITE_DATA.socialLinks,
  };
}
