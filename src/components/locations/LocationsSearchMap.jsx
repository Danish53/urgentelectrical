"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingOptions } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { buildCheckoutHref } from "@/lib/checkoutHref";

const LocationsLeafletMap = dynamic(() => import("@/components/locations/LocationsLeafletMap"), {
  ssr: false,
  loading: () => <div className="home1-locations-map__loading" aria-hidden="true" />,
});

export default function LocationsSearchMap() {
  const router = useRouter();
  const { options, loading: servicesLoading } = useBookingOptions();
  const [service, setService] = useState("");
  const [postcode, setPostcode] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (!service.trim()) return;
    router.push(
      buildCheckoutHref({
        service,
        postcode: postcode.trim() || undefined,
      }),
    );
  }

  return (
    <>
      <section className="home1-locations-search" aria-label="Find services in your area">
        <div className={SERVICES_PAGE_CONTAINER}>
          <div className="home1-locations-search-slim">
            <h2 className="home1-locations-search-slim__title">Find services in your area</h2>
            <p className="home1-locations-search-slim__subtitle">
              Select a service &amp; enter your postcode to get started
            </p>

            <form
              onSubmit={handleSearch}
              className="home1-locations-search-slim__form"
              aria-label="Search services by postcode"
            >
              <label htmlFor="locations-service" className="sr-only">
                Service
              </label>
              {servicesLoading ? (
                <FormFieldSkeleton className="home1-locations-search-slim__skeleton home1-locations-search-slim__skeleton--select" />
              ) : (
                <select
                  id="locations-service"
                  name="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  disabled={!options.length}
                  className={`home1-locations-search-slim__field home1-locations-search-slim__field--select${!service ? " is-placeholder" : ""}`}
                  required
                >
                  <option value="" disabled>
                    Select a Service
                  </option>
                  {options.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              {servicesLoading ? (
                <FormFieldSkeleton className="home1-locations-search-slim__skeleton home1-locations-search-slim__skeleton--postcode" />
              ) : (
                <>
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
                </>
              )}

              <button
                type="submit"
                className="home1-locations-search-slim__btn"
                disabled={servicesLoading || !options.length}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="home1-locations-map-section" aria-label="Coverage map">
        <div className={SERVICES_PAGE_CONTAINER}>
          <div className="home1-locations-map">
            <LocationsLeafletMap />
          </div>
        </div>
      </section>
    </>
  );
}
