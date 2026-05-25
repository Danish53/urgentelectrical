import Home2Image from "./Home2Image";
import {
  EMERGENCY_STATS,
  EMERGENCY_STATS_LABELS,
  EMERGENCY_PHONE,
  EMERGENCY_PHONE_TEL,
} from "@/data/emergencySection";
import { CONTAINER } from "./constants";
import { IconPhone } from "./icons";

export default function EmergencyHome2() {
  return (
    <section
      className="home2-section home2-section--dark overflow-x-clip relative"
      style={{ background: "linear-gradient(135deg, #1a0505 0%, #0a0a0a 50%, #000 100%)" }}
      aria-labelledby="home2-emergency-heading"
    >
      <div className={CONTAINER}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="home2-eyebrow mb-4">Emergency 24/7</p>
            <h2 id="home2-emergency-heading" className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Emergency electrician in Nottingham
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed mb-8 max-w-lg">
              Power cuts, tripped breakers, burning smells, or total failure — NICEIC certified engineers, 365 days a year.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${EMERGENCY_PHONE_TEL}`} className="home2-btn home2-btn--primary">
                <IconPhone />
                {EMERGENCY_PHONE}
              </a>
              <a href="/checkout" className="home2-btn home2-btn--outline-light">
                Book online
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-10">
              {EMERGENCY_STATS.map((s, idx) => (
                <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                  <p className="text-white text-xl font-black">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">{EMERGENCY_STATS_LABELS[idx]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="home2-image-panel relative min-h-[320px] lg:min-h-[440px]">
            <Home2Image src="/featured/fault-investigation.jpg" alt="Emergency electrical repair" sizes="(max-width: 1024px) 100vw, 560px" />
            <div className="absolute inset-0 bg-[#D3231F]/20 mix-blend-multiply" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-transparent to-transparent hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
