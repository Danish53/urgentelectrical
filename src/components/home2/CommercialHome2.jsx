import Home2Image from "./Home2Image";
import ServiceCategoriesGrid from "@/components/services/ServiceCategoriesGrid";
import { COMMERCIAL_BADGES, COMMERCIAL_STATS } from "@/data/commercialSection";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconCheck } from "./icons";

export default function CommercialHome2() {
  return (
    <section className="overflow-x-clip" aria-labelledby="home2-commercial-heading">
      <div className="home2-section home2-section--light !py-12 lg:!py-14">
        <div className={`${CONTAINER} grid lg:grid-cols-2 gap-10 items-center`}>
          <SectionHeader
            id="home2-commercial-heading"
            eyebrow="Commercial & domestic"
            title="Electrical contractors for every property type"
            description="From rental EICRs to full commercial installs — one trusted team."
            align="left"
            compact
          />
          <div className="home2-image-panel relative min-h-[240px] lg:min-h-[280px]">
            <Home2Image src="/featured/fire-alarm.jpg" alt="Commercial electrical services" sizes="(max-width: 1024px) 100vw, 480px" />
          </div>
        </div>
      </div>

      <div className="home2-section home2-section--surface">
        <div className={CONTAINER}>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {COMMERCIAL_BADGES.map((b) => (
              <span key={b.id} className="home2-badge">
                <IconCheck className="text-[var(--h2-red)] w-4 h-4" />
                {b.label}
              </span>
            ))}
          </div>
          <ServiceCategoriesGrid />
        </div>
      </div>

      <div className="home2-section home2-section--dark !py-12">
        <div className={`${CONTAINER} grid grid-cols-2 lg:grid-cols-4 gap-6 text-center`}>
          {COMMERCIAL_STATS.map((s) => (
            <div key={s.title}>
              <p className="text-3xl font-black text-[#ff5a3c]">{s.value}</p>
              <p className="font-bold text-white mt-2">{s.title}</p>
              <p className="text-sm text-white/60">{s.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
