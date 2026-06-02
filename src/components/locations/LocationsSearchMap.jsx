"use client";

import { useEffect, useState } from "react";
import { useBookingOptions } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { buildCheckoutHref } from "@/lib/checkoutHref";
import { LOCATIONS_MAP_EMBED } from "@/data/locationsPage";

export default function LocationsSearchMap() {
  const { options, loading: servicesLoading } = useBookingOptions();
  const [service, setService] = useState("");

  useEffect(() => {
    if (options.length && !service) {
      setService(options[0].name);
    }
  }, [options, service]);
  const [postcode, setPostcode] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    window.location.href = buildCheckoutHref({
      service: service || undefined,
      postcode: postcode.trim() || undefined,
    });
  }

  return (
    <section className="home1-locations-search-map bg-white py-10 sm:py-12 lg:py-14" aria-label="Area search and coverage map">
      <div className={SERVICES_PAGE_CONTAINER}>
        <div className="rounded-2xl overflow-hidden bg-[#111827] shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h2 className="text-white text-[20px] sm:text-[22px] font-extrabold mb-1">Find services in your area</h2>
            <p className="text-white/65 text-[14px] sm:text-[15px] mb-5 sm:mb-6">
              Select a service and enter your postcode to get started
            </p>

            <form
              onSubmit={handleSearch}
              className="home1-locations-search-form"
              aria-label="Search services by postcode"
            >
              <div className="home1-locations-search-field home1-locations-search-field--service">
                <label htmlFor="locations-service">Service</label>
                {servicesLoading ? (
                  <FormFieldSkeleton className="min-h-[50px] rounded-xl" />
                ) : (
                  <select
                    id="locations-service"
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={!options.length}
                    className="home1-locations-search-input home1-locations-search-input--select w-full cursor-pointer"
                  >
                    {options.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="home1-locations-search-field home1-locations-search-field--postcode">
                <label htmlFor="locations-postcode">Postcode</label>
                <input
                  id="locations-postcode"
                  name="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. NG1 1AA"
                  autoComplete="postal-code"
                  maxLength={8}
                  className="home1-locations-search-input home1-locations-search-input--postcode w-full"
                />
              </div>
              <button type="submit" className="home1-locations-search-submit">
                Search
              </button>
            </form>
          </div>

          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#1e293b]">
            <iframe
              title="Map showing Urgent Electrical service coverage across Nottingham and the East Midlands"
              src={LOCATIONS_MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
