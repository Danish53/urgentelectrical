"use client";

/**
 * @param {{
 *   value: boolean,
 *   onChange: (sameAsBilling: boolean) => void,
 * }} props
 */
export default function CheckoutSiteSameToggle({ value, onChange }) {
  return (
    <div className="home1-checkout-same-address">
      <p className="home1-checkout-same-address-label">
        Site address same as billing address?<span className="text-[#d3231f]">*</span>
      </p>
      <div className="home1-checkout-same-address-actions" role="group" aria-label="Site address same as billing">
        <button
          type="button"
          className={`home1-checkout-same-btn home1-checkout-same-btn--yes${value ? " is-active" : ""}`}
          onClick={() => onChange(true)}
          aria-pressed={value}
        >
          <span className="home1-checkout-same-btn-icon" aria-hidden="true">✓</span>
          <span>Yes</span>
        </button>
        <button
          type="button"
          className={`home1-checkout-same-btn home1-checkout-same-btn--no${!value ? " is-active" : ""}`}
          onClick={() => onChange(false)}
          aria-pressed={!value}
        >
          <span className="home1-checkout-same-btn-icon" aria-hidden="true">✕</span>
          <span>No</span>
        </button>
      </div>
    </div>
  );
}
