import { IconBolt } from "./icons";

export default function SectionEyebrow({ children, light = false }) {
  return (
    <span
      className={`home1-eyebrow inline-flex items-center gap-2 mb-4 ${light ? "home1-eyebrow--light" : ""}`}
    >
      <IconBolt className={`w-3.5 h-3.5 shrink-0 ${light ? "text-white" : "text-[var(--home1-red)]"}`} />
      {children}
    </span>
  );
}
