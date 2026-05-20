import { SERVICE_AREAS } from "@/data/areas";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";

export default function AreasHome1() {
  return (
    <section className={`home1-section-dark ${SECTION_PY} overflow-x-clip`} aria-labelledby="home1-areas-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home1-areas-heading"
          eyebrow="Areas we cover"
          title="Nottingham & Nottinghamshire"
          description="Local emergency electricians across the East Midlands."
          light
        />

        <ul className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
          {SERVICE_AREAS.map((area) => (
            <li key={area}>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-[var(--home1-red)] hover:border-[var(--home1-red)] transition-colors cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--home1-red)] ring-2 ring-white/30" aria-hidden="true" />
                {area}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
