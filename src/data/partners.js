/** Flip to true after adding PNGs listed in /public/partners/README.txt */
export const PARTNER_LOGOS_ENABLED = false;

const PARTNER_ENTRIES = [
  { id: "naptha", name: "Naptha Boarding", logoFile: "naptha.png", color: "#c4a574" },
  { id: "muslim-hands", name: "Muslim Hands", logoFile: "muslim-hands.png", color: "#2563eb" },
  { id: "walton-allen", name: "Walton & Allen", logoFile: "walton-allen.png", color: "#1d4ed8" },
  { id: "karimia", name: "Karimia Institute", logoFile: "karimia.png", color: "#ffffff" },
  { id: "national-maintenance", name: "National Maintenance", logoFile: "national-maintenance.png", color: "#334155" },
  { id: "fire-exit", name: "Fire Exit", logoFile: "fire-exit.png", color: "#0a0a0a" },
];

/** @type {{ id: string, name: string, image: string | null, color: string }[]} */
export const PARTNERS = PARTNER_ENTRIES.map(({ logoFile, ...partner }) => ({
  ...partner,
  image: PARTNER_LOGOS_ENABLED ? `/partners/${logoFile}` : null,
}));
