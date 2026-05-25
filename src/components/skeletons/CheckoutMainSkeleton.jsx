export default function CheckoutMainSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading checkout">
      <div className="ue-skeleton h-20 w-full rounded-[14px]" />
      <div className="home1-checkout-card p-6 space-y-4 border border-[#e8eaed] rounded-[14px] bg-white">
        <div className="ue-skeleton h-6 w-48" />
        <div className="ue-skeleton h-4 w-full max-w-md" />
        <div className="ue-skeleton h-64 w-full rounded-xl" />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ue-skeleton h-11 rounded-lg" />
          ))}
        </div>
        <div className="ue-skeleton h-12 w-full rounded-lg mt-4" />
      </div>
    </div>
  );
}
