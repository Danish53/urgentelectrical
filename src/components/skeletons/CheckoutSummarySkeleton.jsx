export default function CheckoutSummarySkeleton() {
  return (
    <aside className="home1-checkout-summary min-w-0" aria-busy="true" aria-label="Loading booking summary">
      <div className="home1-checkout-summary-card overflow-hidden border border-[#e8eaed] rounded-[14px] bg-white">
        <div className="ue-skeleton h-24 w-full rounded-none" />
        <div className="p-5 space-y-4">
          <div className="ue-skeleton h-4 w-3/4" />
          <div className="ue-skeleton h-4 w-full" />
          <div className="ue-skeleton h-4 w-5/6" />
          <div className="ue-skeleton h-10 w-full mt-2" />
          <div className="ue-skeleton h-3 w-2/3" />
          <div className="ue-skeleton h-3 w-1/2" />
        </div>
      </div>
    </aside>
  );
}
