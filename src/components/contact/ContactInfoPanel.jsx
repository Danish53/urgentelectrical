import { IconPhone } from "@/components/home1/icons";
import {
  CONTACT_ADDRESS,
  CONTACT_BUSINESS_HOURS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/data/contactPage";

const CARD =
  "rounded-xl bg-white border border-[#e8eaed] shadow-[0_4px_24px_rgba(17,24,39,0.06)] px-5 py-6 sm:px-6 sm:py-7";

const CARD_TITLE =
  "text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#111827] mb-5 sm:mb-6";

function InfoIcon({ type }) {
  const iconClass = "w-[18px] h-[18px] text-[#d3231f]";
  const wrap = "flex items-center justify-center w-9 h-9 rounded-lg bg-[#ffebee] shrink-0";

  if (type === "phone") {
    return (
      <span className={wrap} aria-hidden="true">
        <IconPhone className={iconClass} />
      </span>
    );
  }
  if (type === "address") {
    return (
      <span className={wrap} aria-hidden="true">
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinecap="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </span>
    );
  }
  return (
    <span className={wrap} aria-hidden="true">
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function InfoCell({ type, label, children }) {
  return (
    <div className="flex gap-3 items-start min-w-0">
      <InfoIcon type={type} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#64748b] mb-1">
          {label}
        </p>
        <div className="text-[14px] sm:text-[15px] font-semibold leading-snug text-[#111827]">{children}</div>
      </div>
    </div>
  );
}

export default function ContactInfoPanel() {
  return (
    <div
      className="flex flex-col gap-5 sm:gap-6 h-full"
      itemScope
      itemType="https://schema.org/LocalBusiness"
      itemID="https://www.urgentelectrical.services/#organization"
    >
      <meta itemProp="name" content="Urgent Electrical Services" />

      <div className={CARD}>
        <h2 className={CARD_TITLE}>Contact information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <InfoCell type="phone" label="Phone">
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="hover:text-[#d3231f] transition-colors break-words"
              itemProp="telephone"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </InfoCell>

          <InfoCell type="address" label="Address">
            <address
              className="not-italic"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <span itemProp="streetAddress">{CONTACT_ADDRESS.streetAddress}</span>
              <br />
              <span itemProp="addressLocality">{CONTACT_ADDRESS.addressLocality}</span>{" "}
              <span itemProp="postalCode">{CONTACT_ADDRESS.postalCode}</span>
            </address>
          </InfoCell>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#eef0f2]">
          <InfoCell type="email" label="E-mail">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all hover:text-[#d3231f] transition-colors"
              itemProp="email"
            >
              {CONTACT_EMAIL}
            </a>
          </InfoCell>
        </div>
      </div>

      <div className={CARD}>
        <h2 className={CARD_TITLE}>Business hours</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-4 list-none p-0 m-0">
          {CONTACT_BUSINESS_HOURS.map((slot) => (
            <li key={slot.label} className="min-w-0 text-center sm:text-left">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#111827] mb-1.5">
                {slot.label}
              </p>
              <p className="text-[14px] font-semibold text-[#64748b]">{slot.hours}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
