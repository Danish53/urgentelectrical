import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER, SECTION_PY } from "./constants";
import { IconArrow, IconPhone } from "./icons";

export default function CTAHome1({ bookHref = "#book" }) {
  return (
    <section
      id="cta"
      className={`${SECTION_PY} bg-[var(--home1-surface)] overflow-x-clip scroll-mt-28`}
      aria-labelledby="home1-cta-heading"
    >
      <div className={CONTAINER}>
        <div className="relative rounded-[28px] overflow-hidden home1-section-red px-8 py-12 sm:px-14 sm:py-16 text-center">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="home1-eyebrow home1-eyebrow--light mb-5 mx-auto">Get help now</span>
            <h2 id="home1-cta-heading" className="text-white text-[28px] sm:text-[36px] font-extrabold mb-4 leading-tight">
              Need an electrician right now?
            </h2>
            <p className="text-white/85 text-[15px] leading-relaxed mb-8">
              Call for immediate emergency response or book online — same-day service confirmed in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-btn-white">
                <IconPhone />
                {FOOTER_PHONE}
              </a>
              <a href={bookHref} className="home1-btn-outline">
                Book online
                <IconArrow />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
