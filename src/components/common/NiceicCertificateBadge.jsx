import Link from "next/link";
import {
  NICEIC_APPROVED_PATH,
  NICEIC_CERTIFICATE_IMAGE,
  NICEIC_CERTIFICATE_IMAGE_HEIGHT,
  NICEIC_CERTIFICATE_IMAGE_VERSION,
  NICEIC_CERTIFICATE_IMAGE_WIDTH,
} from "@/data/niceicPages";

/**
 * Clickable NICEIC Certificate of Excellence — opens the accreditation page.
 * @param {{ className?: string }} props
 */
export default function NiceicCertificateBadge({ className = "" }) {
  return (
    <Link
      href={NICEIC_APPROVED_PATH}
      className={`home1-niceic-cert-badge ${className}`.trim()}
      aria-label="View NICEIC Certificate of Excellence"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${NICEIC_CERTIFICATE_IMAGE}?v=${NICEIC_CERTIFICATE_IMAGE_VERSION}`}
        alt="NICEIC Certificate of Excellence awarded to Urgent Electrical Services Limited — celebrating over 10 years' certification"
        width={NICEIC_CERTIFICATE_IMAGE_WIDTH}
        height={NICEIC_CERTIFICATE_IMAGE_HEIGHT}
        className="home1-niceic-cert-badge__img"
        decoding="async"
        loading="lazy"
      />
    </Link>
  );
}

export {
  NICEIC_APPROVED_PATH as NICEIC_CERTIFICATE_HREF,
  NICEIC_CERTIFICATE_IMAGE,
} from "@/data/niceicPages";
