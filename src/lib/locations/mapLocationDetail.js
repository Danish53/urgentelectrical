import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { buildLocationRecord } from "@/data/locationDetails";
import { stripHtmlFlat, toParagraphs } from "@/lib/content/toParagraphs";
import { absoluteCmsUrl, absoluteSiteUrl } from "@/lib/siteUrl";
import { toPublicServiceSlug } from "@/lib/services/resolveServiceDetailSlug";
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
  return stripHtmlFlat(html);
}

/**
 * @param {string | null | undefined} mainTitle
 * @param {string} name
 */
function parseHeroTitle(mainTitle, name) {
  const trimmed = String(mainTitle ?? "").trim();
  const accent = String(name ?? "").trim();
  if (!trimmed) {
    return { title: "Emergency electrician in", titleAccent: accent };
  }

  const lower = trimmed.toLowerCase();
  const accentLower = accent.toLowerCase();
  const shortName = accent.split(",")[0].trim();
  const shortLower = shortName.toLowerCase();

  /**
   * Split so H1 reads "{title} {accent}" without dropping the trailing "in"
   * or duplicating the place name.
   * @param {string} place
   */
  function splitTrailingPlace(place) {
    const placeLower = place.toLowerCase();
    if (!placeLower || !lower.endsWith(placeLower)) return null;
    let before = trimmed.slice(0, -place.length).trimEnd();
    // CMS sometimes leaves a duplicated short name: "... in Arnold Arnold, Nottingham"
    if (shortLower && before.toLowerCase().endsWith(shortLower)) {
      const stripped = before.slice(0, -shortName.length).trimEnd();
      if (/\bin$/i.test(stripped)) before = stripped;
    }
    if (!before || !/\bin$/i.test(before)) return null;
    return { title: before, titleAccent: accent || place };
  }

  const fromFull = splitTrailingPlace(accent);
  if (fromFull) return fromFull;

  if (shortLower && shortLower !== accentLower) {
    const fromShort = splitTrailingPlace(shortName);
    if (fromShort) return fromShort;
  }

  // Incomplete CMS title such as "Emergency Electrician in"
  if (/\bin$/i.test(trimmed)) {
    return { title: trimmed, titleAccent: accent };
  }

  // Title already contains the place — do not append accent again.
  if (
    (accentLower && lower.includes(accentLower)) ||
    (shortLower && lower.endsWith(shortLower))
  ) {
    return { title: trimmed, titleAccent: "" };
  }

  // e.g. main_title "Emergency Electrician" + area "Nottingham"
  if (accent) {
    return { title: `${trimmed} in`, titleAccent: accent };
  }

  return { title: trimmed, titleAccent: "" };
}

/**
 * @param {string} text
 * @param {number} [max]
 */
function truncateMetaDescription(text, max = 155) {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= max) return normalized;

  const cut = normalized.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > Math.floor(max * 0.6) ? cut.slice(0, lastSpace) : cut).trim();
  return `${base.replace(/[.,;:]+$/, "")}…`;
}

/**
 * @param {unknown} value
 * @param {string} name
 * @param {string} regionLabel
 * @param {string[]} fallback
 */
function parseParagraphs(value, name, regionLabel, fallback) {
  const parts = toParagraphs(value);
  return parts.length ? parts : fallback;
}

/**
 * Main page body HTML from the location-details API (`description_html`).
 * @param {unknown} value
 */
function parseDescriptionHtml(value) {
  const html = String(value ?? "").trim();
  if (!html || html.toLowerCase() === "null") return "";
  return html;
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
  return TOP_SERVICE_SLUGS.map((slug) => {
    const publicSlug = toPublicServiceSlug(slug);
    return {
      name: titleFromSlug(slug),
      slug: publicSlug,
      href: `/services/${publicSlug}`,
      priceIncVat: null,
      tag: slug === "emergency-response-24-7" ? "Most Popular" : undefined,
    };
  });
}

/**
 * @param {Record<string, unknown>} root
 * @param {string} fallback
 */
function parseHeroLead(root, fallback) {
  const raw =
    (typeof root.short_description === "string" && root.short_description.trim()) ||
    (typeof root.shortDescription === "string" && root.shortDescription.trim()) ||
    "";
  if (!raw || raw.toLowerCase() === "null") return fallback;
  const text = stripHtml(raw);
  return text || fallback;
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
  const citySlug = String(city?.slug ?? "").trim().toLowerCase();
  const regionLabel = cityName;
  // Prefer display name for fallbacks; use short place name when present so
  // nearby areas resolve against the static region lists (e.g. "Arnold").
  const fallbackName = name.split(",")[0].trim() || name;
  const fallback = buildLocationRecord(fallbackName);
  const regionId =
    citySlug && ["nottingham", "derby", "leicester", "lincoln"].includes(citySlug)
      ? citySlug
      : fallback.regionId;
  const heroParts = parseHeroTitle(String(root.main_title ?? root.mainTitle ?? ""), name);
  const imagePath = getLocationImageUrl(
    typeof root.main_image === "string"
      ? root.main_image
      : typeof root.mainImage === "string"
        ? root.mainImage
        : "",
  );

  const descriptionHtml = parseDescriptionHtml(root.description_html ?? root.descriptionHtml);
  const paragraphs = parseParagraphs(root.description, name, regionLabel, fallback.paragraphs);
  const whyChoose = parseWhyChoose(root.why_choose ?? root.whyChoose, fallback.whyChoose);
  const commonJobs = parseWhyChoose(
    root.common_signs ?? root.commonSigns ?? root.common_jobs ?? root.commonJobs,
    fallback.commonJobs,
  );
  const faqs = parseFaqs(root.faqs, name, regionLabel, fallback.faqs);

  const seoTitle = String(root.seo_title ?? root.seoTitle ?? "").trim();
  const seoDescription = stripHtml(
    (typeof root.seo_description === "string" && root.seo_description) ||
      (typeof root.seoDescription === "string" && root.seoDescription) ||
      "",
  );

  const metaTitleRaw = String(root.main_title ?? root.mainTitle ?? "").trim();
  const metaTitleFromHero = (() => {
    if (!metaTitleRaw || metaTitleRaw.toLowerCase() === "null") return "";
    const combined = heroParts.titleAccent
      ? `${heroParts.title} ${heroParts.titleAccent}`
      : heroParts.title;
    const normalized = String(combined ?? "").replace(/\s+/g, " ").trim();
    // Never publish incomplete titles like "Emergency Electrician in"
    if (!normalized || /\bin$/i.test(normalized)) return "";
    return normalized;
  })();
  const metaTitle =
    (seoTitle && seoTitle.toLowerCase() !== "null" ? seoTitle : "") ||
    metaTitleFromHero ||
    fallback.metaTitle;

  const shortMeta = stripHtml(
    (typeof root.short_description === "string" && root.short_description) ||
      (typeof root.shortDescription === "string" && root.shortDescription) ||
      "",
  );
  const descriptionText = stripHtml(
    typeof root.description === "string" ? root.description : "",
  );
  const metaDescription =
    truncateMetaDescription(seoDescription) ||
    truncateMetaDescription(shortMeta) ||
    truncateMetaDescription(descriptionText) ||
    fallback.metaDescription;

  return {
    slug,
    name,
    regionId,
    regionLabel,
    cityName,
    citySlug: citySlug || undefined,
    canonicalUrl: absoluteSiteUrl(`/locations/${slug}`),
    image: imagePath.startsWith("http") ? imagePath : imagePath,
    imageAlt: `Electrician in ${name} — Urgent Electrical Services`,
    hero: {
      eyebrow: `${regionLabel} coverage`,
      title: heroParts.title,
      titleAccent: heroParts.titleAccent,
      lead: parseHeroLead(root, fallback.hero.lead),
    },
    highlights: fallback.highlights,
    descriptionHtml,
    paragraphs,
    whyChoose,
    commonJobs,
    responseNote: fallback.responseNote,
    servicesIntro: `Electrical services available in ${name}`,
    services: buildServicesOffered(),
    faqs,
    mapEmbed:
      fallback.mapEmbed ||
      `https://maps.google.com/maps?q=${encodeURIComponent(`${name}, UK`)}&hl=en&z=12&ie=UTF8&iwloc=&output=embed`,
    nearby: (fallback.nearby ?? []).filter((area) => {
      if (!area?.slug || area.slug === slug) return false;
      const shortName = name.split(",")[0].trim().toLowerCase();
      const areaName = String(area.name ?? "").trim().toLowerCase();
      if (areaName && (areaName === name.toLowerCase() || areaName === shortName)) return false;
      return true;
    }),
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
