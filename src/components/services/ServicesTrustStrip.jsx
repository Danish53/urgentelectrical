import { SERVICES_PAGE_TRUST } from "@/data/servicesPage";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

export default function ServicesTrustStrip() {
  return (
    <section
      className="home1-stats-bar home1-services-trust overflow-x-clip"
      aria-label="Service guarantees"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <ul className="home1-services-trust-grid list-none p-0 m-0">
          {SERVICES_PAGE_TRUST.map((s) => (
            <li key={s.label} className="home1-services-trust-cell min-w-0">
              <article className="home1-stats-item home1-services-trust-item">
                <p className="home1-stats-value home1-services-trust-value" aria-hidden="true">
                  {s.value}
                </p>
                <div className="home1-stats-copy">
                  <h3 className="home1-stats-title">{s.label}</h3>
                </div>
                <span className="sr-only">
                  {s.value} — {s.label}
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
