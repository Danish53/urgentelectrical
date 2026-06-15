import "@/components/skeletons/skeleton.css";

export default function SitesListSkeleton({ count = 3 }) {
  return (
    <ul className="home1-sites-list home1-sites-list--skeleton p-0 m-0" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <div className="home1-sites-card home1-sites-card--skeleton">
            <div className="mb-4 space-y-2">
              <div className="ue-skeleton h-5 w-3/5 max-w-[200px] rounded" />
              <div className="ue-skeleton h-3.5 w-2/5 max-w-[120px] rounded" />
            </div>
            <div className="space-y-2.5 mb-4">
              <div className="ue-skeleton h-3 w-full rounded" />
              <div className="ue-skeleton h-3 w-4/5 rounded" />
              <div className="ue-skeleton h-3 w-2/5 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="ue-skeleton h-9 w-20 rounded-lg" />
              <div className="ue-skeleton h-9 w-20 rounded-lg" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
