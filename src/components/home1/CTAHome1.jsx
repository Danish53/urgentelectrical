import Link from "next/link";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER } from "./constants";
import { IconArrow, IconPhone } from "./icons";

export default function CTAHome1({ bookHref = "/services" }) {
  return (
    <section
      id="cta"
      className="home1-cta-section bg-[var(--home1-surface)] overflow-x-clip scroll-mt-28"
      aria-labelledby="home1-cta-heading"
    >
      <div className={CONTAINER}>
        <div className="home1-cta-card home1-section-red">
          <div className="home1-cta-pattern" aria-hidden="true" />
          <div className="home1-cta-inner">
            <span className="home1-eyebrow home1-eyebrow--light home1-cta-eyebrow">Get help now</span>
            <h2 id="home1-cta-heading" className="home1-cta-heading">
              Need an electrician right now?
            </h2>
            <p className="home1-cta-text">
              Call for immediate emergency response or book online — same-day service confirmed in minutes.
            </p>
            <div className="home1-cta-actions">
              <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-btn-white home1-cta-btn">
                <IconPhone />
                {FOOTER_PHONE}
              </a>
              <Link href={bookHref} className="home1-btn-outline home1-cta-btn">
                Book online
                <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
