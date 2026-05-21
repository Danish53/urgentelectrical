import { COMMERCIAL_STATS } from "@/data/commercialSection";
import { CONTAINER } from "./constants";

export default function CompanyStatsHome1() {
  return (
    <section
      id="stats"
      className="home1-stats-bar overflow-x-clip scroll-mt-28"
      aria-labelledby="home-stats-heading"
    >
      <h2 id="home-stats-heading" className="sr-only">
        Company statistics
      </h2>
      <div className={CONTAINER}>
        <ul className="grid grid-cols-1 sm:grid-cols-3 list-none p-0 m-0 divide-y sm:divide-y-0 divide-white/10">
          {COMMERCIAL_STATS.map((s) => (
            <li
              key={s.title}
              className="sm:border-r sm:border-white/10 last:sm:border-r-0 min-w-0"
            >
              <article className="home1-stats-item">
                <p className="home1-stats-value" aria-hidden="true">
                  {s.value}
                </p>
                <div className="home1-stats-copy">
                  <h3 className="home1-stats-title">{s.title}</h3>
                  <p className="home1-stats-subtitle">{s.subtitle}</p>
                </div>
                <span className="sr-only">
                  {s.value} — {s.title}. {s.subtitle}
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
