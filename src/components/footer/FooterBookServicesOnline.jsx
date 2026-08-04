"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { FOOTER_BOOK_SERVICES_ONLINE } from "@/data/footer";
import { useBookableServices } from "@/hooks/useServices";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";

const LINK_CLASS =
  "text-[#b0b0b0] text-[14px] hover:text-white transition-colors duration-200 break-words";

/**
 * @param {string} label
 * @param {{ name?: string, slug?: string }[]} bookable
 */
function findServiceForFooterLabel(label, bookable) {
  const list = Array.isArray(bookable) ? bookable : [];
  const normalized = String(label ?? "").toLowerCase();

  if (normalized.includes("emergency")) {
    return list.find(
      (s) =>
        /emergency/i.test(s.slug ?? "") ||
        /emergency/i.test(s.name ?? "") ||
        /24\s*\/?\s*7/i.test(s.name ?? "")
    );
  }
  if (normalized === "eicr" || normalized.includes("eicr")) {
    return list.find((s) => /eicr/i.test(s.slug ?? "") || /eicr/i.test(s.name ?? ""));
  }
  if (normalized.includes("pat")) {
    return list.find(
      (s) => /pat/i.test(s.slug ?? "") || /portable appliance/i.test(s.name ?? "")
    );
  }
  if (normalized.includes("fault")) {
    return list.find(
      (s) => /fault/i.test(s.slug ?? "") || /fault/i.test(s.name ?? "")
    );
  }
  if (normalized.includes("fuse")) {
    return list.find(
      (s) =>
        /fuse|consumer-unit|consumer unit/i.test(s.slug ?? "") ||
        /fuse|consumer unit/i.test(s.name ?? "")
    );
  }
  return null;
}

/**
 * Book Services Online — static labels, hrefs resolved from services API slugs.
 */
export default function FooterBookServicesOnline() {
  const dispatch = useAppDispatch();
  const { bookable, status } = useBookableServices();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
    }
  }, [dispatch, status]);

  const links = useMemo(() => {
    return FOOTER_BOOK_SERVICES_ONLINE.map((item) => {
      if (item.href === "/services") return item;

      const fallbackSlug = String(item.href).replace(/^\/services\//, "");
      const bySlug = bookable.find((s) => s.slug === fallbackSlug);
      if (bySlug?.slug) {
        return {
          ...item,
          href: bySlug.href || `/services/${bySlug.slug}`,
          key: bySlug.slug,
        };
      }

      const matched = findServiceForFooterLabel(item.label, bookable);
      if (matched?.slug) {
        return {
          ...item,
          href: matched.href || `/services/${matched.slug}`,
          key: matched.slug,
        };
      }

      return { ...item, key: item.href };
    });
  }, [bookable]);

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
