import { CHECKOUT_STEPS } from "@/data/checkoutPage";

export default function CheckoutStepper({ currentStep }) {
  return (
    <nav className="home1-checkout-stepper" aria-label="Checkout progress">
      <ol className="home1-checkout-stepper-list list-none p-0 m-0">
        {CHECKOUT_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <li
              key={step.key}
              className={`home1-checkout-step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
            >
              <span className="home1-checkout-step-circle" aria-hidden="true">
                {isDone ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.id
                )}
              </span>
              <span className="home1-checkout-step-label">{step.label}</span>
              {index < CHECKOUT_STEPS.length - 1 ? (
                <span
                  className={`home1-checkout-step-connector${isDone ? " is-done" : ""}`}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
