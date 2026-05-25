import ServiceCardSkeleton from "@/components/skeletons/ServiceCardSkeleton";

/** Home2 slider placeholder */
export default function ServicesSliderSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading services">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="home2-service-slide min-h-[320px]">
          <ServiceCardSkeleton />
        </div>
      ))}
    </div>
  );
}
