import { COMMERCIAL_BADGES, COMMERCIAL_STATS } from "@/data/commercialSection";
import ServiceCategoriesGrid from "@/components/services/ServiceCategoriesGrid";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconCheck } from "./icons";

export default function CommercialHome1() {
  return (
    <section className="overflow-x-clip" aria-labelledby="home1-commercial-heading">
      <div className="home1-section-dark py-14 sm:py-16">
        <div className={CONTAINER}>
          <SectionHeader
            id="home1-commercial-heading"
            eyebrow="Commercial & domestic"
            title="Full electrical services for Nottingham homes & businesses"
            align="left"
            light
            compact
          />
          <div className="flex flex-wrap gap-3 mt-3">
            {COMMERCIAL_BADGES.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-white text-sm font-semibold"
              >
                <IconCheck className="w-4 h-4 text-[#4ADE80]" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`home1-section-surface ${SECTION_PY}`}>
        <div className={CONTAINER}>
          <ServiceCategoriesGrid />
        </div>
      </div>

      <div className="bg-white py-12 sm:py-14 border-y border-[var(--home1-border)]">
        <div className={`${CONTAINER} grid grid-cols-2 lg:grid-cols-4 gap-8`}>
          {COMMERCIAL_STATS.map((s) => (
            <div key={s.title} className="text-center">
              <p className="text-3xl sm:text-4xl font-black" style={{ color: "var(--home1-red)" }}>
                {s.value}
              </p>
              <p className="font-bold text-[var(--home1-text)] mt-2">{s.title}</p>
              <p className="text-[var(--home1-muted)] text-sm mt-1">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
