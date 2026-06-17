"use client";

/**
 * @param {{
 *   value: boolean | null | undefined,
 *   onChange: (sameAsBilling: boolean) => void,
 *   error?: string,
 * }} props
 */
export default function CheckoutSiteSameToggle({ value, onChange, error = "" }) {
  const yesSelected = value === true;
  const noSelected = value === false;

  return (
    <section
      className={`home1-checkout-address-card home1-card home1-checkout-same-address-card${error ? " home1-checkout-same-address-card--error" : ""}`}
      aria-labelledby="checkout-site-same-label"
    >
      <h3 id="checkout-site-same-label" className="home1-checkout-address-section-title">
        Site address same as billing address?<span className="text-[#d3231f]">*</span>
      </h3>

      <div className="home1-checkout-same-address-actions" role="group" aria-label="Site address same as billing">
        <button
          type="button"
          className={`home1-checkout-same-btn home1-checkout-same-btn--yes${yesSelected ? " is-active" : ""}`}
          onClick={() => onChange(true)}
          aria-pressed={yesSelected}
        >
          <span className="home1-checkout-same-btn-icon" aria-hidden="true">
            ✓
          </span>
          <span>Yes</span>
        </button>
        <button
          type="button"
          className={`home1-checkout-same-btn home1-checkout-same-btn--no${noSelected ? " is-active" : ""}`}
          onClick={() => onChange(false)}
          aria-pressed={noSelected}
        >
          <span className="home1-checkout-same-btn-icon" aria-hidden="true">
            ✕
          </span>
          <span>No</span>
        </button>
      </div>

      {error ? (
        <p className="home1-checkout-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
