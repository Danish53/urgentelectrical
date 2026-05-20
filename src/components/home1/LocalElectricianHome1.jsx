import { LOCAL_COLUMNS } from "@/data/localElectrician";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconPhone } from "./icons";

export default function LocalElectricianHome1() {
  return (
    <section className={`${SECTION_PY} bg-white overflow-x-clip`} aria-labelledby="home1-local-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home1-local-heading"
          eyebrow="Local experts"
          title="Your Nottingham & East Midlands electricians"
          description="Domestic emergencies and commercial contracts — fully certified, fully insured."
        />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {LOCAL_COLUMNS.map((col) => (
            <article key={col.id} className="home1-card overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-[var(--home1-border)]" style={{ background: "var(--home1-red-soft)" }}>
                <h3 className="font-bold text-[var(--home1-text)] text-lg">{col.title}</h3>
              </div>
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                {col.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-[var(--home1-muted)] text-[14px] leading-[1.75] mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
                {col.highlight && (
                  <div
                    className="mt-6 rounded-xl px-4 py-4 text-[14px] font-medium leading-relaxed flex items-start gap-3"
                    style={{ background: "var(--home1-red-soft)", color: "var(--home1-red-deep)" }}
                  >
                    <IconPhone className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      {col.highlightPhone ? (
                        <>
                          {col.highlight.split("0115 778 0622")[0]}
                          <a href={`tel:${col.highlightPhone}`} className="font-bold hover:underline" style={{ color: "var(--home1-red)" }}>
                            0115 778 0622
                          </a>
                          {col.highlight.split("0115 778 0622")[1]}
                        </>
                      ) : (
                        col.highlight
                      )}
                    </span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
