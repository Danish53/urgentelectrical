import SectionEyebrow from "./SectionEyebrow";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  compact = false,
  id,
}) {
  const alignClass =
    align === "left" ? "text-left max-w-2xl" : align === "right" ? "text-right ml-auto max-w-2xl mb-3" : "text-center max-w-3xl mx-auto";

  return (
    <header className={`${compact ? "mb-0" : "mb-12 sm:mb-14"} ${alignClass}`}>
      <SectionEyebrow light={light}>{eyebrow}</SectionEyebrow>
      <h2
        id={id}
        className={`text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.15] pb-3 tracking-tight ${
          light ? "text-white" : "text-[var(--home1-text)]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[15px] leading-relaxed ${light ? "text-white/80" : "text-[var(--home1-muted)]"}`}>
          {description}
        </p>
      )}
    </header>
  );
}
