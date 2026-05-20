import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const RED = "#c41e1e";

function IconPhone() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

export default function CTABannerSection() {
  return (
    <section
      className="relative overflow-x-clip py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: RED }}
      aria-labelledby="cta-banner-heading"
    >
      <div
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[280px] h-[280px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #00000040 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[280px] h-[280px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #00000040 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className={`${SECTION_CONTAINER} relative z-10`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <h2
              id="cta-banner-heading"
              className="text-white text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight mb-3"
            >
              Need an electrician right now?
            </h2>
            <p className="text-white text-[15px] sm:text-base leading-relaxed opacity-95">
              Call us directly for immediate emergency response, or book online for fast same-day service —
              confirmed in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-end gap-3 sm:gap-4 shrink-0">
            <a
              href={`tel:${FOOTER_PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2.5 bg-white font-bold text-[15px] px-7 sm:px-8 py-3.5 sm:py-4 rounded-md transition-opacity duration-200 hover:opacity-95 whitespace-nowrap"
              style={{ color: RED }}
            >
              <IconPhone />
              {FOOTER_PHONE}
            </a>
            <a
              href="#book"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold text-[15px] px-7 sm:px-8 py-3.5 sm:py-4 rounded-md transition-colors duration-200 hover:bg-white/10 whitespace-nowrap"
            >
              Book Online Now
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
