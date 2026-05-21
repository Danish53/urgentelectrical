import { SERVICES_PAGE_TRUST } from "@/data/servicesPage";
import { CONTAINER } from "@/components/home1/constants";

export default function ServicesTrustStrip() {
  return (
    <section className="home1-stats-bar overflow-x-clip" aria-label="Service guarantees">
      <div className={CONTAINER}>
        <ul className="grid grid-cols-2 lg:grid-cols-4 list-none p-0 m-0 divide-y sm:divide-y-0 divide-white/10">
          {SERVICES_PAGE_TRUST.map((s, i) => (
            <li
              key={s.label}
              className={`sm:border-r sm:border-white/10 ${i === SERVICES_PAGE_TRUST.length - 1 ? "sm:border-r-0" : ""} min-w-0`}
            >
              <div className="home1-stats-item">
                <p className="home1-stats-value">{s.value}</p>
                <p className="home1-stats-title">{s.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
