import "@/components/skeletons/skeleton.css";

export default function OrdersListSkeleton({ count = 3 }) {
  return (
    <ul className="home1-orders-list home1-orders-list--skeleton list-none p-0 m-0" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <article className="home1-orders-card home1-orders-card--skeleton">
            <div className="home1-orders-card-top">
              <div className="flex-1 space-y-2 min-w-0">
                <div className="ue-skeleton h-3 w-24 rounded" />
                <div className="ue-skeleton h-5 w-4/5 max-w-[240px] rounded" />
                <div className="ue-skeleton h-3 w-20 rounded" />
              </div>
              <div className="ue-skeleton h-6 w-20 rounded-full shrink-0" />
            </div>
            <div className="grid gap-2 mt-4 sm:grid-cols-2">
              <div className="ue-skeleton h-10 w-full rounded" />
              <div className="ue-skeleton h-10 w-full rounded" />
              <div className="ue-skeleton h-10 w-full rounded" />
              <div className="ue-skeleton h-10 w-full rounded" />
            </div>
            <div className="flex flex-col gap-2 mt-4 sm:flex-row">
              <div className="ue-skeleton h-10 flex-1 rounded-lg" />
              <div className="ue-skeleton h-10 flex-1 rounded-lg" />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
