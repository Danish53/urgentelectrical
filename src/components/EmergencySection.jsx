import Link from "next/link";
import {
  EMERGENCY_STATS,
  EMERGENCY_STATS_LABELS,
  EMERGENCY_PHONE,
  EMERGENCY_PHONE_TEL,
} from "@/data/emergencySection";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const ACCENT = "#D32F2F";
const ACCENT_DARK = "#b52812";

function IconPhone() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

export default function EmergencySection() {
  return (
    <section className="bg-[#0a0a0a] overflow-x-clip" aria-labelledby="emergency-section-heading">
      <div className={`${SECTION_CONTAINER} pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24`}>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 xl:gap-20 items-center">
          {/* Left */}
          <div className="max-w-2xl">
            <p
              className="flex items-center gap-3 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.14em] mb-7 sm:mb-9"
              style={{ color: ACCENT }}
            >
              <span className="block w-10 h-[2px] shrink-0" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
              Emergency Electrician · Nottingham · 24/7
            </p>

            <h2 id="emergency-section-heading" className="emergency-display-headline mb-7 sm:mb-9">
              <span className="emergency-display-line text-white">Urgent Electrical –</span>
              <span className="emergency-display-line emergency-display-line--accent">Emergency</span>
              <span className="emergency-display-line text-white">Electrician Nottingham</span>
            </h2>

            <p className="text-[#d4d4d4] text-[15px] sm:text-[16px] leading-[1.7] mb-9 sm:mb-11 max-w-xl">
              Specialist emergency electricians in Nottingham providing fast, reliable 24-hour call-outs for
              domestic and commercial properties. Power cuts, tripped breakers, burning smells, sparks, or
              complete electrical failure — our NICEIC certified electricians cover Nottingham and the East
              Midlands around the clock.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${EMERGENCY_PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2.5 min-w-[160px] px-7 py-3.5 rounded-md text-white font-bold text-[13px] sm:text-sm uppercase tracking-[0.06em] transition-all duration-300 ease-out delay-0 hover:delay-100 cursor-pointer hover:brightness-110 hover:scale-[1.02]"
                style={{ backgroundColor: ACCENT }}
              >
                <IconPhone />
                Call Us Now
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2.5 min-w-[160px] px-7 py-3.5 rounded-md border border-white/70 text-white font-bold text-[13px] sm:text-sm uppercase tracking-[0.06em] bg-transparent transition-all duration-300 ease-out delay-0 hover:delay-100 cursor-pointer hover:bg-white hover:text-[#0a0a0a]"
              >
                <IconCalendar />
                Book Online
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="relative flex flex-col items-center lg:items-end justify-center text-center lg:text-right min-h-[240px] lg:min-h-[320px] py-6 lg:py-0 overflow-x-clip">
            <span
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[100px] sm:text-[140px] lg:text-[160px] xl:text-[180px] font-black leading-none select-none tracking-tighter"
              style={{ color: "rgba(255,255,255,0.05)" }}
              aria-hidden="true"
            >
              24/7
            </span>

            <div className="relative z-10 lg:pr-2">
              <p className="text-[#9a9a9a] text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-4">
                Emergency Line
              </p>
              <a
                href={`tel:${EMERGENCY_PHONE_TEL}`}
                className="block text-white text-[34px] sm:text-[42px] lg:text-[50px] xl:text-[56px] font-black tracking-tight leading-[1] mb-5 transition-opacity duration-300 hover:opacity-85 cursor-pointer"
              >
                {EMERGENCY_PHONE}
              </a>
              <p
                className="inline-flex items-center justify-center lg:justify-end gap-2 text-[13px] sm:text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  •
                </span>
                Available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats — full width red bar */}
      <div className="w-full" style={{ backgroundColor: ACCENT }}>
        <ul className="grid grid-cols-2 lg:grid-cols-4 max-w-[1440px] mx-auto">
          {EMERGENCY_STATS.map((stat, index) => (
            <li
              key={stat.value}
              className={`emergency-stat-item flex flex-col items-center justify-center text-center py-9 sm:py-10 lg:py-11 px-4 cursor-pointer ${
                index % 2 === 0 ? "border-r" : ""
              } ${index < 2 ? "border-b lg:border-b-0" : ""} ${
                index < EMERGENCY_STATS.length - 1 ? "lg:border-r" : ""
              }`}
              style={{ borderColor: ACCENT_DARK }}
            >
              <span className="text-white text-[24px] sm:text-[28px] lg:text-[32px] font-black leading-none mb-2.5">
                {stat.value}
              </span>
              <span className="text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]">
                {EMERGENCY_STATS_LABELS[index]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
