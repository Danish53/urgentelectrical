/** @type {[number, number, number, number]} */
export const EASE_SMOOTH = [0.22, 1, 0.36, 1];

export const VIEWPORT = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -40px 0px",
};

export const STAGGER_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -50px 0px",
};

/** @type {Record<string, { hidden: object; visible: object }>} */
export const SECTION_VARIANTS = {
  "fade-up": {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "blur-up": {
    hidden: { opacity: 0, y: 70 },
    visible: { opacity: 1, y: 0 },
  },
};

export function sectionTransition(delay = 0, duration = 1) {
  return { duration, delay, ease: EASE_SMOOTH };
}

export const STAGGER_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

export const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 55, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: EASE_SMOOTH },
  },
};

export const HERO_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.25 },
  },
};

export const HERO_ITEM = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_SMOOTH } },
};

export const HERO_TITLE = {
  hidden: { opacity: 0, y: 55 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: EASE_SMOOTH },
  },
};

export const HERO_FORM = {
  hidden: { opacity: 0, y: 70, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE_SMOOTH },
  },
};
