import {
  COMMERCIAL_BADGES,
  COMMERCIAL_SERVICES,
  COMMERCIAL_STATS,
} from "@/data/commercialSection";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const RED = "#d32f2f";
const DARK = "#1a1a1a";
const DIVIDER = "#eeeeee";
const ICON_BG = "#fdf0f0";

function IconCheck() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 105.4 5.4L12 20l-4-4 8.7-9.7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

const SERVICE_ICONS = {
  home: IconHome,
  briefcase: IconBriefcase,
  wrench: IconWrench,
  bolt: IconBolt,
};

const BADGE_ICONS = {
  check: IconCheck,
  clock: IconClock,
};

function CommercialBadge({ badge }) {
  const Icon = BADGE_ICONS[badge.icon];

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-white/[0.08] bg-[#252525]">
      <span style={{ color: RED }}>
        <Icon />
      </span>
      <span className="text-white text-[14px] font-medium leading-snug">{badge.label}</span>
    </div>
  );
}

function ServiceCard({ service, index, total }) {
  const Icon = SERVICE_ICONS[service.icon];

  return (
    <article
      className={`flex flex-col items-center text-center px-6 sm:px-8 py-10 sm:py-12 lg:py-14 border-[#eeeeee] ${
        index < 2 ? "border-b md:border-b lg:border-b-0" : "lg:border-b-0"
      } ${index % 2 === 0 && index < total - 1 ? "md:border-r" : ""} ${
        index < total - 1 ? "lg:border-r" : ""
      }`}
    >
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-5 sm:mb-6"
        style={{ backgroundColor: ICON_BG, color: RED }}
      >
        <Icon />
      </div>
      <h3 className="font-bold text-[#1a1a1a] text-[16px] sm:text-[17px] leading-snug mb-3 max-w-[280px]">
        {service.title}
      </h3>
      <p className="text-[#6b7280] text-[14px] leading-[1.65] max-w-[300px]">{service.description}</p>
    </article>
  );
}

function StatItem({ stat, index, total }) {
  const showRightBorder = index < total - 1;

  return (
    <div
      className={`flex items-center gap-5 sm:gap-6 px-6 sm:px-10 lg:px-12 py-10 sm:py-12 ${
        showRightBorder ? "border-b md:border-b-0 md:border-r" : ""
      }`}
      style={{ borderColor: DIVIDER }}
    >
      <span className="text-[40px] sm:text-[48px] lg:text-[52px] font-black leading-none shrink-0" style={{ color: RED }}>
        {stat.value}
      </span>
      <div className="text-left min-w-0">
        <p className="font-bold text-[#1a1a1a] text-[15px] sm:text-base leading-snug mb-1">{stat.title}</p>
        <p className="text-[#6b7280] text-[13px] sm:text-sm leading-relaxed">{stat.subtitle}</p>
      </div>
    </div>
  );
}

export default function CommercialSection() {
  return (
    <section aria-labelledby="commercial-section-heading">
      {/* Band 1 — dark header */}
      <div style={{ backgroundColor: DARK }}>
        <div className={`${SECTION_CONTAINER} py-14 sm:py-16 lg:py-20`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2
                id="commercial-section-heading"
                className="font-sans text-white text-[22px] sm:text-[26px] lg:text-[28px] font-bold uppercase leading-[1.2] tracking-tight mb-5 sm:mb-6"
              >
                Commercial Electricians in Nottingham
              </h2>
              <p className="text-[#b0b0b0] text-[15px] sm:text-base leading-[1.75] max-w-2xl">
                We are NICEIC approved commercial and industrial electricians serving Nottingham and
                Nottinghamshire since 2014. Safe, efficient, and fully compliant electrical solutions —
                installations, maintenance, fault finding, and 24/7 emergency repairs for businesses of all
                sizes across the East Midlands.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-3.5 w-full max-w-md lg:max-w-none lg:ml-auto">
              {COMMERCIAL_BADGES.map((badge) => (
                <CommercialBadge key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Band 2 — white service grid */}
      <div className="bg-white">
        <div className={`${SECTION_CONTAINER} max-lg:px-0`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {COMMERCIAL_SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                total={COMMERCIAL_SERVICES.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Band 3 — light gray stats */}
      <div className="bg-[#f5f5f5]">
        <div className={`${SECTION_CONTAINER} max-md:px-0`}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {COMMERCIAL_STATS.map((stat, index) => (
              <StatItem key={stat.value} stat={stat} index={index} total={COMMERCIAL_STATS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
