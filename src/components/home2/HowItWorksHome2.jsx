import { HOW_IT_WORKS_STEPS } from "@/data/howItWorks";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";

export default function HowItWorksHome2() {
  return (
    <section className="home2-section home2-section--light overflow-x-clip" aria-labelledby="home2-how-heading">
      <div className={CONTAINER}>
        <SectionHeader id="home2-how-heading" eyebrow="How it works" title="Four steps to a confirmed visit" align="center" />
        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0 max-w-6xl mx-auto">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.num} className="home2-card p-6 text-center">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--h2-red)] text-white font-black text-xl items-center justify-center mb-4 shadow-lg shadow-red-500/25">
                {step.num}
              </span>
              <h3 className="font-bold text-[var(--h2-navy)] mb-2">{step.title}</h3>
              <p className="text-[var(--h2-muted)] text-sm leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
