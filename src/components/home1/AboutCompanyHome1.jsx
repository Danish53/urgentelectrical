import Link from "next/link";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconArrow, IconCheck, IconPhone } from "./icons";

const HIGHLIGHTS = [
  "NICEIC approved since 2014",
  "Domestic, commercial & industrial",
  "Fixed-price online booking",
  "24/7 emergency response",
];

const COVERAGE_AREAS = ["Nottingham", "Derby", "Leicester", "Loughborough", "East Midlands"];

const METRICS = [
  { value: "2014", label: "Est." },
  { value: "NICEIC", label: "Approved" },
  { value: "24/7", label: "Cover" },
];

export default function AboutCompanyHome1() {
  return (
    <section
      id="about"
      className="pt-10 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-24 bg-white overflow-x-clip scroll-mt-28"
      aria-labelledby="home-about-heading"
    >
      <div className={CONTAINER}>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-14 items-center">
          <div className="min-w-0">
            <SectionHeader
              id="home-about-heading"
              eyebrow="About our company"
              title="Nottingham electricians you can rely on"
              description="Safe, certified electrical work for homes and businesses across Nottingham and the East Midlands."
              align="left"
              compact
            />
            <ul className="grid sm:grid-cols-2 gap-3 mb-8 mt-2">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2 text-[14px] font-medium text-[var(--home1-text)]">
                  <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
            <Link href="/services" className="home1-btn-primary text-sm py-3 px-5 inline-flex">
              Explore our services
              <IconArrow className="w-4 h-4" />
            </Link>
          </div>

          <aside className="home1-about-panel w-full min-w-0" aria-label="Service coverage and credentials">
            <div className="home1-about-panel-inner">
              <span className="home1-about-panel-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shrink-0" aria-hidden="true" />
                Local &amp; responsive
              </span>
              <h3 className="home1-about-panel-title">Covering the East Midlands</h3>
              <ul className="home1-about-areas">
                {COVERAGE_AREAS.map((area) => (
                  <li key={area}>
                    <span className="home1-about-area-pill">{area}</span>
                  </li>
                ))}
              </ul>
              <div className="home1-about-metrics">
                {METRICS.map((m) => (
                  <div key={m.label} className="home1-about-metric">
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
              <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-about-panel-cta">
                <IconPhone className="w-5 h-5 shrink-0" />
                {FOOTER_PHONE}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
