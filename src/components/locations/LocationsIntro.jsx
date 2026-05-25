import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { LOCATIONS_INTRO } from "@/data/locationsPage";

export default function LocationsIntro() {
  return (
    <section className="home1-locations-intro bg-white pt-10 sm:pt-12 lg:pt-14 pb-6 sm:pb-8" aria-labelledby="locations-intro-heading">
      <div className={`${SERVICES_PAGE_CONTAINER} max-w-4xl mx-auto text-center`}>
        <h2
          id="locations-intro-heading"
          className="text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold leading-[1.2] tracking-tight text-[#111827] mb-6 sm:mb-8"
        >
          {LOCATIONS_INTRO.title}
        </h2>
        <div className="flex flex-col gap-4 text-left sm:text-center max-w-3xl mx-auto">
          {LOCATIONS_INTRO.paragraphs.map((para) => (
            <p key={para.slice(0, 48)} className="text-[15px] sm:text-[16px] leading-[1.75] text-[#64748b] m-0">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
