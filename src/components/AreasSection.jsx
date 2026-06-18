import { SERVICE_AREAS } from "@/data/areas";
import { CONTAINER } from "@/components/home1/constants";

const SECTION_CONTAINER = CONTAINER;
const DARK = "#1a1a1a";
const ORANGE = "#e64a19";

export default function AreasSection() {
  return (
    <section aria-labelledby="areas-section-heading">
      <div className="bg-[#1a1a1a]">
        <div
          className={`${SECTION_CONTAINER} py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
        >
          <h2
            id="areas-section-heading"
            className="text-white text-[13px] sm:text-sm font-bold uppercase tracking-[0.06em] leading-snug"
          >
            Areas covered by our Nottingham electricians
          </h2>
          <p
            className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.1em] sm:text-right shrink-0"
            style={{ color: ORANGE }}
          >
            Nottingham &amp; Nottinghamshire
          </p>
        </div>
      </div>

      <div className="bg-[#f5f5f5] py-10 sm:py-12 lg:py-14">
        <div className={SECTION_CONTAINER}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {SERVICE_AREAS.map((area) => (
              <li key={area}>
                <div className="flex items-center gap-3 bg-white border border-[#e0e0e0] rounded-md px-4 py-3.5 sm:py-4 hover:border-[#e64a19]/40 transition-colors duration-200 cursor-default">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ORANGE }}
                    aria-hidden="true"
                  />
                  <span className="text-[#333333] text-[14px] sm:text-[15px] font-normal leading-snug">
                    {area}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
