import { formatMoney } from "@/components/checkout/checkoutUtils";

export default function CheckoutSummary({
  lineItems,
  selectedDate,
  selectedTime,
  postcode,
  incVat = true,
}) {
  const suffix = incVat ? " Inc. VAT" : " Exc. VAT";

  return (
    <aside className="home1-checkout-summary" aria-label="Booking summary">
      <div className="home1-checkout-summary-card">
        <header className="home1-checkout-summary-head">
          <p className="home1-checkout-summary-eyebrow">Your booking</p>
          <h2 className="font-playfair">Booking Summary</h2>
        </header>

        <div className="home1-checkout-summary-body">
          <ul className="home1-checkout-summary-lines list-none p-0 m-0">
            <li>
              <span className="home1-checkout-summary-line-label">{lineItems.service.label}</span>
              <span className="home1-checkout-summary-line-price">
                {formatMoney(incVat ? lineItems.service.amountInc : lineItems.service.amountExc)}
              </span>
            </li>
            <li>
              <span className="home1-checkout-summary-line-label">{lineItems.travel.label}</span>
              <span className="home1-checkout-summary-line-price">
                {formatMoney(incVat ? lineItems.travel.amountInc : lineItems.travel.amountExc)}
              </span>
            </li>
          </ul>

          <div className="home1-checkout-summary-total">
            <span>Total{suffix}</span>
            <strong>{formatMoney(lineItems.totalInc)}</strong>
          </div>

          {(selectedDate || selectedTime || postcode) && (
            <dl className="home1-checkout-summary-meta">
              {postcode ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Postcode</dt>
                  <dd>{postcode}</dd>
                </div>
              ) : null}
              {selectedDate ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Date</dt>
                  <dd>
                    {selectedDate.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              ) : null}
              {selectedTime ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Time</dt>
                  <dd>{selectedTime}</dd>
                </div>
              ) : null}
            </dl>
          )}

          <ul className="home1-checkout-summary-trust list-none p-0 m-0">
            <li>NICEIC approved</li>
            <li>Fixed transparent pricing</li>
            <li>Secure booking</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
