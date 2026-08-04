import { CONTACT_ADDRESS } from "@/data/contactPage";
import { getSiteUrl } from "@/lib/siteUrl";

export const NICEIC_APPROVED_PATH = "/niceic-certificate-of-excellence";
export const NICEIC_CERTIFICATE_PATH = "/niceic-certificate";
export const NICEIC_CERTIFICATE_IMAGE = "/niceic-certificate-excellence.png";

export const NICEIC_APPROVED_CANONICAL = `${getSiteUrl()}${NICEIC_APPROVED_PATH}`;
export const NICEIC_CERTIFICATE_CANONICAL = `${getSiteUrl()}${NICEIC_CERTIFICATE_PATH}`;

export const NICEIC_DECADE = {
  eyebrow: "NICEIC Approved Contractor",
  years: "10",
  yearsLabel: "Years certified",
  title: "A decade of certified electrical excellence",
  lead:
    "Urgent Electrical Services has held NICEIC Approved Contractor status for over 10 years — reassessed every year, never assumed. Here's what that certificate means for anyone hiring us in Nottingham and the East Midlands.",
  webLabel: "Web",
  webValue: "urgentelectrical.services",
  webHref: "https://urgentelectrical.services",
  basedLabel: "Based in",
  basedValue: `${CONTACT_ADDRESS.addressLocality}, ${CONTACT_ADDRESS.postalCode}`,
  guaranteesHeading: "What “NICEIC Approved” actually guarantees you",
  guarantees: [
    {
      id: "assessed",
      title: "Independently assessed",
      text: "Every year, an NICEIC assessor inspects our work against national wiring standards — a recurring check, not a one-off badge.",
    },
    {
      id: "guarantee",
      title: "Guarantee of Standards",
      text: "Registered NICEIC work is protected by Certsure’s Guarantee of Standards scheme, giving customers recourse if something’s wrong.",
    },
    {
      id: "part-p",
      title: "Certificated to Part P",
      text: "As an Approved Contractor, we self-certify notifiable domestic electrical work directly to Building Control.",
    },
  ],
  viewCertificateLabel: "View certificate of excellence",
  bookLabel: "Book an electrician",
};

export const NICEIC_CERTIFICATE_PAGE = {
  eyebrow: "Certificate of excellence",
  titlePrefix: "Awarded to",
  title: "Urgent Electrical Services Limited",
  footer:
    "Issued by Certsure LLP, the certification body behind NICEIC, marking over ten consecutive years as an Approved Contractor. Signed by Richard Orton, CEO of Certsure LLP.",
  backLabel: "Back to NICEIC accreditation",
  bookLabel: "Book online",
};
