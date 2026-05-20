export default function SectionHeader({ eyebrow, title, description, align = "center", light = false, compact = false, id, className = "" }) {
  const alignCls =
    align === "left" ? "text-left" : align === "right" ? "text-right ml-auto" : "text-center mx-auto";

  return (
    <header className={`${compact ? "mb-0" : "mb-10 sm:mb-12"} max-w-3xl ${alignCls} ${className}`}>
      <p className={`home2-eyebrow ${light ? "!text-white before:!bg-white" : ""}`}>{eyebrow}</p>
      <h2 id={id} className={`home2-title ${light ? "!text-white" : ""} ${align === "center" ? "mx-auto" : ""}`}>
        {title}
      </h2>
      {description && (
        <p className={`home2-lead ${align === "center" ? "mx-auto" : ""} ${light ? "!text-white/80" : ""}`}>
          {description}
        </p>
      )}
    </header>
  );
}
