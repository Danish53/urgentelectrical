"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SECTION_VARIANTS, VIEWPORT, sectionTransition } from "@/lib/motion";

/**
 * @param {{
 *   children: React.ReactNode;
 *   variant?: keyof typeof SECTION_VARIANTS;
 *   delay?: number;
 *   duration?: number;
 *   className?: string;
 * }} props
 */
export default function MotionSection({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 1,
  className = "",
}) {
  const reduceMotion = useReducedMotion();

  const layoutClass = `w-full min-w-0 ${className}`.trim();

  if (reduceMotion) {
    return <div className={layoutClass}>{children}</div>;
  }

  const variants = SECTION_VARIANTS[variant] ?? SECTION_VARIANTS["fade-up"];

  return (
    <motion.div
      className={layoutClass}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants}
      transition={sectionTransition(delay, duration)}
    >
      {children}
    </motion.div>
  );
}
