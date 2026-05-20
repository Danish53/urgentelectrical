import Home2Image from "./Home2Image";
import { WHY_CHOOSE_US_CARDS } from "@/data/whyChooseUs";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconCheck, IconBolt } from "./icons";

export default function WhyChooseUsHome2() {
  return (
    <section className="home2-section home2-section--dark overflow-x-clip" aria-labelledby="home2-why-heading">
      <div className={CONTAINER}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-12">
          <div className="home2-image-panel relative min-h-[280px] lg:min-h-[420px]">
            <Home2Image src="/featured/eicr.jpg" alt="NICEIC approved electrical work" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <p className="text-[#ff5a3c] text-xs font-bold uppercase tracking-widest mb-2">Since 2014</p>
              <p className="text-white text-2xl font-extrabold leading-tight">Nottingham&apos;s trusted electricians</p>
            </div>
          </div>
          <div>
            <SectionHeader
              id="home2-why-heading"
              eyebrow="Why choose us"
              title="Quality you can rely on, every visit"
              description="Hundreds of five-star reviews. First-visit fixes. Fully insured NICEIC-approved engineers."
              align="left"
              compact
            />
            <ul className="space-y-3">
              {["24/7 dispatch", "Rapid response", "12-month warranty"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                  <IconCheck className="text-[#4ADE80] w-4 h-4" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {WHY_CHOOSE_US_CARDS.map((c) => (
            <article key={c.num} className="home2-card p-6 flex gap-4">
              <span className="w-11 h-11 rounded-xl bg-[#D3231F] flex items-center justify-center text-white shrink-0" aria-hidden="true">
                <IconBolt className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[#ff5a3c] text-sm font-black">{c.num}</span>
                <h3 className="font-bold text-white text-lg mt-1 mb-2">{c.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{c.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
