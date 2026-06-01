"use client";

import Link from "next/link";
import { useServiceCategories } from "@/hooks/useServices";

export default function FooterServicesLinks() {
  const { categories, loading } = useServiceCategories();

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

  if (!categories.length) {
    return (
      <ul className="space-y-2.5">
        <li>
          <Link href="/services" className="text-[#9ca3af] hover:text-white text-sm transition-colors">
            All services
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="space-y-2.5">
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link href={cat.href} className="text-[#9ca3af] hover:text-white text-sm transition-colors">
            {cat.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
