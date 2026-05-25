const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "Verify" },
  { id: 3, label: "Reset" },
];

export default function AuthStepProgress({ currentStep }) {
  return (
    <nav className="home1-auth-steps" aria-label="Password reset progress">
      <ol className="home1-auth-steps-list list-none p-0 m-0">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isDone = step.id < currentStep;
          return (
            <li
              key={step.id}
              className={`home1-auth-step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
            >
              <span className="home1-auth-step-num" aria-hidden="true">
                {isDone ? "✓" : step.id}
              </span>
              <span className="home1-auth-step-label">{step.label}</span>
              {index < STEPS.length - 1 ? (
                <span className="home1-auth-step-line" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
