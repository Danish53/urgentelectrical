/** Logo-aligned brand tokens — Urgent Electrical */
export const BRAND = {
  red: "#D3231F",
  redDark: "#B71C1C",
  redDeep: "#8B1512",
  redGlow: "rgba(211, 35, 31, 0.35)",
  redSoft: "#FFEBEE",
  black: "#111827",
  charcoal: "#1A1A1A",
  slate: "#374151",
  muted: "#64748B",
  border: "#E5E7EB",
  surface: "#F8FAFC",
  white: "#FFFFFF",
};

/** Shared horizontal gutters — aligned with blog cards on mobile */
export const PAGE_GUTTERS = "px-3.5 sm:px-6 md:px-8 lg:px-12 xl:px-16";

export const CONTAINER = `w-full max-w-[1440px] mx-auto ${PAGE_GUTTERS}`;

/** Navbar shell — 1320px+ identical to CONTAINER; below 1320px tighter side gutters only */
export const NAV_SHELL =
  `${CONTAINER} max-[1334px]:!px-3.5 max-[1334px]:sm:!px-6 max-[1334px]:md:!px-8 max-[1334px]:lg:!px-6 max-[1334px]:xl:!px-8`;

/** Service / blog / detail pages — same track as main site container */
export const SERVICE_DETAIL_CONTAINER = CONTAINER;

export const SERVICES_PAGE_CONTAINER = CONTAINER;

/** Checkout — full width on mobile; side padding from sm+ */
export const CHECKOUT_PAGE_CONTAINER =
  "w-full max-w-[1440px] mx-auto px-0 sm:px-6 md:px-8 lg:px-12 xl:px-16";

export const SECTION_PY = "py-16 sm:py-20 lg:py-24";
