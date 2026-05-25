export default function ServicesLoadError({ message, onRetry }) {
  return (
    <div
      className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-5 py-6 text-center max-w-lg mx-auto"
      role="alert"
    >
      <p className="text-[#991b1b] text-sm font-semibold mb-3">
        {message || "We could not load services. Please try again."}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="home1-login-submit inline-flex !w-auto !py-2.5 !px-5 !text-[12px]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
