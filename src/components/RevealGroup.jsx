"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * Staggers direct children with class `reveal-item`.
 * @param {{ children: React.ReactNode; staggerMs?: number; className?: string; threshold?: number }} props
 */
export default function RevealGroup({
  children,
  as: Tag = "div",
  staggerMs = 90,
  className = "",
  threshold = 0.08,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, once: true });

  return (
    <Tag
      ref={ref}
      className={`reveal-group ${inView ? "reveal-group--visible" : ""} ${className}`.trim()}
      style={{ "--stagger-step": `${staggerMs}ms` }}
    >
      {children}
    </Tag>
  );
}
