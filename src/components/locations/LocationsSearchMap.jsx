"use client";

import dynamic from "next/dynamic";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

const LocationsLeafletMap = dynamic(() => import("@/components/locations/LocationsLeafletMap"), {
  ssr: false,
  loading: () => <div className="home1-locations-map__loading" aria-hidden="true" />,
});

export default function LocationsSearchMap() {
  return (
    <section className="home1-locations-map-section" aria-label="Coverage map">
      <div className={SERVICES_PAGE_CONTAINER}>
        <div className="home1-locations-map">
          <LocationsLeafletMap />
        </div>
      </div>
    </section>
  );
}
