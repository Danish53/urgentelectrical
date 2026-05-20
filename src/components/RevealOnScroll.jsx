"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * @param {{
 *   children: React.ReactNode;
 *   as?: keyof JSX.IntrinsicElements;
 *   variant?: "fade-up" | "fade-down" | "fade-in" | "fade-left" | "fade-right" | "scale-up" | "blur-up";
 *   delay?: number;
 *   duration?: number;
 *   once?: boolean;
 *   threshold?: number;
 *   className?: string;
 * }} props
 */
export default function RevealOnScroll({
  children,
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  duration = 750,
  once = true,
  threshold = 0.1,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, once });

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${inView ? "reveal--visible" : ""} ${className}`.trim()}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-duration": `${duration}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
