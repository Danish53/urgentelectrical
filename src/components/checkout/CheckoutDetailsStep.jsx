"use client";

const labelClass = "home1-checkout-label";
const inputClass = "home1-checkout-input";

export default function CheckoutDetailsStep({
  details,
  onChange,
  onBack,
  onContinue,
  error,
}) {
  function set(field, value) {
    onChange({ ...details, [field]: value });
  }

  return (
    <div className="home1-checkout-step-panel">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 2 of 3</p>
        <h1 className="home1-checkout-step-title font-playfair">Your details</h1>
        <p className="home1-checkout-step-lead">Tell us who to contact and where the work will take place.</p>
      </header>

      <form
        className="home1-checkout-card home1-checkout-form-card home1-checkout-form"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
        noValidate
      >
        {error ? (
          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor="checkout-first" className={labelClass}>
              First name<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-first"
              value={details.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={inputClass}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-last" className={labelClass}>
              Last name<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-last"
              value={details.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={inputClass}
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkout-email" className={labelClass}>
            Email<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-email"
            type="email"
            value={details.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="checkout-phone" className={labelClass}>
            Phone<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-phone"
            type="tel"
            value={details.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
            autoComplete="tel"
            required
          />
        </div>

        <div>
          <label htmlFor="checkout-address" className={labelClass}>
            Address<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-address"
            value={details.address}
            onChange={(e) => set("address", e.target.value)}
            className={inputClass}
            autoComplete="street-address"
            required
          />
        </div>

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor="checkout-city" className={labelClass}>
              City / town
            </label>
            <input
              id="checkout-city"
              value={details.city}
              onChange={(e) => set("city", e.target.value)}
              className={inputClass}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label htmlFor="checkout-postcode" className={labelClass}>
              Postcode<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-postcode"
              value={details.postcode}
              onChange={(e) => set("postcode", e.target.value.toUpperCase())}
              className={inputClass}
              autoComplete="postal-code"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="checkout-notes" className={labelClass}>
            Notes for the engineer (optional)
          </label>
          <textarea
            id="checkout-notes"
            rows={3}
            value={details.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${inputClass} home1-checkout-textarea`}
          />
        </div>

        <div className="home1-checkout-step-actions">
          <button type="button" onClick={onBack} className="home1-checkout-back-btn">
            ← Back
          </button>
          <button type="submit" className="home1-checkout-continue">
            <span>Continue to payment</span>
            <span className="home1-checkout-continue-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
