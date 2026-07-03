import { fetchOrderById } from "@/services/ordersApiService";
import { ApiError } from "@/lib/api/errors";
import {
  apiToOrderDetail,
  mergeOrderSummaryIntoApi,
  normalizeInvoiceNumber,
  pickOrderApiId,
} from "@/lib/orders/orderMapper";

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 30;
const CONTENT_W = PAGE_W - MARGIN * 2;
const SECTION_GAP = 14;
const SITE_TO_TABLE_GAP = 8;
const HEADER_HEIGHT_SCALE = 0.88;
const VAT_RATE = 0.2;
const INVOICE_HEADER_SRC = "/Invoice-Header.svg";
const INVOICE_STAMP_SRC = "/stamp.png";
const HEADER_RENDER_SCALE = 3;
const STAMP_RENDER_SCALE = 2;
const STAMP_DRAW_W = 155;

const INVOICE_META = {
  boxW: 250,
  rowH: 28,
  rowCount: 4,
  gutter: 22,
  padX: 14,
  labelFontSize: 9,
  valueFontSize: 10,
  valuePadX: 20,
  titleFontSize: 12,
};

const TOTALS_META = {
  boxW: 268,
  rowH: 30,
  size: 10,
  padX: 14,
  valuePadX: 14,
};

const CUSTOMER_SECTION = {
  headingSize: 11,
  bodySize: 9.5,
  lineGap: 17,
  dividerGap: 4,
  gapAfterDivider: 18,
  addressIndent: 0,
  sectionGap: 24,
};

const TABLE_LAYOUT = {
  headerH: 28,
  rowMinH: 30,
  headerSize: 8,
  cellSize: 9,
  lineH: 12,
  descMinWidth: 150,
  descMaxLines: 2,
  pad: 7,
  colInnerPad: 4,
  colWidthBump: 2,
  afterGap: 18,
};

/** Type1 Helvetica widths (1/1000 em) for accurate right-alignment */
const AFM_HELV = {
  " ": 278, "-": 278, ".": 278, "0": 556, "1": 556, "2": 556, "3": 556, "4": 556,
  "5": 556, "6": 556, "7": 556, "8": 556, "9": 556, A: 667, B: 667, C: 722, D: 722,
  E: 667, F: 611, G: 778, H: 722, I: 278, J: 556, K: 667, L: 611, M: 833, N: 722,
  O: 722, P: 667, Q: 722, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667,
  Y: 667, Z: 611, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556,
  i: 222, j: 222, k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333,
  s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
};

const AFM_HELV_BOLD = {
  " ": 278, "-": 283, ".": 278, "0": 556, "1": 556, "2": 556, "3": 556, "4": 556,
  "5": 556, "6": 556, "7": 556, "8": 556, "9": 556, A: 722, B: 667, C: 722, D: 722,
  E: 667, F: 611, G: 778, H: 722, I: 278, J: 556, K: 722, L: 611, M: 833, N: 722,
  O: 722, P: 667, Q: 722, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667,
  Y: 667, Z: 611, a: 556, b: 611, c: 556, d: 611, e: 556, f: 333, g: 611, h: 611,
  i: 278, j: 278, k: 556, l: 278, m: 889, n: 611, o: 611, p: 611, q: 611, r: 389,
  s: 556, t: 333, u: 611, v: 556, w: 778, x: 556, y: 556, z: 500,
};

const C = {
  red: { r: 227 / 255, g: 30 / 255, b: 36 / 255 },
  dark: { r: 26 / 255, g: 26 / 255, b: 26 / 255 },
  yellow: { r: 249 / 255, g: 212 / 255, b: 102 / 255 },
  green: { r: 0, g: 176 / 255, b: 0 },
  orange: { r: 244 / 255, g: 196 / 255, b: 97 / 255 },
  grey: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
  siteBar: { r: 242 / 255, g: 242 / 255, b: 242 / 255 },
  tableHeaderBar: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  ink: { r: 0.12, g: 0.12, b: 0.12 },
  valueInk: { r: 0.28, g: 0.28, b: 0.28 },
  tableHeader: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
};

function getTotalsStackHeight() {
  return TOTALS_META.rowH * 4;
}

function getInvoiceMetaLayout() {
  const boxX = PAGE_W - MARGIN - INVOICE_META.boxW;
  return {
    boxW: INVOICE_META.boxW,
    boxX,
    customerLineEndX: boxX - INVOICE_META.gutter,
  };
}

function getTotalsLayout() {
  const boxW = TOTALS_META.boxW;
  return {
    boxW,
    boxX: PAGE_W - MARGIN - boxW,
  };
}

/**
 * Shared layout so customer block and invoice meta box share the same top, height, and bottom.
 * @param {string[]} lines
 * @param {number} yTop
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 */
function getCustomerInvoiceSectionLayout(lines, yTop, layout) {
  const {
    headingSize,
    bodySize,
    lineGap,
    dividerGap,
    gapAfterDivider,
    addressIndent,
  } = CUSTOMER_SECTION;
  const headingAscent = headingSize * 0.72;
  const headingBaseline = yTop + headingAscent;
  const dividerY = headingBaseline + headingSize * 0.22 + dividerGap;
  const firstLineBaseline = dividerY + gapAfterDivider;
  const lastLineBaseline = firstLineBaseline + Math.max(0, lines.length - 1) * lineGap;
  const lastLineDescent = bodySize * 0.28;
  const contentBottom = lastLineBaseline + lastLineDescent;
  const metaBoxY = dividerY;
  const metaBoxHeight = INVOICE_META.rowH * INVOICE_META.rowCount;
  const metaBoxBottom = metaBoxY + metaBoxHeight;
  const sectionEndY = Math.max(contentBottom, metaBoxBottom);
  const sectionHeight = sectionEndY - yTop;

  return {
    headingBaseline,
    dividerY,
    firstLineBaseline,
    headingX: MARGIN,
    contentX: MARGIN + addressIndent,
    lineEndX: layout.customerLineEndX,
    metaBoxY,
    metaBoxHeight,
    sectionHeight,
    sectionEndY: yTop + sectionHeight,
  };
}

/** @param {string} text @param {number} size @param {string} [font] */
function measureTextWidth(text, size, font = "F1") {
  const table = font === "F2" ? AFM_HELV_BOLD : AFM_HELV;
  let units = 0;
  for (const ch of sanitizePdfText(String(text))) {
    units += table[ch] ?? (ch === "£" ? 556 : 600);
  }
  return (units / 1000) * size;
}

/** @param {string} text @param {number} size @param {boolean} [bold] */
function estimateTextWidth(text, size, bold = false) {
  return measureTextWidth(text, size, bold ? "F2" : "F1");
}

/**
 * @param {{ left: number, right: number }} col
 * @param {string} text
 * @param {number} size
 * @param {boolean} bold
 */
function fitTextSizeForColumn(text, col, size, bold) {
  const innerPad = TABLE_LAYOUT.colInnerPad;
  const maxW = col.right - col.left - innerPad * 2;
  let fitSize = size;
  while (fitSize > 5.5 && estimateTextWidth(text, fitSize, bold) > maxW) {
    fitSize -= 0.5;
  }
  return fitSize;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {{ left: number, right: number }} col
 * @param {string} text
 * @param {number} yTop
 * @param {{ size?: number, font?: string, color?: { r: number, g: number, b: number } }} [opts]
 */
function drawInColumn(pdf, col, text, yTop, opts = {}) {
  const bold = (opts.font ?? "F1") === "F2";
  const baseSize = opts.size ?? 8;
  const size = fitTextSizeForColumn(text, col, baseSize, bold);
  const innerPad = TABLE_LAYOUT.colInnerPad;
  const textW = estimateTextWidth(text, size, bold);
  const minX = col.left + innerPad;
  const maxX = col.right - innerPad;
  const x = Math.max(minX, maxX - textW);
  pdf.text(text, x, yTop, { ...opts, size });
}

/** @param {number} fromTop */
function yFromTop(fromTop) {
  return PAGE_H - fromTop;
}

function sanitizePdfText(text) {
  return String(text)
    .replace(/[\r\n\t]/g, " ")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\u00B7/g, " | ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}

/** @param {string} text */
function escapePdfText(text) {
  return sanitizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\u00A3/g, "\\243")
    .replace(/[^\x20-\x7E\\]/g, "");
}

/** @param {number} amount */
function formatPdfMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "£0.00";
  return `£${n.toFixed(2)}`;
}

/** @param {unknown} value */
function parseMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** @param {number} amount */
function roundMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

/** @param {string | Date | undefined} value */
function formatShortDate(value) {
  const d =
    value instanceof Date
      ? value
      : value
        ? new Date(String(value).includes("T") ? value : `${value}T12:00:00`)
        : new Date();
  if (Number.isNaN(d.getTime())) return "N/A";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** @param {string | Date | undefined} value */
function formatInvoiceMetaDate(value) {
  const d =
    value instanceof Date
      ? value
      : value
        ? new Date(String(value).includes("T") ? value : `${value}T12:00:00`)
        : new Date();
  if (Number.isNaN(d.getTime())) return "N/A";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/** @param {string} line */
function isPostcodeLine(line) {
  const trimmed = String(line).trim();
  return /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(trimmed) || /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i.test(trimmed);
}

/** @param {string | undefined} isoDate @param {string | undefined} time */
function formatScheduledLabel(isoDate, time) {
  if (!isoDate) return "N/A";
  const date = formatShortDate(isoDate);
  if (!time) return date;
  const cleaned = String(time).replace(/\s/g, " ").replace(/\|/g, "-");
  return `${date} ${cleaned}`;
}

/** @param {Record<string, unknown> | null | undefined} addr */
function pickInvoiceTown(addr) {
  if (!addr || typeof addr !== "object") return "";
  return String(addr.town ?? addr.site_town ?? "").trim();
}

/**
 * @param {Record<string, unknown> | null | undefined} embedded
 * @param {Record<string, unknown>} source
 */
function mergeAddressWithFlatFields(embedded, source) {
  if (!embedded || typeof embedded !== "object") return embedded;
  return {
    ...embedded,
    title: embedded.title ?? source.title,
    first_name: embedded.first_name ?? source.first_name,
    last_name: embedded.last_name ?? source.last_name,
    address_line_1: embedded.address_line_1 ?? source.address_line_1,
    address_line_2: embedded.address_line_2 ?? source.address_line_2,
    town: embedded.town ?? source.town,
    county: embedded.county ?? source.county,
    post_code: embedded.post_code ?? source.post_code,
    site_address_line_1: embedded.site_address_line_1 ?? source.site_address_line_1,
    site_address_line_2: embedded.site_address_line_2 ?? source.site_address_line_2,
    site_town: embedded.site_town ?? source.site_town,
    site_county: embedded.site_county ?? source.site_county,
    site_post_code: embedded.site_post_code ?? source.site_post_code,
  };
}

/**
 * @param {Record<string, unknown> | null} detailBlock
 * @param {Record<string, unknown>} raw
 */
function resolveBillingAddressRecord(detailBlock, raw) {
  const source = detailBlock || raw;
  const embedded =
    (detailBlock?.address && typeof detailBlock.address === "object"
      ? /** @type {Record<string, unknown>} */ (detailBlock.address)
      : null) ||
    (raw.address && typeof raw.address === "object"
      ? /** @type {Record<string, unknown>} */ (raw.address)
      : null);

  if (embedded) {
    return /** @type {Record<string, unknown>} */ (mergeAddressWithFlatFields(embedded, source));
  }

  const hasFlatBilling = [
    source.address_line_1,
    source.address_line_2,
    source.town,
    source.county,
    source.post_code,
    source.first_name,
    source.last_name,
  ].some((value) => String(value ?? "").trim());

  if (!hasFlatBilling) return null;

  return {
    title: source.title,
    first_name: source.first_name,
    last_name: source.last_name,
    address_line_1: source.address_line_1,
    address_line_2: source.address_line_2,
    town: source.town,
    county: source.county,
    post_code: source.post_code,
  };
}

/** @param {Record<string, unknown> | null | undefined} addr @returns {{ text: string, bold?: boolean }[]} */
function formatAddressLines(addr) {
  if (!addr || typeof addr !== "object") return [];
  const title = String(addr.title ?? "").trim();
  const first = String(addr.first_name ?? "").trim();
  const last = String(addr.last_name ?? "").trim();
  const name = [title, first, last].filter(Boolean).join(" ");
  const line1 = String(addr.address_line_1 ?? "").trim();
  const line2 = String(addr.address_line_2 ?? "").trim();
  const town = pickInvoiceTown(addr);
  const postCode = String(addr.post_code ?? "").trim();

  /** @type {{ text: string, bold?: boolean }[]} */
  const lines = [];
  if (name) lines.push({ text: name });
  if (line1) lines.push({ text: line1 });
  if (line2) lines.push({ text: line2 });
  if (town) lines.push({ text: town });
  if (postCode) lines.push({ text: postCode, bold: true });
  return lines;
}

/** Site address block — no customer name; town only (no county). @returns {string[]} */
function formatSiteAddressLines(addr) {
  if (!addr || typeof addr !== "object") return [];
  const line1 = String(addr.address_line_1 ?? addr.site_address_line_1 ?? "").trim();
  const line2 = String(addr.address_line_2 ?? addr.site_address_line_2 ?? "").trim();
  const town = pickInvoiceTown(addr);
  const postCode = String(addr.post_code ?? addr.site_post_code ?? "").trim();

  return [line1, line2, town, postCode].filter(Boolean);
}

/**
 * @param {Record<string, unknown> | null} detailBlock
 * @param {Record<string, unknown>} raw
 * @param {Record<string, unknown> | null} addressRow
 */
function resolveSiteAddressRecord(detailBlock, raw, addressRow) {
  const source = detailBlock || raw;
  const embedded =
    (detailBlock?.site_address && typeof detailBlock.site_address === "object"
      ? /** @type {Record<string, unknown>} */ (detailBlock.site_address)
      : null) ||
    (raw.site_address && typeof raw.site_address === "object"
      ? /** @type {Record<string, unknown>} */ (raw.site_address)
      : null);

  if (embedded) {
    return /** @type {Record<string, unknown>} */ (mergeAddressWithFlatFields(embedded, source));
  }

  const hasFlatSite = [
    source.site_address_line_1,
    source.site_address_line_2,
    source.site_town,
    source.site_county,
    source.site_post_code,
  ].some((value) => String(value ?? "").trim());

  if (hasFlatSite) {
    return {
      site_address_line_1: source.site_address_line_1,
      site_address_line_2: source.site_address_line_2,
      town: source.site_town,
      site_town: source.site_town,
      county: source.site_county,
      site_county: source.site_county,
      site_post_code: source.site_post_code,
      post_code: source.site_post_code,
    };
  }

  return addressRow;
}

/** @param {string} address @param {string | string[]} partsToRemove */
function stripAddressParts(address, partsToRemove) {
  const trimmed = String(address ?? "").trim();
  const removeList = (Array.isArray(partsToRemove) ? partsToRemove : [partsToRemove])
    .map((part) => String(part ?? "").trim())
    .filter(Boolean);
  if (!trimmed || !removeList.length) return trimmed;

  const removeLower = new Set(removeList.map((part) => part.toLowerCase()));
  return trimmed
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !removeLower.has(part.toLowerCase()))
    .join(", ");
}

/** @param {string} text @param {number} maxLen @param {number} [maxLines] */
function wrapText(text, maxLen = 52, maxLines = Infinity) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLen && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  if (Number.isFinite(maxLines) && maxLines > 0 && lines.length > maxLines) {
    return lines.slice(0, maxLines);
  }
  return lines;
}

async function loadRasterImageAsset(src, logicalW, scale) {
  const img = document.createElement("img");
  img.decoding = "async";

  await new Promise((resolve, reject) => {
    img.onload = () => resolve(undefined);
    img.onerror = () => reject(new Error(`Image failed to load: ${src}`));
    img.src = src;
  });

  const sourceW = img.naturalWidth || logicalW;
  const sourceH = img.naturalHeight || logicalW;
  const canvasW = Math.round(logicalW * scale);
  const canvasH = Math.round((sourceH / sourceW) * canvasW);

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, canvasW, canvasH);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
  if (!blob) throw new Error("Image conversion failed.");
  const buffer = await blob.arrayBuffer();
  return { bytes: new Uint8Array(buffer), width: canvasW, height: canvasH };
}

async function loadHeaderAsset() {
  try {
    const header = await loadRasterImageAsset(INVOICE_HEADER_SRC, CONTENT_W, HEADER_RENDER_SCALE);
    return isJpegBytes(header.bytes) ? header : null;
  } catch {
    return null;
  }
}

async function loadStampAsset() {
  try {
    const stamp = await loadRasterImageAsset(INVOICE_STAMP_SRC, STAMP_DRAW_W, STAMP_RENDER_SCALE);
    return isJpegBytes(stamp.bytes) ? stamp : null;
  } catch {
    return null;
  }
}

function encodeLatin1(text) {
  const arr = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) {
    arr[i] = text.charCodeAt(i) & 0xff;
  }
  return arr;
}

/** @param {number} value */
function formatPdfNum(value) {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 10000) / 10000;
  const text = String(rounded);
  return text.includes(".") ? text.replace(/0+$/, "").replace(/\.$/, "") : text;
}

/** @param {Uint8Array} bytes */
function encodeAsciiHexStream(bytes) {
  const hexChars = "0123456789ABCDEF";
  const out = new Uint8Array(bytes.length * 2 + 1);
  let offset = 0;
  for (let i = 0; i < bytes.length; i += 1) {
    out[offset++] = hexChars.charCodeAt(bytes[i] >> 4);
    out[offset++] = hexChars.charCodeAt(bytes[i] & 0x0f);
  }
  out[offset] = 0x3e;
  return out;
}

/** @param {Uint8Array} bytes */
function isJpegBytes(bytes) {
  return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

/** @param {Uint8Array} bytes */
function assertValidPdf(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 64) {
    throw new Error("Generated PDF is empty.");
  }
  if (bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
    throw new Error("Generated PDF is invalid.");
  }
  const tail = bytes.subarray(Math.max(0, bytes.length - 64));
  let hasEof = false;
  for (let i = 0; i < tail.length - 4; i += 1) {
    if (
      tail[i] === 0x25 &&
      tail[i + 1] === 0x25 &&
      tail[i + 2] === 0x45 &&
      tail[i + 3] === 0x4f &&
      tail[i + 4] === 0x46
    ) {
      hasEof = true;
      break;
    }
  }
  if (!hasEof) {
    throw new Error("Generated PDF is incomplete.");
  }
}

/**
 * @param {Uint8Array} pdfBytes
 * @param {string} filename
 */
function triggerPdfDownload(pdfBytes, filename) {
  const bytes = new Uint8Array(pdfBytes);
  assertValidPdf(bytes);
  const blob = new Blob([bytes], { type: "application/pdf" });

  const legacySave = /** @type {Navigator & { msSaveOrOpenBlob?: (b: Blob, name: string) => boolean }} */ (
    window.navigator
  ).msSaveOrOpenBlob;
  if (typeof legacySave === "function") {
    legacySave.call(window.navigator, blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.type = "application/pdf";
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(url);
  }, 120_000);
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

class InvoicePdfWriter {
  constructor() {
    /** @type {string[]} */
    this.ops = [];
  }

  fillColor(color) {
    this.ops.push(`${formatPdfNum(color.r)} ${formatPdfNum(color.g)} ${formatPdfNum(color.b)} rg`);
  }

  strokeColor(color) {
    this.ops.push(`${formatPdfNum(color.r)} ${formatPdfNum(color.g)} ${formatPdfNum(color.b)} RG`);
  }

  lineWidth(w) {
    this.ops.push(`${formatPdfNum(w)} w`);
  }

  fillRectTop(x, yTop, w, h) {
    this.ops.push(
      `${formatPdfNum(x)} ${formatPdfNum(yFromTop(yTop + h))} ${formatPdfNum(w)} ${formatPdfNum(h)} re f`
    );
  }

  strokeRectTop(x, yTop, w, h) {
    this.ops.push(
      `${formatPdfNum(x)} ${formatPdfNum(yFromTop(yTop + h))} ${formatPdfNum(w)} ${formatPdfNum(h)} re S`
    );
  }

  lineTop(x1, yTop1, x2, yTop2) {
    this.ops.push(
      `${formatPdfNum(x1)} ${formatPdfNum(yFromTop(yTop1))} m ${formatPdfNum(x2)} ${formatPdfNum(yFromTop(yTop2))} l S`
    );
  }

  /** @param {Array<[number, number]>} pointsTop */
  fillPolygonTop(pointsTop) {
    if (pointsTop.length < 3) return;
    const [first, ...rest] = pointsTop;
    this.ops.push(`${formatPdfNum(first[0])} ${formatPdfNum(yFromTop(first[1]))} m`);
    for (const [x, yTop] of rest) {
      this.ops.push(`${formatPdfNum(x)} ${formatPdfNum(yFromTop(yTop))} l`);
    }
    this.ops.push("h f");
  }

  drawImage(name, drawW, drawH, x, yTop) {
    const y = yFromTop(yTop + drawH);
    this.ops.push("q");
    this.ops.push(`${formatPdfNum(drawW)} 0 0 ${formatPdfNum(drawH)} ${formatPdfNum(x)} ${formatPdfNum(y)} cm`);
    this.ops.push(`/${name} Do`);
    this.ops.push("Q");
  }

  text(text, x, yTop, opts = {}) {
    const font = opts.font ?? "F1";
    const size = opts.size ?? 10;
    const color = opts.color ?? C.ink;
    this.ops.push("BT");
    this.fillColor(color);
    this.ops.push(`/${font} ${formatPdfNum(size)} Tf`);
    this.ops.push(
      `1 0 0 1 ${formatPdfNum(x)} ${formatPdfNum(yFromTop(yTop))} Tm (${escapePdfText(text)}) Tj`
    );
    this.ops.push("ET");
  }

  /** Right edge of text lands on rightX (top-origin coordinates). */
  textRight(text, rightX, yTop, opts = {}) {
    const size = opts.size ?? 8;
    const font = opts.font ?? "F1";
    const safe = sanitizePdfText(String(text));
    const width = measureTextWidth(safe, size, font);
    this.text(safe, rightX - width, yTop, { ...opts, size, font });
  }

  /** @param {number} cx @param {number} cyTop @param {number} r */
  circleTop(cx, cyTop, r, fill = true) {
    this.circle(cx, PAGE_H - cyTop, r, fill);
  }

  /** Circle in PDF bottom-left coordinates */
  circle(cx, cyBottom, r, fill = true) {
    const k = r * 0.5523;
    this.ops.push(`${formatPdfNum(cx + r)} ${formatPdfNum(cyBottom)} m`);
    this.ops.push(
      `${formatPdfNum(cx + r)} ${formatPdfNum(cyBottom + k)} ${formatPdfNum(cx + k)} ${formatPdfNum(cyBottom + r)} ${formatPdfNum(cx)} ${formatPdfNum(cyBottom + r)} c`
    );
    this.ops.push(
      `${formatPdfNum(cx - k)} ${formatPdfNum(cyBottom + r)} ${formatPdfNum(cx - r)} ${formatPdfNum(cyBottom + k)} ${formatPdfNum(cx - r)} ${formatPdfNum(cyBottom)} c`
    );
    this.ops.push(
      `${formatPdfNum(cx - k)} ${formatPdfNum(cyBottom - r)} ${formatPdfNum(cx - r)} ${formatPdfNum(cyBottom - k)} ${formatPdfNum(cx)} ${formatPdfNum(cyBottom - r)} c`
    );
    this.ops.push(
      `${formatPdfNum(cx + k)} ${formatPdfNum(cyBottom - r)} ${formatPdfNum(cx + r)} ${formatPdfNum(cyBottom - k)} ${formatPdfNum(cx + r)} ${formatPdfNum(cyBottom)} c`
    );
    this.ops.push(fill ? "f" : "S");
  }
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {{ bytes: Uint8Array, width: number, height: number } | null} header
 */
function drawBrandHeader(pdf, header) {
  const x = MARGIN;
  const yTop = MARGIN;
  if (!header) return yTop;

  const drawW = CONTENT_W;
  const naturalH = (header.height / header.width) * drawW;
  const drawH = naturalH * HEADER_HEIGHT_SCALE;
  pdf.drawImage("Header", drawW, drawH, x, yTop);
  return yTop + drawH;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} x
 * @param {number} yTop
 * @param {number} w
 * @param {number} h
 * @param {{ r: number, g: number, b: number }} bg
 * @param {string} left
 * @param {string} right
 * @param {{ leftBold?: boolean, rightBold?: boolean, textColor?: { r: number, g: number, b: number }, valueColor?: { r: number, g: number, b: number }, rightX?: number, padX?: number, valuePadX?: number, size?: number, rightSize?: number, leftLines?: string[] }} [opts]
 */
function drawMetaRow(pdf, x, yTop, w, h, bg, left, right, opts = {}) {
  pdf.fillColor(bg);
  pdf.fillRectTop(x, yTop, w, h);
  const padX = opts.padX ?? INVOICE_META.padX;
  const valuePadX = opts.valuePadX ?? INVOICE_META.valuePadX;
  const leftSize = opts.size ?? INVOICE_META.labelFontSize;
  const rightSize = opts.rightSize ?? INVOICE_META.valueFontSize;
  const rowSize = Math.max(leftSize, rightSize);
  const textY = yTop + (h + rowSize * 0.32) / 2;
  const leftFont = opts.leftBold ? "F2" : "F1";
  const rightFont = opts.rightBold ? "F2" : "F1";
  const labelColor = opts.textColor ?? C.black;
  const valueColor = opts.valueColor ?? C.valueInk;
  const valueRightX = opts.valueRightX ?? x + w - valuePadX;
  const leftLines = opts.leftLines;
  let valueY = textY;

  if (leftLines?.length) {
    const lineGap = leftSize + 1.5;
    const stackH = leftLines.length * lineGap - 1.5;
    const startY = yTop + (h - stackH) / 2 + leftSize * 0.72;
    valueY = startY + (stackH - leftSize * 0.28) / 2;
    leftLines.forEach((line, index) => {
      pdf.text(line, x + padX, startY + index * lineGap, { font: leftFont, size: leftSize, color: labelColor });
    });
  } else {
    pdf.text(left, x + padX, textY, { font: leftFont, size: leftSize, color: labelColor });
  }

  const rightText = sanitizePdfText(String(right ?? ""));
  const labelEndX = x + padX + measureTextWidth(left, leftSize, leftFont);
  const maxValueW = Math.max(24, valueRightX - labelEndX - 4);
  let fitRightSize = rightSize;
  while (fitRightSize > 7.5 && measureTextWidth(rightText, fitRightSize, rightFont) > maxValueW) {
    fitRightSize -= 0.25;
  }

  pdf.textRight(rightText, valueRightX, valueY, {
    font: rightFont,
    size: fitRightSize,
    color: valueColor,
  });
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>} ctx
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 * @param {number} sectionHeight
 */
function drawInvoiceMetaStack(pdf, metaBoxY, ctx, layout) {
  const { boxW, boxX } = layout;
  const rowH = INVOICE_META.rowH;
  const padX = INVOICE_META.padX;
  const labelSize = INVOICE_META.labelFontSize;
  const valueSize = INVOICE_META.valueFontSize;
  const valueRightX = boxX + boxW - INVOICE_META.valuePadX;
  const rowTextY = (yTop, size) => yTop + (rowH + size * 0.32) / 2;
  const metaOpts = {
    leftBold: false,
    rightBold: false,
    size: valueSize,
    rightSize: valueSize,
    padX,
    valueRightX,
    valueColor: C.black,
  };

  pdf.fillColor(C.red);
  pdf.fillRectTop(boxX, metaBoxY, boxW, rowH);
  pdf.text("INVOICE", boxX + padX, rowTextY(metaBoxY, INVOICE_META.titleFontSize), {
    font: "F2",
    size: INVOICE_META.titleFontSize,
    color: C.white,
  });

  drawMetaRow(
    pdf,
    boxX,
    metaBoxY + rowH,
    boxW,
    rowH,
    C.yellow,
    "INVOICE NUMBER:",
    String(ctx.invoiceNumber ?? "").toUpperCase(),
    metaOpts
  );
  drawMetaRow(
    pdf,
    boxX,
    metaBoxY + rowH * 2,
    boxW,
    rowH,
    C.grey,
    "INVOICE DATE:",
    ctx.invoiceDate,
    metaOpts
  );
  drawMetaRow(
    pdf,
    boxX,
    metaBoxY + rowH * 3,
    boxW,
    rowH,
    C.green,
    "SCHEDULED:",
    ctx.scheduledLabel,
    metaOpts
  );

  return metaBoxY + INVOICE_META.rowH * INVOICE_META.rowCount;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {{ text: string, bold?: boolean }[]} lines
 * @param {ReturnType<typeof getCustomerInvoiceSectionLayout>} sectionLayout
 */
function drawCustomerDetails(pdf, yTop, lines, sectionLayout) {
  const { headingSize, bodySize, lineGap } = CUSTOMER_SECTION;
  const {
    headingBaseline,
    dividerY,
    firstLineBaseline,
    headingX,
    contentX,
    lineEndX,
    sectionEndY,
  } = sectionLayout;

  pdf.text("CUSTOMER DETAILS", headingX, headingBaseline, {
    font: "F2",
    size: headingSize,
    color: C.black,
  });
  pdf.lineWidth(0.75);
  pdf.strokeColor(C.black);
  pdf.lineTop(headingX, dividerY, lineEndX, dividerY);

  let lineBaseline = firstLineBaseline;
  lines.forEach((line) => {
    pdf.text(line.text, contentX, lineBaseline, {
      font: line.bold ? "F2" : "F1",
      size: bodySize,
      color: C.ink,
    });
    lineBaseline += lineGap;
  });

  return { endY: sectionEndY, dividerY };
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {string} address
 */
function drawSiteAddress(pdf, yTop, address) {
  const padX = 10;
  const padY = 10;
  const headingSize = CUSTOMER_SECTION.headingSize;
  const addressSize = CUSTOMER_SECTION.bodySize;
  const headingGap = 14;
  const lineGap = CUSTOMER_SECTION.lineGap;
  const headingAscent = headingSize * 0.72;
  const addressDescent = addressSize * 0.28;

  const addressLines = wrapText(address || "", 88).filter(Boolean);
  const lines = addressLines.length ? addressLines : [""];
  const headingBaseline = yTop + padY + headingAscent;
  const lastLineBaseline = headingBaseline + headingGap + (lines.length - 1) * lineGap;
  const boxH = lastLineBaseline - yTop + addressDescent + padY;

  pdf.fillColor(C.siteBar);
  pdf.fillRectTop(MARGIN, yTop, CONTENT_W, boxH);

  pdf.text("Site Address", MARGIN + padX, headingBaseline, {
    font: "F2",
    size: headingSize,
    color: C.black,
  });

  let lineBaseline = headingBaseline + headingGap;
  for (const line of lines) {
    if (line) {
      pdf.text(line, MARGIN + padX, lineBaseline, { font: "F1", size: addressSize, color: C.black });
    }
    lineBaseline += lineGap;
  }

  return yTop + boxH + SITE_TO_TABLE_GAP;
}

/**
 * @param {string} header
 * @param {string} sample
 * @param {number} headerSize
 * @param {number} cellSize
 */
function getMinTableColumnWidth(header, sample, headerSize, cellSize) {
  const innerPad = TABLE_LAYOUT.colInnerPad;
  const headerW = measureTextWidth(header, headerSize, "F2");
  const sampleW = measureTextWidth(sample, cellSize, "F1");
  return Math.ceil(Math.max(headerW, sampleW) + innerPad * 2 + TABLE_LAYOUT.colWidthBump);
}

/**
 * @param {number} tableX
 * @param {number} tableW
 */
function getTableColumns(tableX, tableW) {
  const pad = TABLE_LAYOUT.pad;
  const { headerSize, cellSize, descMinWidth } = TABLE_LAYOUT;
  const moneySample = formatPdfMoney(9999.99);
  const colW = {
    qty: getMinTableColumnWidth("QTY", "99", headerSize, cellSize),
    unit: getMinTableColumnWidth("UNIT COST", moneySample, headerSize, cellSize),
    amount: getMinTableColumnWidth("AMOUNT", moneySample, headerSize, cellSize),
    vatRate: getMinTableColumnWidth("VAT RATE", "20%", headerSize, cellSize),
    vatAmt: getMinTableColumnWidth("VAT AMOUNT", moneySample, headerSize, cellSize),
    total: getMinTableColumnWidth("TOTAL", moneySample, headerSize, cellSize),
  };
  const numericTotal = Object.values(colW).reduce((sum, width) => sum + width, 0);
  const descW = Math.max(descMinWidth, tableW - pad * 2 - numericTotal);

  /** @type {Record<string, { left: number, right: number, width: number }>} */
  const cols = {};
  let edge = tableX + tableW - pad;

  for (const key of ["total", "vatAmt", "vatRate", "amount", "unit", "qty"]) {
    const width = colW[key];
    cols[key] = { right: edge, left: edge - width, width };
    edge -= width;
  }

  return { pad, cols, descX: tableX + pad, descMaxW: descW - pad };
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {{ left: number, right: number }} col
 * @param {string} text
 * @param {number} blockTop
 * @param {number} blockH
 * @param {{ size?: number, font?: string, color?: { r: number, g: number, b: number } }} [opts]
 */
function drawColumnHeader(pdf, col, text, blockTop, blockH, opts = {}) {
  const size = opts.size ?? TABLE_LAYOUT.headerSize;
  const headerTextY = blockTop + (blockH + size * 0.32) / 2;
  drawInColumn(pdf, col, text, headerTextY, { ...opts, size, font: opts.font ?? "F2" });
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["tableRows"]} rows
 */
function drawServiceTable(pdf, yTop, rows) {
  const tableX = MARGIN;
  const tableW = CONTENT_W;
  const { headerH, rowMinH, headerSize, cellSize, lineH, afterGap, descMaxLines } = TABLE_LAYOUT;
  const { cols, descX, descMaxW } = getTableColumns(tableX, tableW);
  const descMaxChars = Math.max(24, Math.floor(descMaxW / (cellSize * 0.5)));
  const cellOpts = { font: "F1", size: cellSize, color: C.black };
  const headerOpts = { font: "F2", size: headerSize, color: C.black };

  pdf.fillColor(C.tableHeaderBar);
  pdf.fillRectTop(tableX, yTop, tableW, headerH);
  const headerTextY = yTop + (headerH + headerSize * 0.32) / 2;

  pdf.text("DESCRIPTION", descX, headerTextY, headerOpts);
  drawColumnHeader(pdf, cols.qty, "QTY", yTop, headerH, headerOpts);
  drawColumnHeader(pdf, cols.unit, "UNIT COST", yTop, headerH, headerOpts);
  drawColumnHeader(pdf, cols.amount, "AMOUNT", yTop, headerH, headerOpts);
  drawColumnHeader(pdf, cols.vatRate, "VAT RATE", yTop, headerH, headerOpts);
  drawColumnHeader(pdf, cols.vatAmt, "VAT AMOUNT", yTop, headerH, headerOpts);
  drawColumnHeader(pdf, cols.total, "TOTAL", yTop, headerH, headerOpts);

  let y = yTop + headerH;
  rows.forEach((row) => {
    const descLines = wrapText(row.description, descMaxChars, descMaxLines);
    const rowH = Math.max(rowMinH, 14 + descLines.length * lineH);

    pdf.fillColor(C.white);
    pdf.fillRectTop(tableX, y, tableW, rowH);

    const descStartY = y + (rowH - (descLines.length * lineH - 2)) / 2 + cellSize * 0.72;
    descLines.forEach((line, index) => {
      pdf.text(line, descX, descStartY + index * lineH, cellOpts);
    });

    const numY = y + (rowH + cellSize * 0.32) / 2;
    drawInColumn(pdf, cols.qty, String(row.qty), numY, cellOpts);
    drawInColumn(pdf, cols.unit, formatPdfMoney(row.unitCost), numY, cellOpts);
    drawInColumn(pdf, cols.amount, formatPdfMoney(row.amount), numY, cellOpts);
    drawInColumn(pdf, cols.vatRate, row.vatRateLabel, numY, cellOpts);
    drawInColumn(pdf, cols.vatAmt, formatPdfMoney(row.vatAmount), numY, cellOpts);
    drawInColumn(pdf, cols.total, formatPdfMoney(row.total), numY, cellOpts);

    y += rowH;
  });

  pdf.lineWidth(0.75);
  pdf.strokeColor(C.black);
  pdf.lineTop(tableX, y, tableX + tableW, y);

  return y + afterGap;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["totals"]} totals
 */
function drawTotalsStack(pdf, yTop, totals) {
  const { boxW, boxX } = getTotalsLayout();
  const { rowH, size, padX, valuePadX } = TOTALS_META;
  const valueRightX = boxX + boxW - valuePadX;
  const rowOpts = {
    leftBold: true,
    rightBold: true,
    size,
    rightSize: size,
    padX,
    valueRightX,
    textColor: C.black,
    valueColor: C.black,
  };

  drawMetaRow(pdf, boxX, yTop, boxW, rowH, C.siteBar, "Amount", formatPdfMoney(totals.amount), rowOpts);
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH,
    boxW,
    rowH,
    C.green,
    "Discount",
    formatPdfMoney(totals.discount),
    rowOpts
  );
  drawMetaRow(pdf, boxX, yTop + rowH * 2, boxW, rowH, C.yellow, "VAT", formatPdfMoney(totals.vat), rowOpts);
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH * 3,
    boxW,
    rowH,
    C.orange,
    "Amount Including VAT",
    formatPdfMoney(totals.totalIncVat),
    rowOpts
  );

  return yTop + getTotalsStackHeight();
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {{ bytes: Uint8Array, width: number, height: number } | null} stamp
 * @param {number} yTop
 */
function drawPaidStamp(pdf, stamp, yTop) {
  if (!stamp) return;

  const stampDrawW = STAMP_DRAW_W;
  const stampDrawH = (stamp.height / stamp.width) * stampDrawW;
  const totalsH = getTotalsStackHeight();
  const stampX = MARGIN + 4;
  const stampY = yTop + (totalsH - stampDrawH) / 2;

  pdf.drawImage("Stamp", stampDrawW, stampDrawH, stampX, stampY);
}

function buildInvoiceLineRow(description, qty, unitCostExVat) {
  const safeQty = qty > 0 ? qty : 1;
  const unitCost = roundMoney(unitCostExVat);
  const amount = roundMoney(unitCost * safeQty);
  const vatAmount = roundMoney(amount * VAT_RATE);
  const total = roundMoney(amount + vatAmount);

  return {
    description,
    qty: safeQty,
    unitCost,
    amount,
    vatRateLabel: "20%",
    vatAmount,
    total,
  };
}

function buildInvoiceTotals(order, raw, tableAmountExVat) {
  const discount = roundMoney(
    parseMoney(order.discount) || parseMoney(raw.discount_amount) || parseMoney(raw.discount)
  );

  let amountExVat = roundMoney(tableAmountExVat);
  if (amountExVat <= 0) {
    const serviceSubTotal = roundMoney(
      parseMoney(order.serviceSubTotal) ||
        parseMoney(raw.totalSubtotal) ||
        parseMoney(raw.total_subtotal) ||
        parseMoney(raw.sub_total)
    );
    const deliveryFee = roundMoney(parseMoney(order.deliveryFee) || parseMoney(raw.delivery_fee));
    amountExVat = roundMoney(serviceSubTotal + deliveryFee);
  }

  const netExVat = roundMoney(Math.max(0, amountExVat - discount));
  const vat = roundMoney(netExVat * VAT_RATE);
  const totalIncVat = roundMoney(netExVat + vat);

  return {
    amount: amountExVat,
    discount,
    vat,
    totalIncVat,
  };
}

function buildInvoiceContextFromDetail(order) {
  const raw =
    order.raw && typeof order.raw === "object"
      ? /** @type {Record<string, unknown>} */ (order.raw)
      : {};

  const detailBlock =
    raw.order_detail && typeof raw.order_detail === "object"
      ? /** @type {Record<string, unknown>} */ (raw.order_detail)
      : null;

  const addressRow = resolveBillingAddressRecord(detailBlock, raw);

  const invoiceNumber =
    normalizeInvoiceNumber({ ...raw, order_detail: detailBlock ?? raw.order_detail }) ||
    String(order.invoiceNumber ?? "").trim();
  const serviceName = order.serviceName || "Electrical service";
  const invoiceDate = formatShortDate(order.bookedAt || raw.created_at);
  const scheduledLabel = formatScheduledLabel(order.visitDate, order.visitTime);
  const addressLines = formatAddressLines(addressRow);
  const customerName = String(order.customerName ?? "").trim();
  const customerLines = addressLines.length
    ? addressLines
    : customerName
      ? [{ text: customerName }]
      : [{ text: "Customer" }];

  const siteRow = resolveSiteAddressRecord(detailBlock, raw, addressRow);

  const siteLineParts = formatSiteAddressLines(siteRow);
  const addressPartsToStrip = [
    addressRow?.county,
    addressRow?.site_county,
    siteRow?.county,
    siteRow?.site_county,
    detailBlock?.county,
    detailBlock?.site_county,
    raw.county,
    raw.site_county,
    addressRow?.country,
    siteRow?.country,
    detailBlock?.country,
    detailBlock?.site_country,
    raw.country,
    raw.site_country,
    "United Kingdom",
    "GB",
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
  const siteAddress = siteLineParts.length
    ? siteLineParts.join(", ")
    : stripAddressParts(order.address?.trim(), addressPartsToStrip) ||
      addressLines
        .slice(1)
        .map((line) => line.text)
        .join(", ");

  const qty = parseMoney(detailBlock?.quantity) || 1;
  const variant =
    detailBlock?.service_varient && typeof detailBlock.service_varient === "object"
      ? /** @type {Record<string, unknown>} */ (detailBlock.service_varient)
      : detailBlock?.service_variant && typeof detailBlock.service_variant === "object"
        ? /** @type {Record<string, unknown>} */ (detailBlock.service_variant)
        : null;

  const unitCostExVat =
    parseMoney(variant?.variant_price) ||
    (parseMoney(order.serviceSubTotal) > 0
      ? parseMoney(order.serviceSubTotal) / qty
      : parseMoney(detailBlock?.total) > 0
        ? parseMoney(detailBlock?.total) / qty
        : 0);

  const travelUnitExVat = roundMoney(parseMoney(order.deliveryFee) || parseMoney(raw.delivery_fee));

  /** @type {Array<{ description: string, qty: number, unitCost: number, amount: number, vatRateLabel: string, vatAmount: number, total: number }>} */
  const tableRows = [
    buildInvoiceLineRow(serviceName, qty, unitCostExVat),
    buildInvoiceLineRow("Travel Charge (No Charge Within 20 Miles)", 1, travelUnitExVat),
  ];

  const tableAmountExVat = roundMoney(tableRows.reduce((sum, row) => sum + row.amount, 0));
  const totals = buildInvoiceTotals(order, raw, tableAmountExVat);

  return {
    invoiceNumber,
    invoiceDate,
    scheduledLabel,
    customerLines,
    siteAddress,
    tableRows,
    totals,
    showPaidStamp: true,
  };
}

function renderInvoicePage(pdf, header, stamp, ctx) {
  const headerBottom = drawBrandHeader(pdf, header);
  const customerGap = CUSTOMER_SECTION.sectionGap;
  const sectionY = headerBottom + customerGap;
  const layout = getInvoiceMetaLayout();
  const sectionLayout = getCustomerInvoiceSectionLayout(ctx.customerLines, sectionY, layout);

  drawCustomerDetails(pdf, sectionY, ctx.customerLines, sectionLayout);
  drawInvoiceMetaStack(pdf, sectionLayout.metaBoxY, ctx, layout);

  const siteY = sectionLayout.sectionEndY + customerGap;
  const tableY = drawSiteAddress(pdf, siteY, ctx.siteAddress);
  const afterTableY = drawServiceTable(pdf, tableY, ctx.tableRows);

  const totalsY = afterTableY + 24;
  drawTotalsStack(pdf, totalsY, ctx.totals);

  if (ctx.showPaidStamp) {
    drawPaidStamp(pdf, stamp, totalsY);
  }
}

function assemblePdfDocument(stream, assets) {
  const { header, stamp } = assets;
  const objects = [];

  function addObject(parts) {
    objects.push({ id: objects.length + 1, parts });
    return objects.length;
  }

  const fontRegularId = addObject([
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ]);
  const fontBoldId = addObject([
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ]);

  let headerId = 0;
  if (header && isJpegBytes(header.bytes)) {
    const hexStream = encodeAsciiHexStream(header.bytes);
    headerId = addObject([
      `<< /Type /XObject /Subtype /Image /Width ${header.width} /Height ${header.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${hexStream.length} >>\nstream\n`,
      hexStream,
      "\nendstream",
    ]);
  }

  let stampId = 0;
  if (stamp && isJpegBytes(stamp.bytes)) {
    const hexStream = encodeAsciiHexStream(stamp.bytes);
    stampId = addObject([
      `<< /Type /XObject /Subtype /Image /Width ${stamp.width} /Height ${stamp.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${hexStream.length} >>\nstream\n`,
      hexStream,
      "\nendstream",
    ]);
  }

  const streamBytes = encodeLatin1(stream);
  const contentId = addObject([`<< /Length ${streamBytes.length} >>\nstream\n`, streamBytes, "\nendstream"]);

  const xObjectEntries = [];
  if (headerId) xObjectEntries.push(`/Header ${headerId} 0 R`);
  if (stampId) xObjectEntries.push(`/Stamp ${stampId} 0 R`);
  const xObjectPart = xObjectEntries.length ? `/XObject << ${xObjectEntries.join(" ")} >>` : "";
  const procSetPart =
    headerId || stampId ? "/ProcSet [/PDF /Text /ImageC]" : "/ProcSet [/PDF /Text]";
  const pageId = addObject([
    `<< /Type /Page /Parent PAGES_ID /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> ${xObjectPart} ${procSetPart} >> >>`,
  ]);

  const pagesId = addObject([`<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`]);
  const catalogId = addObject([`<< /Type /Catalog /Pages ${pagesId} 0 R >>`]);

  const chunks = [encodeLatin1("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")];
  const offsets = [0];

  for (const obj of objects) {
    offsets.push(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
    chunks.push(encodeLatin1(`${obj.id} 0 obj\n`));
    for (const part of obj.parts) {
      if (typeof part === "string") {
        chunks.push(encodeLatin1(part.replace(/PAGES_ID/g, String(pagesId))));
      } else {
        chunks.push(part);
      }
    }
    chunks.push(encodeLatin1("\nendobj\n"));
  }

  const xrefStart = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  chunks.push(encodeLatin1(xref));
  chunks.push(
    encodeLatin1(
      `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
    )
  );

  return concatBytes(chunks);
}

async function buildProfessionalInvoicePdf(order) {
  const [header, stamp] = await Promise.all([loadHeaderAsset(), loadStampAsset()]);
  const ctx = buildInvoiceContextFromDetail(order);
  const writer = new InvoicePdfWriter();
  renderInvoicePage(writer, header, stamp, ctx);
  return assemblePdfDocument(`${writer.ops.join("\n")}\n`, { header, stamp });
}

async function loadOrderForInvoice(order) {
  const fetchId = pickOrderApiId(order);
  if (!fetchId) {
    throw new Error("This order cannot be invoiced (missing ID).");
  }

  const merged = mergeOrderSummaryIntoApi(order);

  try {
    return await fetchOrderById(fetchId);
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 0;
    const message = String(err?.message ?? "");
    const missingOrder =
      status === 404 ||
      message.includes("No query results") ||
      message.toLowerCase().includes("order not found");

    if (!missingOrder) throw err;
    return apiToOrderDetail(merged);
  }
}

export async function downloadOrderInvoicePdf(order) {
  if (!order?.id && !order?.reference) {
    throw new Error("This order cannot be invoiced.");
  }

  const detail = await loadOrderForInvoice(order);
  const pdfBytes = await buildProfessionalInvoicePdf(detail);
  const invoiceRef =
    normalizeInvoiceNumber(
      detail.raw && typeof detail.raw === "object"
        ? /** @type {Record<string, unknown>} */ (detail.raw)
        : {}
    ) || String(detail.invoiceNumber ?? "").trim();
  const ref = invoiceRef ? String(invoiceRef).replace(/[^\w-]+/g, "-") : "document";
  triggerPdfDownload(pdfBytes, `invoice-${ref}.pdf`);
}
