import { fetchOrderById } from "@/services/ordersApiService";
import { CONTACT_BUSINESS_NAME } from "@/data/contactPage";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 32;
const CONTENT_W = PAGE_W - MARGIN * 2;
const VAT_RATE = 0.2;
const INVOICE_HEADER_SRC = "/Invoice-Header.svg";
const INVOICE_STAMP_SRC = "/stamp.png";
const HEADER_RENDER_SCALE = 3;
const STAMP_RENDER_SCALE = 2;
const STAMP_DRAW_W = 128;

const INVOICE_META = {
  boxW: 250,
  rowH: 26,
  gutter: 18,
  padX: 14,
};

const C = {
  red: { r: 227 / 255, g: 30 / 255, b: 36 / 255 },
  dark: { r: 26 / 255, g: 26 / 255, b: 26 / 255 },
  yellow: { r: 249 / 255, g: 212 / 255, b: 102 / 255 },
  green: { r: 0, g: 176 / 255, b: 0 },
  orange: { r: 244 / 255, g: 196 / 255, b: 97 / 255 },
  grey: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
  black: { r: 0, g: 0, b: 0 },
  white: { r: 1, g: 1, b: 1 },
  ink: { r: 0.12, g: 0.12, b: 0.12 },
  tableHeader: { r: 224 / 255, g: 224 / 255, b: 224 / 255 },
};

function getInvoiceMetaLayout() {
  const boxX = PAGE_W - MARGIN - INVOICE_META.boxW;
  return {
    boxW: INVOICE_META.boxW,
    boxX,
    rowH: INVOICE_META.rowH,
    customerLineEndX: boxX - INVOICE_META.gutter,
    stackHeight: INVOICE_META.rowH * 4,
  };
}

/** @param {string} text @param {number} size @param {boolean} [bold] */
function estimateTextWidth(text, size, bold = false) {
  return String(text).length * size * (bold ? 0.58 : 0.52);
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
  if (county || postCode) lines.push([county, postCode].filter(Boolean).join(" "));
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

async function loadStampAsset() {
  try {
    return await loadRasterImageAsset(INVOICE_STAMP_SRC, STAMP_DRAW_W, STAMP_RENDER_SCALE);
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
    const bold = (opts.font ?? "F1") === "F2";
    this.text(text, rightX - estimateTextWidth(text, size, bold), yTop, { ...opts, size });
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
  const drawH = (header.height / header.width) * drawW;
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
 * @param {{ leftBold?: boolean, rightBold?: boolean, textColor?: { r: number, g: number, b: number }, rightX?: number }} [opts]
 */
function drawMetaRow(pdf, x, yTop, w, h, bg, left, right, opts = {}) {
  pdf.fillColor(bg);
  pdf.fillRectTop(x, yTop, w, h);
  const padX = opts.padX ?? INVOICE_META.padX;
  const size = opts.size ?? 8;
  const textY = yTop + (h + size * 0.32) / 2;
  const leftX = x + padX;
  const rightEdge = opts.rightEdge ?? x + w - padX;

  pdf.text(left, leftX, textY, {
    font: opts.leftBold ? "F2" : "F1",
    size,
    color: opts.textColor ?? C.black,
  });

  let rightSize = size;
  const leftWidth = estimateTextWidth(left, size, opts.leftBold);
  const maxRightW = rightEdge - leftX - leftWidth - 12;
  while (rightSize > 6.5 && estimateTextWidth(right, rightSize, opts.rightBold) > maxRightW) {
    rightSize -= 0.5;
  }

  pdf.text(right, rightEdge - estimateTextWidth(right, rightSize, opts.rightBold), textY, {
    font: opts.rightBold ? "F2" : "F1",
    size: rightSize,
    color: opts.textColor ?? C.black,
  });
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>} ctx
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 */
function drawInvoiceMetaStack(pdf, yTop, ctx, layout) {
  const { boxW, boxX, rowH } = layout;
  const padX = INVOICE_META.padX;
  const rightEdge = boxX + boxW - padX;

  pdf.fillColor(C.red);
  pdf.fillRectTop(boxX, yTop, boxW, rowH);
  pdf.text("INVOICE", boxX + padX, yTop + (rowH + 12 * 0.32) / 2, {
    font: "F2",
    size: 12,
    color: C.white,
  });

  drawMetaRow(pdf, boxX, yTop + rowH, boxW, rowH, C.yellow, "INVOICE NUMBER:", ctx.reference, {
    leftBold: true,
    rightBold: true,
    rightEdge,
  });
  drawMetaRow(pdf, boxX, yTop + rowH * 2, boxW, rowH, C.grey, "INVOICE DATE:", ctx.invoiceDate, {
    leftBold: true,
    rightBold: true,
    rightEdge,
  });
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH * 3,
    boxW,
    rowH,
    C.green,
    "SCHEDULED:",
    ctx.scheduledLabel,
    { leftBold: true, rightBold: true, rightEdge }
  );

  return yTop + rowH * 4;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {string[]} lines
 * @param {ReturnType<typeof getInvoiceMetaLayout>} layout
 */
function drawCustomerDetails(pdf, yTop, lines, layout) {
  const headingY = yTop + 12;
  pdf.text("CUSTOMER DETAILS", MARGIN, headingY, { font: "F2", size: 11, color: C.black });
  pdf.lineWidth(0.75);
  pdf.strokeColor(C.black);
  pdf.lineTop(MARGIN, headingY + 5, layout.customerLineEndX, headingY + 5);

  let y = headingY + 22;
  lines.forEach((line, index) => {
    pdf.text(line, MARGIN, y, {
      font: index === 0 ? "F2" : "F1",
      size: index === 0 ? 10 : 9.5,
      color: C.ink,
    });
    y += 15;
  });

  return y + 4;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {string} address
 */
function drawSiteAddress(pdf, yTop, address) {
  const barH = 20;
  pdf.fillColor(C.grey);
  pdf.fillRectTop(MARGIN, yTop, CONTENT_W, barH);
  pdf.text("Site Address", MARGIN + 8, yTop + 14, { font: "F2", size: 9.5, color: C.black });

  let y = yTop + barH + 14;
  wrapText(address, 90).forEach((line) => {
    pdf.text(line, MARGIN + 4, y, { size: 9.5, color: C.ink });
    y += 13;
  });

  return y + 8;
}

/**
 * @param {number} tableX
 * @param {number} tableW
 */
function getTableColumns(tableX, tableW) {
  const pad = 8;
  const colW = {
    qty: 28,
    unit: 58,
    amount: 50,
    vatRate: 48,
    vatAmt: 58,
    total: 54,
  };

  /** @type {Record<string, { left: number, right: number, width: number }>} */
  const cols = {};
  let edge = tableX + tableW - pad;

  for (const key of ["total", "vatAmt", "vatRate", "amount", "unit", "qty"]) {
    const width = colW[key];
    cols[key] = { right: edge, left: edge - width, width };
    edge -= width;
  }

  return { pad, cols, descX: tableX + pad, descMaxW: edge - tableX - pad - 6 };
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["tableRows"]} rows
 */
function drawServiceTable(pdf, yTop, rows) {
  const tableX = MARGIN;
  const tableW = CONTENT_W;
  const headerH = 22;
  const rowH = 26;
  const headerSize = 7.5;
  const cellSize = 8;
  const { pad, cols, descX, descMaxW } = getTableColumns(tableX, tableW);

  pdf.fillColor(C.tableHeader);
  pdf.fillRectTop(tableX, yTop, tableW, headerH);
  const headerTextY = yTop + 15;
  const headerOpts = { font: "F2", size: headerSize, color: C.black };

  pdf.text("DESCRIPTION", descX, headerTextY, headerOpts);
  drawInColumn(pdf, cols.qty, "QTY", headerTextY, headerOpts);
  drawInColumn(pdf, cols.unit, "UNIT COST", headerTextY, headerOpts);
  drawInColumn(pdf, cols.amount, "AMOUNT", headerTextY, headerOpts);
  drawInColumn(pdf, cols.vatRate, "VAT RATE", headerTextY, headerOpts);
  drawInColumn(pdf, cols.vatAmt, "VAT AMOUNT", headerTextY, headerOpts);
  drawInColumn(pdf, cols.total, "TOTAL", headerTextY, headerOpts);

  pdf.strokeColor(C.black);
  pdf.lineWidth(0.75);
  pdf.lineTop(tableX, yTop + headerH, tableX + tableW, yTop + headerH);

  let y = yTop + headerH;
  rows.forEach((row) => {
    y += rowH;
    const textY = y - 10;
    const descLines = wrapText(row.description, Math.floor(descMaxW / 4.2));
    pdf.text(descLines[0] ?? row.description, descX, textY, { size: cellSize, color: C.ink });
    if (descLines.length > 1) {
      pdf.text(descLines.slice(1).join(" "), descX, textY + 11, { size: cellSize, color: C.ink });
    }

    drawInColumn(pdf, cols.qty, String(row.qty), textY, { size: cellSize, color: C.ink });
    drawInColumn(pdf, cols.unit, formatPdfMoney(row.unitCost), textY, { size: cellSize, color: C.ink });
    drawInColumn(pdf, cols.amount, formatPdfMoney(row.amount), textY, { size: cellSize, color: C.ink });
    drawInColumn(pdf, cols.vatRate, row.vatRateLabel, textY, { size: cellSize, color: C.ink });
    drawInColumn(pdf, cols.vatAmt, formatPdfMoney(row.vatAmount), textY, { size: cellSize, color: C.ink });
    drawInColumn(pdf, cols.total, formatPdfMoney(row.total), textY, {
      font: "F2",
      size: cellSize,
      color: C.ink,
    });

    pdf.lineWidth(0.5);
    pdf.lineTop(tableX + pad, y, tableX + tableW - pad, y);
  });

  return y + 20;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {number} yTop
 * @param {ReturnType<typeof buildInvoiceContextFromDetail>["totals"]} totals
 */
function drawTotalsStack(pdf, yTop, totals) {
  const layout = getInvoiceMetaLayout();
  const { boxW, boxX, rowH } = layout;
  const rightEdge = boxX + boxW - INVOICE_META.padX;

  drawMetaRow(pdf, boxX, yTop, boxW, rowH, C.white, "Amount", formatPdfMoney(totals.amount), {
    leftBold: true,
    rightBold: true,
    rightEdge,
  });
  drawMetaRow(pdf, boxX, yTop + rowH, boxW, rowH, C.green, "Discount", formatPdfMoney(totals.discount), {
    leftBold: true,
    rightBold: true,
    rightEdge,
  });
  drawMetaRow(pdf, boxX, yTop + rowH * 2, boxW, rowH, C.yellow, "VAT", formatPdfMoney(totals.vat), {
    leftBold: true,
    rightBold: true,
    rightEdge,
  });
  drawMetaRow(
    pdf,
    boxX,
    yTop + rowH * 3,
    boxW,
    rowH,
    C.orange,
    "Amount Including VAT",
    formatPdfMoney(totals.totalIncVat),
    { leftBold: true, rightBold: true, rightEdge, size: 8 }
  );

  return yTop + rowH * 4;
}

/**
 * @param {InvoicePdfWriter} pdf
 * @param {{ bytes: Uint8Array, width: number, height: number } | null} stamp
 * @param {number} yTop
 */
function drawPaidStamp(pdf, stamp, yTop) {
  if (!stamp) return;

  const layout = getInvoiceMetaLayout();
  const stampDrawW = STAMP_DRAW_W;
  const stampDrawH = (stamp.height / stamp.width) * stampDrawW;
  const totalsH = layout.rowH * 4;
  const stampX = MARGIN + 4;
  const stampY = yTop + (totalsH - stampDrawH) / 2;

  pdf.drawImage("Stamp", stampDrawW, stampDrawH, stampX, stampY);
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
  const scheduledLabel = formatScheduledLabel(order.visitDate, order.visitTime);
  const addressLines = formatAddressLines(addressRow);
  const customerLines = addressLines.length
    ? [CONTACT_BUSINESS_NAME, ...addressLines]
    : [CONTACT_BUSINESS_NAME, "Customer"];
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
    {
      description: "Travel Charge (No Charge Within 20 Miles)",
      qty: 1,
      unitCost: parseMoney(order.deliveryFee),
      amount: parseMoney(order.deliveryFee),
      vatRateLabel: "20%",
      vatAmount: parseMoney(order.deliveryFee) * VAT_RATE,
      total: parseMoney(order.deliveryFee) * (1 + VAT_RATE),
    },
  ];

  const amountExVat = tableRows.reduce((sum, row) => sum + row.amount, 0);
  const discount = parseMoney(order.discount);
  const netAfterDiscount = Math.max(0, amountExVat - discount);
  const vat = netAfterDiscount * VAT_RATE;
  const totalIncVat =
    parseMoney(order.totalInc) > 0 ? parseMoney(order.totalInc) : netAfterDiscount + vat;

  const paymentStatus = String(order.paymentStatus || raw.payment_status || "").toLowerCase();

  return {
    reference,
    invoiceDate,
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
    showPaidStamp: paymentStatus === "paid",
  };
}

function renderInvoicePage(pdf, header, stamp, ctx) {
  const headerBottom = drawBrandHeader(pdf, header);
  const sectionY = headerBottom + 18;
  const layout = getInvoiceMetaLayout();

  const customerEnd = drawCustomerDetails(pdf, sectionY, ctx.customerLines, layout);
  const metaEnd = drawInvoiceMetaStack(pdf, sectionY, ctx, layout);

  const siteY = Math.max(customerEnd, metaEnd) + 14;
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

  let stampId = 0;
  if (stamp) {
    stampId = addObject([
      `<< /Type /XObject /Subtype /Image /Width ${stamp.width} /Height ${stamp.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${stamp.bytes.length} >>\nstream\n`,
      stamp.bytes,
      "\nendstream",
    ]);
  }

  const streamBytes = encodeLatin1(stream);
  const contentId = addObject([`<< /Length ${streamBytes.length} >>\nstream\n`, streamBytes, "\nendstream"]);

  const xObjectEntries = [];
  if (headerId) xObjectEntries.push(`/Header ${headerId} 0 R`);
  if (stampId) xObjectEntries.push(`/Stamp ${stampId} 0 R`);
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
  const [header, stamp] = await Promise.all([loadHeaderAsset(), loadStampAsset()]);
  const ctx = buildInvoiceContextFromDetail(order);
  const writer = new InvoicePdfWriter();
  renderInvoicePage(writer, header, stamp, ctx);
  return assemblePdfDocument(`${writer.ops.join("\n")}\n`, { header, stamp });
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
