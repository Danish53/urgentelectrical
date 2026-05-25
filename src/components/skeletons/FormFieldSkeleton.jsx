export default function FormFieldSkeleton({ dark = false, className = "" }) {
  return (
    <div className={`ue-skeleton ${dark ? "ue-skeleton--dark" : ""} h-12 w-full min-h-[48px] ${className}`} aria-hidden="true" />
  );
}
