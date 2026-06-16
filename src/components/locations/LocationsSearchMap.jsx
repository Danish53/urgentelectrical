"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingOptions } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { buildCheckoutHref } from "@/lib/checkoutHref";

const LocationsLeafletMap = dynamic(() => import("@/components/locations/LocationsLeafletMap"), {
  ssr: false,
  loading: () => <div className="home1-locations-search-slim__map-loading" aria-hidden="true" />,
});

export default function LocationsSearchMap() {
  const router = useRouter();
  const { options, loading: servicesLoading } = useBookingOptions();
  const [service, setService] = useState("");
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    if (options.length && !service) {
      setService(options[0].name);
    }
  }, [options, service]);

  function handleSearch(e) {
    e.preventDefault();
    router.push(
      buildCheckoutHref({
        service: service || undefined,
        postcode: postcode.trim() || undefined,
      }),
    );
  }

  return (
    <section className="home1-locations-search-map bg-white py-8 sm:py-10" aria-label="Area search and coverage map">
      <div className={SERVICES_PAGE_CONTAINER}>
        <div className="home1-locations-search-slim">
          <div className="home1-locations-search-slim__top">
            <h2 className="home1-locations-search-slim__title">Find services in your area</h2>
            <p className="home1-locations-search-slim__subtitle">
              Select a service and enter your postcode to get started
            </p>

            <form onSubmit={handleSearch} className="home1-locations-search-slim__form" aria-label="Search services by postcode">
              <label htmlFor="locations-service" className="sr-only">
                Service
              </label>
              {servicesLoading ? (
                <FormFieldSkeleton className="home1-locations-search-slim__skeleton" />
              ) : (
                <select
                  id="locations-service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  disabled={!options.length}
                  className="home1-locations-search-slim__field home1-locations-search-slim__field--select"
                >
                  {!options.length ? <option value="">Select a service</option> : null}
                  {options.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              <label htmlFor="locations-postcode" className="sr-only">
                Postcode
              </label>
              <input
                id="locations-postcode"
                name="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                placeholder="Enter postcode"
                autoComplete="postal-code"
                maxLength={8}
                className="home1-locations-search-slim__field home1-locations-search-slim__field--postcode"
              />

              <button type="submit" className="home1-locations-search-slim__btn">
                Search
              </button>
            </form>
          </div>

          <div className="home1-locations-search-slim__map">
            <LocationsLeafletMap />
          </div>
        </div>
      </div>
    </section>
  );
}
