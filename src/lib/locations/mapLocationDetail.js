import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { buildLocationRecord } from "@/data/locationDetails";
import { absoluteCmsUrl, absoluteSiteUrl } from "@/lib/siteUrl";
const DEFAULT_BOOK_HREF = "/services";
const DEFAULT_IMAGE = "/featured/emergency-24.jpg";

const TOP_SERVICE_SLUGS = [
  "emergency-response-24-7",
  "electrical-installation-condition-report-eicr",
  "portable-appliance-testing-pat",
  "domestic-electrical-fault-investigation",
  "fuse-box-consumer-unit-replacement",
  "fire-alarm-inspection-and-testing",
];

/**
 * @param {string | null | undefined} raw
 */
export function getLocationImageUrl(raw) {
  if (!raw || typeof raw !== "string") return DEFAULT_IMAGE;
  const trimmed = raw.trim();
  if (!trimmed) return DEFAULT_IMAGE;
  if (trimmed.startsWith("http")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return absoluteCmsUrl(trimmed);
}

/**
 * @param {string} html
 */
function stripHtml(html) {
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string | null | undefined} mainTitle
 * @param {string} name
 */
function parseHeroTitle(mainTitle, name) {
  const trimmed = String(mainTitle ?? "").trim();
  if (!trimmed) {
    return { title: "Emergency electrician in", titleAccent: name };
  }

  const suffix = ` in ${name}`;
  if (trimmed.toLowerCase().endsWith(suffix.toLowerCase())) {
    return {
      title: trimmed.slice(0, -suffix.length).trim() || "Emergency electrician in",
      titleAccent: name,
    };
  }

  return { title: trimmed, titleAccent: name };
}

/**
 * @param {unknown} value
 * @param {string} name
 * @param {string} regionLabel
 * @param {string[]} fallback
 */
function parseParagraphs(value, name, regionLabel, fallback) {
  if (!value) return fallback;

  if (Array.isArray(value)) {
    const items = value.map((item) => stripHtml(String(item ?? ""))).filter(Boolean);
    if (items.length) return items;
  }

  const text = stripHtml(String(value));
  if (!text) return fallback;

  const parts = text.split(/\n+/).map((part) => part.trim()).filter(Boolean);
  return parts.length ? parts : [text];
}

/**
 * @param {unknown} value
 * @param {string[]} fallback
 */
function parseWhyChoose(value, fallback) {
  if (!Array.isArray(value) || !value.length) return fallback;

  const items = value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        return String(item.title ?? item.text ?? item.description ?? "").trim();
      }
      return "";
    })
    .filter(Boolean);

  return items.length ? items : fallback;
}

/**
 * @param {unknown} value
 * @param {string} name
 * @param {string} regionLabel
 * @param {{ id: string, q: string, a: string }[]} fallback
 */
function parseFaqs(value, name, regionLabel, fallback) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = /** @type {Record<string, unknown>} */ (value);
    const questions = record.question ?? record.questions ?? record.q;
    const answers = record.answer ?? record.answers ?? record.a;

    if (Array.isArray(questions) && Array.isArray(answers)) {
      const items = questions
        .map((question, index) => {
          const q = String(question ?? "").trim();
          const a = String(answers[index] ?? "").trim();
          if (!q || !a) return null;
          return { id: String(index), q, a };
        })
        .filter(Boolean);

      if (items.length) return items;
    }
  }

  if (!Array.isArray(value) || !value.length) return fallback;

  const items = value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const row = /** @type {Record<string, unknown>} */ (item);
      const q = String(row.question ?? row.q ?? row.title ?? "").trim();
      const a = String(row.answer ?? row.a ?? row.description ?? "").trim();
      if (!q || !a) return null;
      return { id: String(row.id ?? index), q, a };
    })
    .filter(Boolean);

  return items.length ? items : fallback;
}

function titleFromSlug(slug) {
  const extra = SERVICE_DETAIL_EXTRA[slug];
  if (extra?.metaTitle) return extra.metaTitle;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildServicesOffered() {
  return TOP_SERVICE_SLUGS.map((slug) => ({
    name: titleFromSlug(slug),
    slug,
    href: `/services/${slug}`,
    priceIncVat: null,
    tag: slug === "emergency-response-24-7" ? "Most Popular" : undefined,
  }));
}

/**
 * @param {unknown} payload
 */
export function mapLocationDetailFromApi(payload) {
  const root = /** @type {Record<string, unknown>} */ (payload?.data ?? payload ?? {});
  const fullName = String(root.area_name ?? root.areaName ?? "").trim();
  const displayName =
    (typeof root.area_display_name === "string" && root.area_display_name.trim()) ||
    (typeof root.areaDisplayName === "string" && root.areaDisplayName.trim()) ||
    fullName;
  const name = displayName;
  const slug = String(root.slug ?? "").trim();

  if (!fullName || !slug) {
    throw new Error("Invalid location detail response.");
  }

  const city = /** @type {Record<string, unknown> | undefined} */ (root.city);
  const cityName = String(city?.name ?? fullName).trim();
  const regionLabel = cityName;
  const fallback = buildLocationRecord(fullName);
  const heroParts = parseHeroTitle(String(root.main_title ?? root.mainTitle ?? ""), name);
  const imagePath = getLocationImageUrl(
    typeof root.main_image === "string"
      ? root.main_image
      : typeof root.mainImage === "string"
        ? root.mainImage
        : "",
  );

  const paragraphs = parseParagraphs(root.description, name, regionLabel, fallback.paragraphs);
  const whyChoose = parseWhyChoose(root.why_choose ?? root.whyChoose, fallback.whyChoose);
  const faqs = parseFaqs(root.faqs, name, regionLabel, fallback.faqs);
  const metaTitle = String(root.main_title ?? root.mainTitle ?? fallback.metaTitle).trim();
  const metaDescription =
    stripHtml(root.description) ||
    `NICEIC approved electricians in ${name}. Emergency 24/7, EICR, PAT testing, consumer units & more. Book online with Urgent Electrical.`;

  return {
    slug,
    name,
    regionId: fallback.regionId,
    regionLabel,
    canonicalUrl: absoluteSiteUrl(`/locations/${slug}`),
    image: imagePath.startsWith("http") ? imagePath : imagePath,
    imageAlt: `Electrician in ${name} — Urgent Electrical Services`,
    hero: {
      eyebrow: `${regionLabel} coverage`,
      title: heroParts.title,
      titleAccent: heroParts.titleAccent,
      description:
        stripHtml(root.description) ||
        `NICEIC-approved electricians serving ${name} — 24/7 emergencies, fixed online pricing, and professional certification on every job.`,
    },
    highlights: fallback.highlights,
    paragraphs,
    whyChoose,
    responseNote: fallback.responseNote,
    servicesIntro: `Electrical services available in ${name}`,
    services: buildServicesOffered(),
    faqs,
    bookHref: DEFAULT_BOOK_HREF,
    metaTitle,
    metaDescription,
    keywords: [
      `electrician ${name}`,
      `emergency electrician ${name}`,
      `electrical services ${regionLabel}`,
      "NICEIC electrician East Midlands",
      "Urgent Electrical",
    ],
  };
}
