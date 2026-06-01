export default function CheckoutMainSkeleton() {
  return (
    <div className="home1-checkout-skeleton-main" aria-busy="true" aria-label="Loading checkout">
      <div className="home1-checkout-skeleton-step-header">
        <div className="ue-skeleton h-3 w-20 rounded" />
        <div className="ue-skeleton h-5 w-44 max-w-[85%] rounded mt-2" />
        <div className="ue-skeleton h-3 w-full max-w-[280px] rounded mt-2" />
      </div>

      <div className="home1-checkout-card home1-checkout-skeleton-card">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="ue-skeleton h-4 w-28 rounded" />
          <div className="ue-skeleton h-7 w-14 rounded-lg shrink-0" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="ue-skeleton h-8 w-8 rounded-lg shrink-0" />
          <div className="ue-skeleton h-4 w-24 rounded" />
          <div className="ue-skeleton h-8 w-8 rounded-lg shrink-0" />
        </div>
        <div className="home1-checkout-skeleton-cal-grid">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="ue-skeleton home1-checkout-skeleton-cal-cell rounded-md" />
          ))}
        </div>
      </div>

      <div className="home1-checkout-card home1-checkout-skeleton-card">
        <div className="ue-skeleton h-4 w-32 rounded mb-3" />
        <div className="home1-checkout-skeleton-slots">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="ue-skeleton home1-checkout-skeleton-slot rounded-lg" />
          ))}
        </div>
      </div>

      <div className="ue-skeleton home1-checkout-skeleton-cta rounded-lg" />
    </div>
  );
}
