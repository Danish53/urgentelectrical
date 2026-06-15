"use client";

import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { useWebsiteGeneralData } from "@/hooks/useWebsiteGeneralData";
import { CONTACT_MAP_LINK } from "@/data/contactPage";

export default function ContactDetailsStrip() {
  const { site } = useWebsiteGeneralData();

  const contactStrip = [
    {
      id: "address",
      value: site.address.split(",").pop()?.trim() || site.address,
      label: "Office address",
      detail: site.address,
      href: CONTACT_MAP_LINK,
      external: true,
    },
    {
      id: "email",
      value: "Email us",
      label: "General enquiries",
      detail: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
    {
      id: "phone",
      value: site.contactNumberDisplay,
      label: "Call us now",
      detail: "24/7 emergency line",
      href: `tel:${site.contactNumber}`,
      external: false,
    },
  ];

  return (
    <section className="home1-stats-bar home1-contact-strip overflow-x-clip" aria-label="Contact details">
      <div className={SERVICES_PAGE_CONTAINER}>
        <ul className="home1-contact-strip-grid list-none p-0 m-0">
          {contactStrip.map((item) => (
            <li key={item.id} className="home1-contact-strip-cell min-w-0">
              <Link
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="home1-stats-item home1-contact-strip-item block no-underline text-inherit hover:no-underline"
              >
                <p className="home1-stats-value home1-contact-strip-value">{item.value}</p>
                <p className="home1-stats-label">{item.label}</p>
                {item.detail ? (
                  <p className="home1-contact-strip-detail">{item.detail}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
