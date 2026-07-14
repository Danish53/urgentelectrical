"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useNavMenu } from "@/hooks/useNavMenu";

/**
 * Footer service links from navbar menu groups.
 * Shows group label → routes to first submenu item. Skips groups with no children.
 */
export default function FooterServicesLinks() {
  const { navGroups, loading } = useNavMenu();

  const links = useMemo(() => {
    return navGroups
      .map((group) => {
        const items = Array.isArray(group.items) ? group.items : [];
        if (!items.length) return null;

        const first = items.find((item) => String(item?.slug ?? "").trim()) || null;
        if (!first?.slug) return null;

        return {
          label: group.label,
          href: `/pages/${first.slug}`,
          key: group.slug || group.label,
        };
      })
      .filter(Boolean);
  }, [navGroups]);

  if (loading) {
    return (
      <ul className="space-y-2.5">
        {[1, 2, 3].map((n) => (
          <li key={n}>
            <span className="inline-block h-4 w-24 rounded bg-white/10 animate-pulse" aria-hidden="true" />
          </li>
        ))}
      </ul>
    );
  }

  if (!links.length) {
    return (
      <ul className="space-y-2.5">
        <li>
          <Link href="/services" className="text-[#b0b0b0] text-[14px] hover:text-white transition-colors duration-200">
            All services
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.key}>
          <Link
            href={link.href}
            className="text-[#b0b0b0] text-[14px] hover:text-white transition-colors duration-200"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
