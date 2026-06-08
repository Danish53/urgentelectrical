"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FOOTER_LEGAL } from "@/data/footer";
import { fetchPolicies } from "@/services/policyApiService";

/**
 * @param {import("@/services/policyApiService").ApiPolicyItem[]} policies
 * @param {string[]} keywords
 */
function findPolicyHref(policies, keywords) {
  const match = policies.find((policy) => {
    const haystack = `${policy.title} ${policy.slug}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });

  return match ? `/policies/${match.slug}` : "/policies";
}

export default function FooterLegalLinks() {
  const [links, setLinks] = useState(
    FOOTER_LEGAL.map((item) => ({ label: item.label, href: item.fallbackHref }))
  );

  useEffect(() => {
    let cancelled = false;

    fetchPolicies()
      .then((policies) => {
        if (cancelled) return;

        setLinks(
          FOOTER_LEGAL.map((item) => ({
            label: item.label,
            href: findPolicyHref(policies, item.match),
          }))
        );
      })
      .catch(() => {
        if (cancelled) return;
        setLinks(FOOTER_LEGAL.map((item) => ({ label: item.label, href: item.fallbackHref })));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      {links.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="text-[#666666] text-[11px] sm:text-xs hover:text-[#999999] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
