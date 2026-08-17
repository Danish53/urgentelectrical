"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FOOTER_SERVICES } from "@/data/footer";
import { useNavMenu } from "@/hooks/useNavMenu";

const LINK_CLASS =
  "text-[#b0b0b0] text-[14px] hover:text-white transition-colors duration-200 break-words";

/**
 * Footer service links — static FOOTER_SERVICES for SSR/raw HTML,
 * replaced by navbar menu groups when the menu API has loaded.
 */
export default function FooterServicesLinks() {
  const { navGroups, loading } = useNavMenu();

  const navLinks = useMemo(() => {
    return navGroups
      .map((group) => {
        const items = Array.isArray(group.items) ? group.items : [];
        if (!items.length) return null;

        const first = items.find((item) => String(item?.slug ?? "").trim()) || null;
        if (!first?.slug) return null;

        return {
          label: group.label,
          href: first.href || `/pages/${first.slug}`,
          key: group.slug || group.label,
        };
      })
      .filter(Boolean);
  }, [navGroups]);

  const links = !loading && navLinks.length > 0 ? navLinks : FOOTER_SERVICES;

  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.key || link.href}>
          <Link href={link.href} className={LINK_CLASS}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
