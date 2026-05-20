import { LOCAL_COLUMNS } from "@/data/localElectrician";

const CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const MAROON = "#8B1A1A";

function IconHome() {
  return (
    <svg className="w-[22px] h-[22px] sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="w-[22px] h-[22px] sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.4-2.9 8.4-7 9-4.1-.6-7-4.6-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = { home: IconHome, shield: IconShield };

function HighlightBox({ lead, rest, phone }) {
  const renderRest = () => {
    if (!rest) return null;
    if (!phone) return <span className="font-normal text-[#1a1a1a]">{rest}</span>;
    const parts = rest.split("0115 778 0622");
    return (
      <span className="font-normal text-[#1a1a1a]">
        {parts[0]}
        <a href={`tel:${phone}`} className="font-bold hover:underline" style={{ color: MAROON }}>
          0115 778 0622
        </a>
        {parts[1]}
      </span>
    );
  };

  return (
    <div
      className="mt-7 sm:mt-8 rounded-lg bg-[#f5f5f5] pl-5 pr-5 sm:pl-6 sm:pr-6 py-4 sm:py-[18px] border-l-[5px]"
      style={{ borderLeftColor: MAROON }}
    >
      <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#1a1a1a] m-0">
        <span className="font-bold">{lead}</span> {renderRest()}
      </p>
    </div>
  );
}

function LocalColumn({ column }) {
  const Icon = ICONS[column.icon];

  return (
    <article>
      {/* Header: icon + title, then divider */}
      <div className="flex items-center gap-3.5 sm:gap-4 pb-5 sm:pb-[22px] border-b border-[#e0e0e0] mb-6 sm:mb-7">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg flex items-center justify-center border"
          style={{ backgroundColor: "#fff5f5", borderColor: "#ecd4d4", color: MAROON }}
          aria-hidden="true"
        >
          <Icon />
        </div>
        <h3 className="font-bold text-[#1a1a1a] text-[17px] sm:text-[18px] leading-[1.35] m-0">{column.title}</h3>
      </div>

      {/* Body paragraphs */}
      <div className="space-y-4 text-[#555555] text-[14px] sm:text-[15px] leading-[1.65]">
        {column.paragraphs.map((para) => (
          <p key={para.slice(0, 40)} className="m-0">
            {para}
          </p>
        ))}
      </div>

      <HighlightBox lead={column.highlightLead} rest={column.highlightRest} phone={column.highlightPhone} />
    </article>
  );
}

export default function LocalElectricianSection() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 overflow-x-clip" aria-labelledby="local-electrician-heading">
      <div className={CONTAINER}>
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
