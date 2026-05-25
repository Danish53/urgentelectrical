import ServiceCardSkeleton from "@/components/skeletons/ServiceCardSkeleton";

export default function FeaturedServicesSkeleton({ compact = false, count = 4 }) {
  if (compact) {
    return (
      <div
        className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5"
        aria-busy="true"
        aria-label="Loading services"
      >
        {Array.from({ length: count }, (_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading services">
      {Array.from({ length: 3 }, (_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}
