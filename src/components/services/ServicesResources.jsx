"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICE_RESOURCE_GROUPS } from "@/data/servicesPage";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import { IconArrow } from "@/components/home1/icons";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

const GROUP_ACCENTS = {
  Domestic: "#2563EB",
  Commercial: "#D3231F",
  Industrial: "#64748B",
  Renewables: "#16A34A",
  "Testing & Safety": "#7C3AED",
};

function ResourceLink({ item }) {
  return (
    <li>
      <Link href={item.href} className="home1-services-resource-link group">
        <span className="line-clamp-2">{item.label}</span>
        <IconArrow className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </Link>
    </li>
  );
}

export default function ServicesResources() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services-resources"
      className={`${SECTION_PY} home1-section-surface overflow-x-clip scroll-mt-28`}
      aria-labelledby="services-resources-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="services-resources-heading"
          eyebrow="Resources"
          title="Informative pages & specialist guides"
          description="Browse guides by category — domestic, commercial, industrial, renewables, and compliance."
          align="center"
        />

        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
          variants={reduceMotion ? undefined : STAGGER_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={STAGGER_VIEWPORT}
        >
          {SERVICE_RESOURCE_GROUPS.map((group) => (
            <motion.article
              key={group.id}
              id={group.id}
              variants={reduceMotion ? undefined : STAGGER_ITEM}
              className="home1-services-resource-card scroll-mt-32"
              style={{ "--group-accent": GROUP_ACCENTS[group.label] ?? "#D3231F" }}
            >
              <header className="home1-services-resource-head">
                <span className="home1-services-resource-icon" aria-hidden="true">
                  {group.label.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-[var(--home1-text)] leading-tight">{group.label}</h3>
                  <p className="text-[var(--home1-muted)] text-[13px] leading-snug mt-1 line-clamp-2">{group.description}</p>
                </div>
              </header>
              <ul className="home1-services-resource-list">
                {group.items.slice(0, 4).map((item) => (
                  <ResourceLink key={item.slug} item={item} />
                ))}
              </ul>
              {group.items.length > 4 && (
                <p className="text-[12px] font-semibold text-[var(--home1-muted)] px-1 pt-1">
                  +{group.items.length - 4} more guides
                </p>
              )}
              <Link href={`#${group.id}`} className="home1-services-resource-more">
                View {group.label.toLowerCase()} resources
                <IconArrow className="w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
