import ServiceCardSkeleton from "@/components/skeletons/ServiceCardSkeleton";

export default function ServicesGridSkeleton({ count = 6, columns = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" }) {
  return (
    <ul
      className={`grid ${columns} gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0`}
      aria-busy="true"
      aria-label="Loading services"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="min-w-0">
          <ServiceCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
