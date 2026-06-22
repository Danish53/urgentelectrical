import { fetchOrderById } from "@/services/ordersApiService";

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 30;
const CONTENT_W = PAGE_W - MARGIN * 2;
const SECTION_GAP = 14;
const SITE_TO_TABLE_GAP = 6;
const HEADER_HEIGHT_SCALE = 0.88;
const VAT_RATE = 0.2;
const INVOICE_HEADER_SRC = "/Invoice-Header.svg";
const HEADER_RENDER_SCALE = 3;

const INVOICE_META = {
  boxW: 190,
  rowH: 24,
  rowCount: 3,
  gutter: 20,
  padX: 10,
};

const TOTALS_META = {
  rowH: 26,
  finalRowH: 38,
  size: 9,
  padX: 10,
};

const PAYMENT_TERMS = {
  deposit:
    "A 60% deposit is required upfront before work commences. Work will only start once payment has been received. The remaining 40% is due upon completion of the works, unless otherwise agreed in advance.",
  latePaymentLabel: "Late Payment:",
  latePaymentText: "Fees may apply to balances outstanding after 30 days, unless otherwise agreed in writing.",
  accountDetails:
    "Account Details: Urgent Electrical Services Limited | Sort Code: 40-35-18 | Account Number: 24686934",
};

const PAYMENT_TERMS_LAYOUT = {
  pad: 28,
  headingSize: 11,
  bodySize: 9,
  lineH: 14,
  gapAfterHeading: 10,
  gapAfterDivider: 20,
  sectionGap: 18,
};

const CUSTOMER_SECTION = {
  padY: 12,
  headingSize: 11,
  bodySize: 9.5,
  bodyBoldSize: 10,
  lineGap: 13,
  dividerGap: 5,
  gapAfterDivider: 12,
  addressIndent: 18,
  sectionGap: 10,
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
  tableHeaderBar: { r: 232 / 255, g: 232 / 255, b: 232 / 255 },
  termsBg: { r: 247 / 255, g: 247 / 255, b: 247 / 255 },
  termsBorder: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
  termsDivider: { r: 238 / 255, g: 238 / 255, b: 238 / 255 },
  termsText: { r: 68 / 255, g: 68 / 255, b: 68 / 255 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  ink: { r: 0.12, g: 0.12, b: 0.12 },
  tableHeader: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
};

function getTotalsStackHeight() {
  return TOTALS_META.rowH * 3 + TOTALS_META.finalRowH;
}

function getInvoiceMetaLayout() {
  const boxX = PAGE_W - MARGIN - INVOICE_META.boxW;
  return {
    boxW: INVOICE_META.boxW,
    boxX,
    rowH: INVOICE_META.rowH,
    customerLineEndX: boxX - INVOICE_META.gutter,
    stackHeight: INVOICE_META.rowH * INVOICE_META.rowCount,
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
  const innerPad = 4;
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
  const innerPad = 4;
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
function formatAddressLines(addr) {
  if (!addr || typeof addr !== "object") return [];
  const title = String(addr.title ?? "").trim();
  const first = String(addr.first_name ?? "").trim();
  const last = String(addr.last_name ?? "").trim();
  const name = [title, first, last].filter(Boolean).join(" ");
  const line1 = String(addr.address_line_1 ?? "").trim();
  const line2 = String(addr.address_line_2 ?? "").trim();
  const town = String(addr.town ?? "").trim();
  const county = String(addr.county ?? "").trim();
  const postCode = String(addr.post_code ?? "").trim();
  const country = String(addr.country ?? "").trim();

  const lines = [];
  if (name) lines.push(name);
  if (line1 || line2) lines.push([line1, line2].filter(Boolean).join(", "));
  if (town) lines.push(town);
  if (county) lines.push(county);
  if (postCode) lines.push(postCode);
  if (country) {
    lines.push(country.toUpperCase() === "GB" ? "United Kingdom (UK)" : country);
  }
  return lines;
}

/** @param {string} text @param {number} maxLen */
function wrapText(text, maxLen = 52) {
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
  return loadRasterImageAsset(INVOICE_HEADER_SRC, CONTENT_W, HEADER_RENDER_SCALE);
}

function encodeLatin1(text) {
  const arr = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) {
    arr[i] = text.charCodeAt(i) & 0xff;
  }
  return arr;
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
    this.ops.push(`${color.r} ${color.g} ${color.b} rg`);
  }

  strokeColor(color) {
    this.ops.push(`${color.r} ${color.g} ${color.b} RG`);
  }

  lineWidth(w) {
    this.ops.push(`${w} w`);
  }

  fillRectTop(x, yTop, w, h) {
    this.ops.push(`${x} ${yFromTop(yTop + h)} ${w} ${h} re f`);
  }

  strokeRectTop(x, yTop, w, h) {
    this.ops.push(`${x} ${yFromTop(yTop + h)} ${w} ${h} re S`);
  }

  lineTop(x1, yTop1, x2, yTop2) {
    this.ops.push(`${x1} ${yFromTop(yTop1)} m ${x2} ${yFromTop(yTop2)} l S`);
  }

  /** @param {Array<[number, number]>} pointsTop */
  fillPolygonTop(pointsTop) {
    if (pointsTop.length < 3) return;
    const [first, ...rest] = pointsTop;
    this.ops.push(`${first[0]} ${yFromTop(first[1])} m`);
    for (const [x, yTop] of rest) {
      this.ops.push(`${x} ${yFromTop(yTop)} l`);
    }
    this.ops.push("h f");
  }

  drawImage(name, drawW, drawH, x, yTop) {
    const y = yFromTop(yTop + drawH);
    this.ops.push("q");
    this.ops.push(`${drawW} 0 0 ${drawH} ${x} ${y} cm`);
    this.ops.push(`/${name} Do`);
    this.ops.push("Q");
  }

  text(text, x, yTop, opts = {}) {
    const font = opts.font ?? "F1";
    const size = opts.size ?? 10;
    const color = opts.color ?? C.ink;
    this.ops.push("BT");
    this.fillColor(color);
    this.ops.push(`/${font} ${size} Tf`);
    this.ops.push(`1 0 0 1 ${x} ${yFromTop(yTop)} Tm (${escapePdfText(text)}) Tj`);
    this.ops.push("ET");
  }

  /** @param {string} text @param {number} rightX @param {number} yTop */
  textRight(text, rightX, yTop, opts = {}) {
    const size = opts.size ?? 8;
    const font = opts.font ?? "F1";
    this.text(text, rightX - measureTextWidth(text, size, font), yTop, { ...opts, size, font });
  }

  /** @param {number} cx @param {number} cyTop @param {number} r */
  circleTop(cx, cyTop, r, fill = true) {
    this.circle(cx, PAGE_H - cyTop, r, fill);
  }

  /** Circle in PDF bottom-left coordinates */
  circle(cx, cyBottom, r, fill = true) {
    const k = r * 0.5523;
    this.ops.push(`${cx + r} ${cyBottom} m`);
    this.ops.push(`${cx + r} ${cyBottom + k} ${cx + k} ${cyBottom + r} ${cx} ${cyBottom + r} c`);
    this.ops.push(`${cx - k} ${cyBottom + r} ${cx - r} ${cyBottom + k} ${cx - r} ${cyBottom} c`);
    this.ops.push(`${cx - k} ${cyBottom - r} ${cx - r} ${cyBottom - k} ${cx} ${cyBottom - r} c`);
    this.ops.push(`${cx + k} ${cyBottom - r} ${cx + r} ${cyBottom - k} ${cx + r} ${cyBottom} c`);
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
 * @param {{ leftBold?: boolean, rightBold?: boolean, textColor?: { r: number, g: number, b: number }, rightX?: number, padX?: number, size?: number, leftLines?: string[] }} [opts]
 */
function drawMetaRow(pdf, x, yTop, w, h, bg, left, right, opts = {}) {
  pdf.fillColor(bg);
  pdf.fillRectTop(x, yTop, w, h);
  const padX = opts.padX ?? INVOICE_META.padX;
  const size = opts.size ?? 8;
  const textY = yTop + (h + size * 0.32) / 2;
  const leftFont = opts.leftBold ? "F2" : "F1";
  const rightFont = opts.rightBold ? "F2" : "F1";
  const color = opts.textColor ?? C.black;
  const valueRightX = x + w - padX;
  const leftLines = opts.leftLines;

  if (leftLines?.length) {
    const lineGap = size + 1.5;
    const stackH = leftLines.length * lineGap - 1.5;
    const startY = yTop + (h - stackH) / 2 + size * 0.72;
    leftLines.forEach((line, index) => {
      pdf.text(line, x + padX, startY + index * lineGap, { font: leftFont, size, color });
    });
  } else {
    pdf.text(left, x + padX, textY, { font: leftFont, size, color });
  }

  pdf.textRight(String(right ?? ""), valueRightX, textY, { font: rightFont, size, color });
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>} ctx
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 */
function drawInvoiceMetaStack(pdf, yTop, ctx, layout) {
  const { boxW, boxX, rowH } = layout;
  const metaSize = 9;
  const titleSize = 12;
  const titleY = yTop + (rowH + titleSize * 0.32) / 2;

  pdf.fillColor(C.red);
  pdf.fillRectTop(boxX, yTop, boxW, rowH);
  const invoiceTitleW = measureTextWidth("INVOICE", titleSize, "F2");
  pdf.text("INVOICE", boxX + (boxW - invoiceTitleW) / 2, titleY, {
    font: "F2",
    size: titleSize,
    color: C.white,
  });

  drawMetaRow(pdf, boxX, yTop + rowH, boxW, rowH, C.yellow, "Invoice Number", ctx.reference, {
    leftBold: true,
    rightBold: true,
    size: metaSize,
  });
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH * 2,
    boxW,
    rowH,
    C.grey,
    "Invoice Date",
    ctx.invoiceDateDisplay,
    { leftBold: true, rightBold: true, size: metaSize }
  );

  return yTop + rowH * INVOICE_META.rowCount;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {string[]} lines
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 */
function drawCustomerDetails(pdf, yTop, lines, layout) {
  const {
    padY,
    headingSize,
    bodySize,
    bodyBoldSize,
    lineGap,
    dividerGap,
    gapAfterDivider,
    addressIndent,
  } = CUSTOMER_SECTION;
  const headingAscent = headingSize * 0.72;
  const headingX = MARGIN;
  const contentX = MARGIN + addressIndent;
  const lineEndX = layout.customerLineEndX;

  const headingBaseline = yTop + padY + headingAscent;
  const dividerY = headingBaseline + headingSize * 0.22 + dividerGap;
  const firstLineBaseline = dividerY + gapAfterDivider;
  const lastLineBaseline = firstLineBaseline + Math.max(0, lines.length - 1) * lineGap;
  const lastIndex = Math.max(0, lines.length - 1);
  const lastLineBold = lastIndex === 0 || isPostcodeLine(lines[lastIndex] ?? "");
  const lastLineDescent = (lastLineBold ? bodyBoldSize : bodySize) * 0.28;
  const blockEndY = lastLineBaseline + lastLineDescent + padY;

  pdf.text("CUSTOMER DETAILS", headingX, headingBaseline, {
    font: "F2",
    size: headingSize,
    color: C.black,
  });
  pdf.lineWidth(0.75);
  pdf.strokeColor(C.black);
  pdf.lineTop(headingX, dividerY, lineEndX, dividerY);

  let lineBaseline = firstLineBaseline;
  lines.forEach((line, index) => {
    const bold = index === 0 || isPostcodeLine(line);
    const size = bold ? bodyBoldSize : bodySize;
    pdf.text(line, contentX, lineBaseline, {
      font: bold ? "F2" : "F1",
      size,
      color: C.ink,
    });
    lineBaseline += lineGap;
  });

  return { endY: blockEndY, dividerY };
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {string} address
 */
function drawSiteAddress(pdf, yTop, address) {
  const padX = 10;
  const padY = 8;
  const headingSize = 9.5;
  const addressSize = 9.5;
  const headingGap = 14;
  const lineGap = 12;
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
 * @param {number} tableX
 * @param {number} tableW
 */
function getTableColumns(tableX, tableW) {
  const pad = 12;
  const descW = Math.round(tableW * 0.52);
  const numericW = tableW - pad * 2 - descW;
  const colW = {
    qty: Math.round(numericW * 0.105),
    unit: Math.round(numericW * 0.185),
    amount: Math.round(numericW * 0.185),
    vatRate: Math.round(numericW * 0.155),
    vatAmt: Math.round(numericW * 0.185),
    total: Math.round(numericW * 0.185),
  };

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
 * @param {string[]} lines
 * @param {number} blockTop
 * @param {number} blockH
 * @param {{ size?: number, font?: string, color?: { r: number, g: number, b: number } }} [opts]
 */
function drawColumnHeaderStack(pdf, col, lines, blockTop, blockH, opts = {}) {
  const size = opts.size ?? 9;
  const lineGap = size + 1.5;
  const stackH = lines.length * lineGap - 1.5;
  const startY = blockTop + (blockH - stackH) / 2 + size * 0.72;
  lines.forEach((line, index) => {
    drawInColumn(pdf, col, line, startY + index * lineGap, { ...opts, size });
  });
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["tableRows"]} rows
 */
function drawServiceTable(pdf, yTop, rows) {
  const tableX = MARGIN;
  const tableW = CONTENT_W;
  const headerH = 36;
  const rowMinH = 34;
  const headerSize = 9;
  const cellSize = 9;
  const lineH = 14;
  const { cols, descX, descMaxW } = getTableColumns(tableX, tableW);
  const descMaxChars = Math.max(28, Math.floor(descMaxW / (cellSize * 0.48)));
  const cellOpts = { font: "F1", size: cellSize, color: C.black };
  const headerOpts = { font: "F2", size: headerSize, color: C.black };

  pdf.fillColor(C.tableHeaderBar);
  pdf.fillRectTop(tableX, yTop, tableW, headerH);
  const headerTextY = yTop + (headerH + headerSize * 0.32) / 2;

  pdf.text("Description", descX, headerTextY, headerOpts);
  drawInColumn(pdf, cols.qty, "Qty", headerTextY, headerOpts);
  drawInColumn(pdf, cols.unit, "Unit", headerTextY, headerOpts);
  drawInColumn(pdf, cols.amount, "Amount", headerTextY, headerOpts);
  drawColumnHeaderStack(pdf, cols.vatRate, ["VAT", "Rate"], yTop, headerH, headerOpts);
  drawColumnHeaderStack(pdf, cols.vatAmt, ["VAT", "Amount"], yTop, headerH, headerOpts);
  drawInColumn(pdf, cols.total, "Total", headerTextY, headerOpts);

  let y = yTop + headerH;
  rows.forEach((row) => {
    const descLines = wrapText(row.description, descMaxChars);
    const rowH = Math.max(rowMinH, 18 + descLines.length * lineH);

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

  return y + SECTION_GAP;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["totals"]} totals
 */
function drawTotalsStack(pdf, yTop, totals) {
  const layout = getInvoiceMetaLayout();
  const { boxW, boxX } = layout;
  const { rowH, finalRowH, size, padX } = TOTALS_META;
  const boldOpts = { leftBold: true, rightBold: true, size, padX };

  drawMetaRow(pdf, boxX, yTop, boxW, rowH, C.siteBar, "Amount", formatPdfMoney(totals.amount), boldOpts);
  drawMetaRow(pdf, boxX, yTop + rowH, boxW, rowH, C.green, "Discount", formatPdfMoney(totals.discount), {
    ...boldOpts,
    textColor: C.white,
  });
  drawMetaRow(pdf, boxX, yTop + rowH * 2, boxW, rowH, C.yellow, "VAT", formatPdfMoney(totals.vat), boldOpts);
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH * 3,
    boxW,
    finalRowH,
    C.orange,
    "",
    formatPdfMoney(totals.totalIncVat),
    { ...boldOpts, leftLines: ["Amount Including", "VAT"] }
  );

  return yTop + getTotalsStackHeight();
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 */
function drawPaymentTermsBox(pdf, yTop) {
  const { pad, headingSize, bodySize, lineH, gapAfterHeading, gapAfterDivider, sectionGap } =
    PAYMENT_TERMS_LAYOUT;
  const boxW = CONTENT_W;
  const innerW = boxW - pad * 2;
  const maxChars = Math.max(40, Math.floor(innerW / (bodySize * 0.47)));
  const bodyOpts = { font: "F1", size: bodySize, color: C.termsText };

  const depositLines = wrapText(PAYMENT_TERMS.deposit, maxChars);
  const accountLines = wrapText(PAYMENT_TERMS.accountDetails, maxChars);
  const boxH =
    pad * 2 +
    headingSize +
    gapAfterHeading +
    gapAfterDivider +
    depositLines.length * lineH +
    sectionGap +
    lineH * 2 +
    sectionGap +
    accountLines.length * lineH;

  pdf.fillColor(C.termsBg);
  pdf.fillRectTop(MARGIN, yTop, boxW, boxH);
  pdf.lineWidth(0.75);
  pdf.strokeColor(C.termsBorder);
  pdf.strokeRectTop(MARGIN, yTop, boxW, boxH);

  let cursor = yTop + pad;
  const textX = MARGIN + pad;
  const textBase = (blockTop) => blockTop + bodySize * 0.85;

  pdf.text("Payment And Terms", textX, cursor + headingSize, {
    font: "F2",
    size: headingSize,
    color: C.black,
  });
  cursor += headingSize + gapAfterHeading;

  pdf.lineWidth(0.5);
  pdf.strokeColor(C.termsDivider);
  pdf.lineTop(textX, cursor, MARGIN + boxW - pad, cursor);
  cursor += gapAfterDivider;

  depositLines.forEach((line, index) => {
    pdf.text(line, textX, textBase(cursor) + index * lineH, bodyOpts);
  });
  cursor += depositLines.length * lineH + sectionGap;

  pdf.text(PAYMENT_TERMS.latePaymentLabel, textX, textBase(cursor), bodyOpts);
  pdf.text(PAYMENT_TERMS.latePaymentText, textX, textBase(cursor) + lineH, bodyOpts);
  cursor += lineH * 2 + sectionGap;

  accountLines.forEach((line, index) => {
    pdf.text(line, textX, textBase(cursor) + index * lineH, bodyOpts);
  });

  return yTop + boxH;
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

  const addressRow =
    detailBlock?.address && typeof detailBlock.address === "object"
      ? /** @type {Record<string, unknown>} */ (detailBlock.address)
      : null;

  const reference = order.reference || String(raw.order_id ?? "");
  const serviceName = order.serviceName || "Electrical service";
  const invoiceDate = formatShortDate(order.visitDate || raw.selected_date);
  const invoiceDateDisplay = formatInvoiceMetaDate(order.visitDate || raw.selected_date);
  const scheduledLabel = formatScheduledLabel(order.visitDate, order.visitTime);
  const addressLines = formatAddressLines(addressRow);
  const customerLines = addressLines.length ? addressLines : ["Customer"];
  const siteAddress = order.address?.trim() || addressLines.slice(1).join(", ");

  const qty = parseMoney(detailBlock?.quantity) || 1;
  const variant =
    detailBlock?.service_varient && typeof detailBlock.service_varient === "object"
      ? /** @type {Record<string, unknown>} */ (detailBlock.service_varient)
      : detailBlock?.service_variant && typeof detailBlock.service_variant === "object"
        ? /** @type {Record<string, unknown>} */ (detailBlock.service_variant)
        : null;

  const unitCost = parseMoney(variant?.variant_price ?? detailBlock?.total) / (qty || 1);
  const lineNet = parseMoney(detailBlock?.total) || unitCost * qty;
  const lineVat = lineNet * VAT_RATE;

  /** @type {Array<{ description: string, qty: number, unitCost: number, amount: number, vatRateLabel: string, vatAmount: number, total: number }>} */
  const tableRows = [
    {
      description: serviceName,
      qty,
      unitCost,
      amount: lineNet,
      vatRateLabel: "20%",
      vatAmount: lineVat,
      total: lineNet + lineVat,
    },
  ];

  const amountExVat = tableRows.reduce((sum, row) => sum + row.amount, 0);
  const discount = parseMoney(order.discount);
  const netAfterDiscount = Math.max(0, amountExVat - discount);
  const vat = netAfterDiscount * VAT_RATE;
  const totalIncVat =
    parseMoney(order.totalInc) > 0 ? parseMoney(order.totalInc) : netAfterDiscount + vat;

  return {
    reference,
    invoiceDate,
    invoiceDateDisplay,
    scheduledLabel,
    customerLines,
    siteAddress,
    tableRows,
    totals: {
      amount: amountExVat,
      discount,
      vat,
      totalIncVat,
    },
  };
}

function renderInvoicePage(pdf, header, ctx) {
  const headerBottom = drawBrandHeader(pdf, header);
  const customerGap = CUSTOMER_SECTION.sectionGap;
  const sectionY = headerBottom + customerGap;
  const layout = getInvoiceMetaLayout();

  const customerBlock = drawCustomerDetails(pdf, sectionY, ctx.customerLines, layout);
  const metaEnd = drawInvoiceMetaStack(pdf, customerBlock.dividerY, ctx, layout);

  const siteY = Math.max(customerBlock.endY, metaEnd) + customerGap;
  const tableY = drawSiteAddress(pdf, siteY, ctx.siteAddress);
  const afterTableY = drawServiceTable(pdf, tableY, ctx.tableRows);

  const totalsY = afterTableY + 20;
  const totalsEndY = drawTotalsStack(pdf, totalsY, ctx.totals);
  drawPaymentTermsBox(pdf, totalsEndY + SECTION_GAP);
}

function assemblePdfDocument(stream, assets) {
  const { header } = assets;
  const objects = [];

  function addObject(parts) {
    objects.push({ id: objects.length + 1, parts });
    return objects.length;
  }

  const fontRegularId = addObject(["<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]);
  const fontBoldId = addObject(["<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"]);

  let headerId = 0;
  if (header) {
    headerId = addObject([
      `<< /Type /XObject /Subtype /Image /Width ${header.width} /Height ${header.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${header.bytes.length} >>\nstream\n`,
      header.bytes,
      "\nendstream",
    ]);
  }

  const streamBytes = encodeLatin1(stream);
  const contentId = addObject([`<< /Length ${streamBytes.length} >>\nstream\n`, streamBytes, "\nendstream"]);

  const xObjectEntries = [];
  if (headerId) xObjectEntries.push(`/Header ${headerId} 0 R`);
  const xObjectPart = xObjectEntries.length ? `/XObject << ${xObjectEntries.join(" ")} >>` : "";
  const pageId = addObject([
    `<< /Type /Page /Parent PAGES_ID /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> ${xObjectPart} >> >>`,
  ]);

  const pagesId = addObject([`<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`]);
  const catalogId = addObject([`<< /Type /Catalog /Pages ${pagesId} 0 R >>`]);

  const chunks = [encodeLatin1("%PDF-1.4\n")];
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
  const header = await loadHeaderAsset();
  const ctx = buildInvoiceContextFromDetail(order);
  const writer = new InvoicePdfWriter();
  renderInvoicePage(writer, header, ctx);
  return assemblePdfDocument(`${writer.ops.join("\n")}\n`, { header });
}

export async function downloadOrderInvoicePdf(order) {
  if (!order?.id && !order?.reference) {
    throw new Error("This order cannot be invoiced.");
  }
  if (!order.id) {
    throw new Error("This order cannot be invoiced (missing ID).");
  }

  const detail = await fetchOrderById(order.id);
  const pdfBytes = await buildProfessionalInvoicePdf(detail);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const ref = String(detail.reference || order.reference || order.id).replace(/[^\w-]+/g, "-");
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `invoice-${ref}.pdf`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
