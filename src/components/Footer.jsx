import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_SERVICES,
  FOOTER_COMPANY,
  FOOTER_AREAS,
  FOOTER_BADGES,
  FOOTER_LEGAL,
  FOOTER_PHONE,
  FOOTER_PHONE_TEL,
  SOCIAL_LINKS,
} from "@/data/footer";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const RED = "#e63946";
const BG = "#0a0a0a";

function IconPhone() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function SocialIcon({ id }) {
  const className = "w-4 h-4";
  switch (id) {
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

function FooterLinkList({ title, links }) {
  return (
    <div>
      <h3 className="text-[#888888] text-[11px] font-semibold uppercase tracking-[0.14em] mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-[#b0b0b0] text-[14px] hover:text-white transition-colors duration-200">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t-[3px]" style={{ backgroundColor: BG, borderColor: RED }}>
      <div className={`${SECTION_CONTAINER} pt-12 sm:pt-14 pb-8 sm:pb-10`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: RED }}
              >
                <Image src="/logoelec.jfif" alt="" width={44} height={44} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-tight">Urgent Electrical Services</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] mt-0.5" style={{ color: RED }}>
                  24 hr emergency response
                </p>
              </div>
            </div>

            <p className="text-[#999999] text-[14px] leading-relaxed mb-5 max-w-sm">
              NICEIC approved emergency electricians serving Nottingham and the East Midlands since 2014. Fast,
              reliable, and fully insured.
            </p>

            <a
              href={`tel:${FOOTER_PHONE_TEL}`}
              className="inline-flex items-center gap-2.5 text-white text-xl sm:text-2xl font-bold hover:opacity-90 transition-opacity mb-5"
            >
              <span style={{ color: RED }}>
                <IconPhone />
              </span>
              {FOOTER_PHONE}
            </a>

            <div className="flex flex-wrap gap-2 mb-6">
              {FOOTER_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#444444] bg-[#141414] text-[10px] font-bold uppercase tracking-wide text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: RED }} aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-[#555555] flex items-center justify-center text-[#cccccc] hover:border-white hover:text-white transition-colors duration-200"
                >
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkList title="Services" links={FOOTER_SERVICES} />
          <FooterLinkList title="Company" links={FOOTER_COMPANY} />
          <FooterLinkList title="Areas Served" links={FOOTER_AREAS} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          <p className="text-[#666666] text-[11px] sm:text-xs leading-relaxed">
            © 2025 Urgent Electrical Services Limited. All Rights Reserved | Company No: 08956007 | VAT: 208 755 592
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {FOOTER_LEGAL.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#666666] text-[11px] sm:text-xs hover:text-[#999999] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
