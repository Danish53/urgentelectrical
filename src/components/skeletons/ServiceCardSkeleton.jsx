export default function ServiceCardSkeleton() {
  return (
    <article
      className="home1-card h-full flex flex-col overflow-hidden border border-[#e8eaed] rounded-[14px] bg-white"
      aria-hidden="true"
    >
      <div className="relative aspect-[16/10] w-full ue-skeleton rounded-none" />
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
        <div className="ue-skeleton h-4 w-[88%]" />
        <div className="ue-skeleton h-3 w-full" />
        <div className="ue-skeleton h-3 w-[72%]" />
        <div className="ue-skeleton h-8 w-28 mt-1" />
        <div className="ue-skeleton h-3 w-24" />
        <div className="flex gap-2 mt-auto pt-2">
          <div className="ue-skeleton h-10 flex-1" />
          <div className="ue-skeleton h-10 flex-1" />
        </div>
      </div>
    </article>
  );
}
