const COPY_ALLOWED_SELECTOR = [
  "input",
  "textarea",
  "select",
  "option",
  '[contenteditable="true"]',
  ".allow-copy",
].join(",");

/** @param {EventTarget | null} target */
export function isCopyAllowedTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(COPY_ALLOWED_SELECTOR));
}

/**
 * Soft copy protection for public marketing content.
 * HTML stays in the DOM for SEO; forms and `.allow-copy` regions stay usable.
 * Right-click / Inspect is allowed — only copy, cut, and text selection are limited.
 * @returns {() => void} cleanup
 */
export function attachCopyProtection() {
  const blockCopy = (event) => {
    if (isCopyAllowedTarget(event.target)) return;
    event.preventDefault();
  };

  const blockSelect = (event) => {
    if (isCopyAllowedTarget(event.target)) return;
    event.preventDefault();
  };

  const blockImageDrag = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.closest(".allow-copy")) return;
    event.preventDefault();
  };

  document.documentElement.classList.add("copy-protected");
  document.addEventListener("copy", blockCopy);
  document.addEventListener("cut", blockCopy);
  document.addEventListener("selectstart", blockSelect);
  document.addEventListener("dragstart", blockImageDrag);

  return () => {
    document.documentElement.classList.remove("copy-protected");
    document.removeEventListener("copy", blockCopy);
    document.removeEventListener("cut", blockCopy);
    document.removeEventListener("selectstart", blockSelect);
    document.removeEventListener("dragstart", blockImageDrag);
  };
}
