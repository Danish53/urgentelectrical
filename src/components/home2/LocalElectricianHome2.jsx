import Home2Image from "./Home2Image";
import { LOCAL_COLUMNS } from "@/data/localElectrician";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconPhone } from "./icons";

export default function LocalElectricianHome2() {
  return (
    <section className="home2-section home2-section--light overflow-x-clip" aria-labelledby="home2-local-heading">
      <div className={CONTAINER}>
        <SectionHeader id="home2-local-heading" eyebrow="Local experts" title="Your Nottingham & East Midlands electricians" />

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 home2-image-panel relative min-h-[300px]">
            <Home2Image src="/featured/pat.jpg" alt="Local electrician at work" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-1 gap-6">
            {LOCAL_COLUMNS.map((col) => (
              <article key={col.id} className="home2-card p-6 sm:p-7">
                <h3 className="font-bold text-lg text-[var(--h2-navy)] mb-4">{col.title}</h3>
                {col.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-sm text-[var(--h2-muted)] leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {col.highlight && (
                  <p className="mt-4 text-sm font-medium text-[var(--h2-red)] bg-[var(--h2-red-soft)] rounded-xl px-4 py-3 flex items-start gap-2">
                    <IconPhone className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>
                      {col.highlightPhone ? (
                        <>
                          {col.highlight.split("0115 778 0622")[0]}
                          <a href={`tel:${col.highlightPhone}`} className="font-bold underline">
                            0115 778 0622
                          </a>
                          {col.highlight.split("0115 778 0622")[1]}
                        </>
                      ) : (
                        col.highlight
                      )}
                    </span>
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
