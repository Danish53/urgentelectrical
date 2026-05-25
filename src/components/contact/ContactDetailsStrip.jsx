import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_MAP_LINK,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/data/contactPage";

const CONTACT_STRIP = [
  {
    id: "address",
    value: "NG1 5BQ",
    label: "Office address",
    detail: CONTACT_ADDRESS.full,
    href: CONTACT_MAP_LINK,
    external: true,
  },
  {
    id: "email",
    value: "Email",
    label: "E-mail",
    detail: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
  },
  {
    id: "phone",
    value: CONTACT_PHONE_DISPLAY,
    label: "Phone",
    detail: "Open 24/7",
    href: `tel:${CONTACT_PHONE_TEL}`,
    external: false,
  },
];

export default function ContactDetailsStrip() {
  return (
    <section className="home1-stats-bar home1-contact-strip overflow-x-clip" aria-label="Contact details">
      <div className={SERVICES_PAGE_CONTAINER}>
        <ul className="home1-contact-strip-grid list-none p-0 m-0">
          {CONTACT_STRIP.map((item) => (
            <li key={item.id} className="home1-contact-strip-cell min-w-0">
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="home1-stats-item home1-contact-strip-item block no-underline text-inherit hover:no-underline"
              >
                <p className="home1-stats-value home1-contact-strip-value">{item.value}</p>
                <div className="home1-stats-copy">
                  <h3 className="home1-stats-title">{item.label}</h3>
                  <p className="home1-contact-strip-detail">{item.detail}</p>
                </div>
                <span className="sr-only">
                  {item.label}: {item.detail}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
