import { serviceSlug } from "@/lib/slugs";

export const FOOTER_SERVICES = [
  { label: "Domestic", href: `/services#${serviceSlug("Domestic")}` },
  { label: "Commercial", href: `/services#${serviceSlug("Commercial")}` },
  { label: "Industrial", href: `/services#${serviceSlug("Industrial")}` },
  { label: "Renewables", href: `/services#${serviceSlug("Renewables")}` },
];

export const FOOTER_COMPANY = [
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
  { label: "Blog & news", href: "/blog" },
  { label: "Locations", href: "#" },
  { label: "Other Services", href: "/services" },
  { label: "Company Policies", href: "#" },
];

export const FOOTER_AREAS = [
  { label: "Nottingham", href: "#" },
  { label: "Derby", href: "#" },
  { label: "Leicester", href: "#" },
  { label: "Loughborough", href: "#" },
  { label: "Newark-on-Trent", href: "#" },
  { label: "East Midlands", href: "#" },
];

export const FOOTER_BADGES = ["NICEIC Approved", "Fully Insured", "Est. 2014"];

export const FOOTER_LEGAL = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms & conditions", href: "#" },
  { label: "Cookie policy", href: "#" },
];

export const FOOTER_PHONE = "0115 778 0622";
export const FOOTER_PHONE_TEL = "01157780622";

export const SOCIAL_LINKS = [
  { id: "facebook", label: "Facebook", href: "#" },
  { id: "twitter", label: "Twitter", href: "#" },
  { id: "youtube", label: "YouTube", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
];
