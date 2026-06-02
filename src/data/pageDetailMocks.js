import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";

/** Rich informational page layouts — prototype content until CMS `/pages` HTML is ready */
export const PAGE_DETAIL_MOCKS = {
  "domestic-electrical-fault-investigation": {
    category: "Domestic",
    image: "/featured/fault-investigation.jpg",
    priceHint: "Investigation visits from £78 inc. VAT",
    bookHref: "/services/domestic-electrical-fault-investigation",
    trustPills: ["NICEIC approved", "Fixed-price visit", "Nottingham & East Midlands"],
    process: [
      {
        step: "01",
        title: "Listen & make safe",
        text: "We confirm what you are experiencing — tripping RCDs, flickering lights, partial power loss — and isolate hazards before testing.",
      },
      {
        step: "02",
        title: "Systematic testing",
        text: "Circuits, accessories, and appliances are tested methodically, including insulation and thermal checks where appropriate.",
      },
      {
        step: "03",
        title: "Clear findings",
        text: "You receive a plain-English explanation of the cause and a written summary of what we found on site.",
      },
      {
        step: "04",
        title: "Repair quote",
        text: "Simple fixes may be completed on the visit. Larger remedial work is quoted transparently by the same trusted team.",
      },
    ],
    symptoms: [
      "RCD or fuse box keeps tripping",
      "Flickering or dimming lights",
      "Buzzing from consumer unit or sockets",
      "Partial power loss in one room",
      "Burning smell from a fitting or switch",
      "One appliance trips the whole house",
    ],
    related: [
      { label: "Emergency Electrician", href: "/pages/emergency-response-24-7" },
      { label: "EICR Nottingham", href: "/pages/electrical-installation-condition-report-eicr" },
      { label: "Fuse box replacement", href: "/pages/fuse-box-consumer-unit-replacement" },
      { label: "Socket replacement", href: "/pages/socket-replacement" },
    ],
  },
};

/**
 * @param {string} slug
 * @param {import("@/services/pagesApiService").ApiInfoPageDetail | null} [page]
 */
export function getPageDetailLayout(slug, page = null) {
  const mock = PAGE_DETAIL_MOCKS[slug];
  const extra = SERVICE_DETAIL_EXTRA[slug];
  if (!mock && !extra) return null;

  const title =
    page?.title?.trim() ||
    extra?.metaTitle?.replace(/\s*\|.*$/, "") ||
    "Electrical service";

  const lead =
    page?.description?.trim() ||
    page?.seo_description?.trim() ||
    extra?.metaDescription ||
    "";

  const paragraphs = extra?.longDescription ?? [];
  const features = extra?.features ?? [];
  const includes = extra?.includes ?? [];
  const faqs = extra?.faqs ?? [];

  return {
    slug,
    title,
    lead,
    paragraphs,
    features,
    includes,
    faqs,
    category: mock?.category ?? "Service guide",
    image: mock?.image ?? null,
    priceHint: mock?.priceHint ?? null,
    bookHref: mock?.bookHref ?? `/services/${slug}`,
    trustPills: mock?.trustPills ?? ["NICEIC approved", "Fully insured", "Est. 2014"],
    process: mock?.process ?? [],
    symptoms: mock?.symptoms ?? [],
    related: mock?.related ?? [],
    keywords: extra?.keywords ?? [],
  };
}
