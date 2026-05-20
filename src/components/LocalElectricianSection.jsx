import { LOCAL_COLUMNS } from "@/data/localElectrician";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const RED = "#8B1A1A";
const ICON_BG = "#fff5f5";

function IconHome() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.4-2.9 8.4-7 9-4.1-.6-7-4.6-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = { home: IconHome, shield: IconShield };

function HighlightBox({ text, phone }) {
  const parts = phone ? text.split("0115 778 0622") : [text];

  return (
    <div
      className="mt-6 sm:mt-8 rounded-lg bg-[#f7f7f7] px-5 sm:px-6 py-4 sm:py-5 border-l-[4px]"
      style={{ borderLeftColor: RED }}
    >
      <p className="font-bold text-[#1a1a1a] text-[14px] sm:text-[15px] leading-[1.65]">
        {phone ? (
          <>
            {parts[0]}
            <a href={`tel:${phone}`} className="hover:underline">
              0115 778 0622
            </a>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </p>
    </div>
  );
}

function LocalColumn({ column }) {
  const Icon = ICONS[column.icon];

  return (
    <article>
      <div className="flex items-center gap-4 pb-5 border-b border-[#e0e0e0] mb-6 sm:mb-8">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: ICON_BG, color: RED }}
        >
          <Icon />
        </div>
        <h3 className="font-bold text-[#1a1a1a] text-[17px] sm:text-lg leading-snug">{column.title}</h3>
      </div>

      <div className="space-y-4 text-[#4a4a4a] text-[14px] sm:text-[15px] leading-[1.65]">
        {column.paragraphs.map((para) => (
          <p key={para.slice(0, 40)}>{para}</p>
        ))}
      </div>

      <HighlightBox text={column.highlight} phone={column.highlightPhone} />
    </article>
  );
}

export default function LocalElectricianSection() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20" aria-labelledby="local-electrician-heading">
      <div className={SECTION_CONTAINER}>
        <h2 id="local-electrician-heading" className="sr-only">
          Your local electrician in Nottingham
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          {LOCAL_COLUMNS.map((column) => (
            <LocalColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </section>
  );
}
