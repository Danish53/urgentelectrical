"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICE_RESOURCE_GROUPS } from "@/data/servicesPage";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import { IconArrow } from "@/components/home1/icons";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

function ResourceLink({ item }) {
  return (
    <li>
      <Link
        href={item.href}
        className="group flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl border border-[var(--home1-border)] bg-white hover:border-[rgba(211,35,31,0.35)] hover:shadow-[var(--home1-shadow)] transition-all duration-200"
      >
        <span className="text-[14px] font-semibold text-[var(--home1-text)] group-hover:text-[var(--home1-red)] transition-colors">
          {item.label}
        </span>
        <IconArrow className="w-4 h-4 shrink-0 text-[var(--home1-muted)] group-hover:text-[var(--home1-red)] group-hover:translate-x-0.5 transition-all" />
      </Link>
    </li>
  );
}

export default function ServicesResources() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="services-resources"
      className={`${SECTION_PY} home1-section-surface overflow-x-clip scroll-mt-24`}
      aria-labelledby="services-resources-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="services-resources-heading"
          eyebrow="Resources"
          title="Informative pages & specialist guides"
          description="Deep-dive resources for domestic, commercial, industrial, renewable, and compliance electrical work across Nottinghamshire."
          align="center"
        />

        <motion.div
          className="grid lg:grid-cols-2 gap-6 sm:gap-8"
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
              className="home1-card p-6 sm:p-8 scroll-mt-32"
            >
              <header className="mb-5 pb-5 border-b border-[var(--home1-border)]">
                <h3 className="text-xl font-extrabold text-[var(--home1-text)] mb-2">{group.label}</h3>
                <p className="text-[var(--home1-muted)] text-[14px] leading-relaxed">{group.description}</p>
              </header>
              <ul className="space-y-2 list-none p-0 m-0">
                {group.items.map((item) => (
                  <ResourceLink key={item.slug} item={item} />
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
