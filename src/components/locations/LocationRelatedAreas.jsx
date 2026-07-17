import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

/**
 * @param {{
 *   currentSlug: string,
 *   areas?: { name: string, slug: string, href: string }[],
 * }} props
 */
export default function LocationRelatedAreas({ currentSlug, areas = [] }) {
  const relatedAreas = (areas ?? []).filter(
    (area) => area?.slug && area.slug !== currentSlug && area.name,
  );

  if (!relatedAreas.length) return null;

  return (
    <section
      className="home1-locations-areas bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="location-related-areas-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <h2
          id="location-related-areas-heading"
          className="text-center text-[24px] sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[#111827] mb-8 sm:mb-10"
        >
          We proudly serve the following areas
        </h2>

        <ul className="home1-locations-areas-grid list-none p-0 m-0">
          {relatedAreas.map((area) => (
            <li key={area.slug} className="home1-locations-area-item">
              <Link href={area.href} className="home1-locations-area-card">
                <span className="home1-locations-area-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                  </svg>
                </span>
                <span className="home1-locations-area-body">
                  <span className="home1-locations-area-name">{area.name}</span>
                  <span className="home1-locations-area-cta">View local electricians →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
