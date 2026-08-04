import Link from "next/link";
import Image from "next/image";
import { NICEIC_APPROVED_PATH, NICEIC_CERTIFICATE_IMAGE } from "@/data/niceicPages";

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
      <Image
        src={NICEIC_CERTIFICATE_IMAGE}
        alt="NICEIC Certificate of Excellence awarded to Urgent Electrical Services Limited — celebrating over 10 years' certification"
        width={640}
        height={800}
        className="home1-niceic-cert-badge__img"
        sizes="(max-width: 1024px) 100vw, 280px"
      />
    </Link>
  );
}

export {
  NICEIC_APPROVED_PATH as NICEIC_CERTIFICATE_HREF,
  NICEIC_CERTIFICATE_IMAGE,
} from "@/data/niceicPages";
