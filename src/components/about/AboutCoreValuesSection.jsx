import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { ABOUT_CORE_VALUES } from "@/data/aboutPage";

function ValueIcon({ type }) {
  const className = "w-5 h-5 text-[#111827]";
  const wrap = "flex items-center justify-center w-10 h-10 rounded-lg bg-[#f1f5f9] border border-[#e5e7eb] shrink-0";

  const icons = {
    shield: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3l8 4v6c0 5-3.5 8.5-8 10-4-1.5-8-5-8-10V7l8-4z" strokeLinejoin="round" />
      </svg>
    ),
    clock: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
    ),
    tools: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2-2 2-2 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    scale: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3v18M5 7h14M7 7l-2 6h4l-2-6zM17 7l-2 6h4l-2-6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    handshake: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 12l4 4 4-6 4 6 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17h4v3H2zM18 17h4v3h-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bulb: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.5V17h8v-2.5A7 7 0 0012 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return <span className={wrap}>{icons[type] ?? icons.bulb}</span>;
}

function ValueItem({ value }) {
  return (
    <article className="home1-about-value-item flex gap-4 items-start min-w-0">
      <ValueIcon type={value.icon} />
      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] sm:text-[18px] font-extrabold text-[#111827] mb-2 leading-snug">{value.title}</h3>
        <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#64748b] m-0">{value.description}</p>
      </div>
    </article>
  );
}

function ValuesHub() {
  return (
    <div className="home1-about-values-hub" aria-hidden="true">
      <div className="home1-about-values-hub__ring">
        <div className="home1-about-values-hub__content">
          <span className="home1-about-values-hub__icon">
            <svg className="home1-about-values-hub__icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L3 14h8l-1 8 10-12h-7l1-8z" />
            </svg>
          </span>
          <p className="home1-about-values-hub__eyebrow">Since 2012</p>
          <p className="home1-about-values-hub__label">NICEIC approved</p>
        </div>
      </div>
    </div>
  );
}

export default function AboutCoreValuesSection() {
  return (
    <section className="home1-about-values bg-[#f8fafc] py-12 sm:py-16 lg:py-20" aria-labelledby="about-values-heading">
      <div className={SERVICES_PAGE_CONTAINER}>
        <h2
          id="about-values-heading"
          className="text-center text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold tracking-tight text-[#111827] mb-10 sm:mb-14 lg:mb-16"
        >
          {ABOUT_CORE_VALUES.title}
        </h2>

        <div className="home1-about-values-layout">
          <div className="home1-about-values-col home1-about-values-col--left flex flex-col gap-8 sm:gap-10 lg:gap-12">
            {ABOUT_CORE_VALUES.left.map((value) => (
              <ValueItem key={value.id} value={value} />
            ))}
          </div>

          <div className="home1-about-values-center">
            <ValuesHub />
          </div>

          <div className="home1-about-values-col home1-about-values-col--right flex flex-col gap-8 sm:gap-10 lg:gap-12">
            {ABOUT_CORE_VALUES.right.map((value) => (
              <ValueItem key={value.id} value={value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
