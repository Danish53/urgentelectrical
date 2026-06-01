export default function CheckoutSummarySkeleton() {
  return (
    <aside className="home1-checkout-summary w-full min-w-0" aria-busy="true" aria-label="Loading booking summary">
      <div className="home1-checkout-summary-card w-full">
        <div className="home1-checkout-skeleton-summary-head">
          <div className="ue-skeleton h-2.5 w-16 rounded mx-auto mb-2" />
          <div className="ue-skeleton h-4 w-28 rounded mx-auto" />
        </div>
        <div className="home1-checkout-summary-body home1-checkout-skeleton-summary-body">
          <div className="space-y-2 pb-3 border-b border-[#f1f5f9]">
            <div className="ue-skeleton h-2.5 w-12 rounded" />
            <div className="ue-skeleton h-4 w-full rounded" />
            <div className="ue-skeleton h-3 w-2/3 rounded" />
          </div>
          <div className="ue-skeleton h-9 w-full rounded-lg mt-3" />
          <div className="space-y-2 mt-3 pt-3 border-t border-[#f1f5f9]">
            <div className="ue-skeleton h-3 w-full rounded" />
            <div className="ue-skeleton h-3 w-full rounded" />
            <div className="ue-skeleton h-4 w-full rounded mt-1" />
          </div>
        </div>
      </div>
    </aside>
  );
}
