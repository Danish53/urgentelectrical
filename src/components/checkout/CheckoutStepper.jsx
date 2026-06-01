import { CHECKOUT_STEPS } from "@/data/checkoutPage";

function StepCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CheckoutStepper({ currentStep }) {
  const items = [];

  CHECKOUT_STEPS.forEach((step, index) => {
    if (index > 0) {
      const prevDone = CHECKOUT_STEPS[index - 1].id < currentStep;
      items.push(
        <li
          key={`sep-${step.key}`}
          className={`home1-checkout-stepper-sep${prevDone ? " is-done" : ""}`}
          aria-hidden="true"
        />
      );
    }

    const isActive = step.id === currentStep;
    const isDone = step.id < currentStep;

    items.push(
      <li
        key={step.key}
        className={`home1-checkout-stepper-item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
        aria-current={isActive ? "step" : undefined}
      >
        <span className="home1-checkout-stepper-pill">
          <span className="home1-checkout-stepper-num" aria-hidden="true">
            {isDone ? <StepCheckIcon /> : step.id}
          </span>
          <span className="home1-checkout-stepper-label">{step.label}</span>
        </span>
      </li>
    );
  });

  return (
    <nav className="home1-checkout-stepper" aria-label="Checkout progress">
      <ol className="home1-checkout-stepper-track list-none p-0 m-0">{items}</ol>
    </nav>
  );
}
