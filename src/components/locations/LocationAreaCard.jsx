import Link from "next/link";

export function LocationAreaCardSkeleton() {
  return (
    <li className="home1-locations-area-item" aria-hidden="true">
      <div className="home1-locations-area-card home1-locations-area-card--skeleton">
        <span className="home1-locations-area-icon" />
        <span className="home1-locations-area-body">
          <span className="ue-skeleton home1-locations-area-name-skeleton" />
          <span className="ue-skeleton home1-locations-area-cta-skeleton" />
        </span>
      </div>
    </li>
  );
}

/**
 * @param {{ location: import("@/lib/locations/parseLocationsList").LocationListItem }} props
 */
export function LocationAreaCard({ location }) {
  return (
    <li className="home1-locations-area-item">
      <Link href={location.href} className="home1-locations-area-card">
        <span className="home1-locations-area-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
        </span>
        <span className="home1-locations-area-body">
          <span className="home1-locations-area-name">{location.areaName}</span>
          <span className="home1-locations-area-cta">View local electricians →</span>
        </span>
      </Link>
    </li>
  );
}
