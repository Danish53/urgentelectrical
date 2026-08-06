import { CONTACT_ADDRESS } from "@/data/contactPage";
import { getSiteUrl } from "@/lib/siteUrl";

export const NICEIC_APPROVED_PATH = "/niceic-certificate-of-excellence";
export const NICEIC_CERTIFICATE_PATH = "/niceic-certificate";
export const NICEIC_CERTIFICATE_IMAGE = "/niceic-cert-excellence.png";
export const NICEIC_CERTIFICATE_IMAGE_WIDTH = 526;
export const NICEIC_CERTIFICATE_IMAGE_HEIGHT = 694;
/** Cache-bust query for certificate img src */
export const NICEIC_CERTIFICATE_IMAGE_VERSION = "20260806b";

export const NICEIC_APPROVED_CANONICAL = `${getSiteUrl()}${NICEIC_APPROVED_PATH}`;
export const NICEIC_CERTIFICATE_CANONICAL = `${getSiteUrl()}${NICEIC_CERTIFICATE_PATH}`;

export const NICEIC_PAGE = {
  eyebrow: "NICEIC · Certificate of Excellence",
  titleLead: "12 years NICEIC certified",
  titleRest: "electrician in Nottingham.",
  title: "12 years NICEIC certified electrician in Nottingham.",
  leadBefore:
    "Urgent Electrical Services has held continuous NICEIC Approved Contractor certification since 2014 — ",
  leadStrong:
    "12 years and counting, the same standard our engineers are held to on every one of the 5,000+ jobs we've completed.",
  leadAfter: "",
  leadJobs: "",
  leadEnd: "",
  milestone: "10-YEAR MILESTONE · 2024",
  verified: "Verified",
  companyName: "Urgent Electrical Services Ltd",
  companyMeta: `NICEIC Approved Contractor — ${CONTACT_ADDRESS.addressLocality}, UK`,
  jobsBadge: "5,000+ jobs",
  bookLabel: "Book online",
  stats: [
    {
      id: "jobs",
      label: "Jobs completed since 2014",
      value: "5,000",
      suffix: "+",
      accent: "red",
      bar: true,
    },
    {
      id: "years",
      label: "NICEIC certified, continuously",
      value: "12",
      suffix: "YRS+",
      accent: "white",
      suffixTone: "green",
    },
    {
      id: "emergency",
      label: "Emergency callout availability",
      value: "24",
      suffix: "/7",
      accent: "white",
      suffixTone: "green",
      slash: true,
    },
    {
      id: "serving",
      label: "Serving Nottingham & the East Midlands",
      value: "2014",
      suffix: "–NOW",
      accent: "white",
      suffixTone: "green",
    },
    {
      id: "priced",
      label: "Every job priced before work begins",
      value: "100",
      suffix: "%",
      accent: "white",
      suffixTone: "green",
    },
  ],
  features: [
    {
      id: "assessed",
      title: "Independently assessed",
      text: "Annual NICEIC inspection of our work, our engineers and our paperwork — not a one-off badge.",
    },
    {
      id: "insurance",
      title: "Insurance-backed",
      text: "Work carried out under NICEIC covers you even if we’re not there to fix it ourselves.",
    },
    {
      id: "engineers",
      title: "Every engineer, checked",
      text: "Qualifications verified against the same register homeowners and landlords can search themselves.",
    },
    {
      id: "liability",
      title: "Public liability insured",
      text: "Every job is covered by comprehensive public liability insurance, on top of NICEIC protection.",
    },
  ],
};

/** @deprecated kept for any older imports */
export const NICEIC_DECADE = {
  eyebrow: NICEIC_PAGE.eyebrow,
  years: "12",
  yearsLabel: "Years certified",
  title: NICEIC_PAGE.title,
  lead: `${NICEIC_PAGE.leadBefore}${NICEIC_PAGE.leadStrong}`,
  guaranteesHeading: "What NICEIC Approved actually guarantees you",
  guarantees: NICEIC_PAGE.features.slice(0, 3).map((f) => ({
    id: f.id,
    title: f.title,
    text: f.text,
  })),
  viewCertificateLabel: "View certificate of excellence",
  bookLabel: NICEIC_PAGE.bookLabel,
};

/** @deprecated kept for any older imports */
export const NICEIC_CERTIFICATE_PAGE = {
  eyebrow: "Certificate of excellence",
  titlePrefix: "Awarded to",
  title: "Urgent Electrical Services Limited",
  footer:
    "Issued by Certsure LLP, the certification body behind NICEIC, marking over ten consecutive years as an Approved Contractor.",
  backLabel: "Back to NICEIC accreditation",
  bookLabel: NICEIC_PAGE.bookLabel,
};
