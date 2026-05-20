import { SERVICE_AREAS } from "@/data/areas";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";

export default function AreasHome2() {
  return (
    <section className="home2-section home2-section--dark overflow-x-clip" aria-labelledby="home2-areas-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home2-areas-heading"
          eyebrow="Coverage"
          title="Areas we serve"
          description="Nottingham, Nottinghamshire & the wider East Midlands."
        />
        <ul className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {SERVICE_AREAS.map((area) => (
            <li key={area}>
              <span className="inline-block px-4 py-2.5 rounded-xl bg-white/5 border border-white/12 text-sm font-medium text-white/90 hover:bg-[var(--h2-red)] hover:border-[var(--h2-red)] transition-colors">
                {area}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
