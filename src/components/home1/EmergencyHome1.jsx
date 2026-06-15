import Link from "next/link";
import {
  EMERGENCY_STATS,
  EMERGENCY_STATS_LABELS,
  EMERGENCY_PHONE,
  EMERGENCY_PHONE_TEL,
} from "@/data/emergencySection";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconPhone } from "./icons";

export default function EmergencyHome1() {
  return (
    <section
      id="emergency"
      className={`home1-section-red ${SECTION_PY} overflow-x-clip relative scroll-mt-28`}
      aria-labelledby="home1-emergency-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L35 25H55L38 38L43 58L30 45L17 58L22 38L5 25H25Z' fill='%23fff'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className={`${CONTAINER} relative z-10`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeader
              id="home1-emergency-heading"
              eyebrow="Emergency 24/7"
              title="Emergency electrician in Nottingham"
              description="Power cuts, tripping breakers, burning smells or sparks — NICEIC engineers across Nottingham, 24/7."
              align="left"
              light
            />
            <div className="flex flex-wrap gap-3 -mt-4">
              <a href={`tel:${EMERGENCY_PHONE_TEL}`} className="home1-btn-white">
                <IconPhone />
                {EMERGENCY_PHONE}
              </a>
              <Link href="/services" className="home1-btn-outline">
                Book online
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {EMERGENCY_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-center hover:bg-white/15 transition-colors"
              >
                <p className="text-white text-2xl sm:text-[28px] font-black mb-2">{stat.value}</p>
                <p className="text-white/75 text-[10px] font-bold uppercase tracking-[0.12em] leading-snug">
                  {EMERGENCY_STATS_LABELS[i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
