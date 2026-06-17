/** @typedef {{ id: string, day: string, startTime: string, endTime: string, label: string, value: string, crmScheduleKey?: string | null }} ScheduleSlot */

const API_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * API date format: YYYY-MM-DD string (e.g. "2026-06-17") for Laravel + Stripe slots.
 * @param {Date | string | null | undefined} value
 * @returns {string}
 */
export function normalizeApiDate(value) {
  if (value == null || value === "") return "";

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const text = String(value).trim();
  if (!text) return "";

  if (API_DATE_RE.test(text)) return text;

  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) {
      return normalizeApiDate(parsed);
    }
  }

  return text;
}

/**
 * @param {string} value
 */
export function isApiDateString(value) {
  return API_DATE_RE.test(String(value ?? "").trim());
}

/**
 * @param {Date | string | null | undefined} date
 */
export function formatScheduleRequestDate(date) {
  return normalizeApiDate(date);
}

/**
 * @param {unknown} payload
 * @returns {unknown[]}
 */
export function parseServiceScheduleRows(payload) {
  if (!payload || typeof payload !== "object") return [];
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (Array.isArray(record)) return record;
  if (Array.isArray(record.data)) return record.data;
  if (record.data && typeof record.data === "object") {
    const nested = /** @type {Record<string, unknown>} */ (record.data);
    if (Array.isArray(nested.schedule)) return nested.schedule;
    if (Array.isArray(nested.schedules)) return nested.schedules;
    if (Array.isArray(nested.slots)) return nested.slots;
  }
  if (Array.isArray(record.schedules)) return record.schedules;
  if (Array.isArray(record.slots)) return record.slots;

  return [];
}

/**
 * Laravel may return 4xx with a message when a date has no bookable slots.
 * @param {string | null | undefined} message
 */
export function isNoSlotsScheduleMessage(message) {
  const text = String(message ?? "").toLowerCase().trim();
  if (!text) return false;

  return (
    text.includes("no time slot") ||
    text.includes("no slots") ||
    text.includes("not available for this date") ||
    text.includes("no schedule") ||
    text.includes("no schedules") ||
    text.includes("no availability") ||
    text.includes("unavailable for this date") ||
    text.includes("slot not available")
  );
}

/**
 * @param {unknown} error
 */
export function isNoSlotsScheduleError(error) {
  if (!error || typeof error !== "object") return false;

  const record = /** @type {{ status?: number, message?: string }} */ (error);
  const status = Number(record.status) || 0;
  if (status === 404) return true;

  return isNoSlotsScheduleMessage(record.message);
}

function parseSlotRange(slotText) {
  const text = String(slotText ?? "").trim();
  if (!text) return { startTime: "", endTime: "" };

  const parts = text.split(/\s*-\s*/);
  if (parts.length >= 2) {
    return { startTime: parts[0].trim(), endTime: parts.slice(1).join(" - ").trim() };
  }

  return { startTime: text, endTime: "" };
}

function buildSlotDisplayTimes(row) {
  const slotRange = row.slot ?? row.selected_time ?? row.selectedTime;
  if (slotRange) {
    return parseSlotRange(slotRange);
  }

  const startRaw = String(row.start_time ?? row.startTime ?? row.from ?? "").trim();
  const endRaw = String(row.end_time ?? row.endTime ?? row.to ?? "").trim();

  if (startRaw.includes("AM") || startRaw.includes("PM") || endRaw.includes("AM") || endRaw.includes("PM")) {
    return { startTime: startRaw, endTime: endRaw };
  }

  return {
    startTime: startRaw ? formatScheduleTime(startRaw) : "",
    endTime: endRaw ? formatScheduleTime(endRaw) : "",
  };
}

function buildSlotValue(row, startTime, endTime) {
  const explicit =
    row.selected_time ??
    row.selectedTime ??
    row.time ??
    row.slot ??
    row.label;

  if (explicit) return String(explicit).trim();

  if (startTime && endTime) {
    const dash = String(startTime).includes("AM") || String(startTime).includes("PM") ? " - " : " – ";
    return `${startTime}${dash}${endTime}`;
  }

  return startTime || endTime || "";
}

/**
 * Normalise POST /services/get-service-schedule response to checkout slots.
 * @param {unknown} payload
 * @returns {ScheduleSlot[]}
 */
export function normalizeScheduleApiSlots(payload) {
  const rows = parseServiceScheduleRows(payload);
  if (!rows.length) return [];

  return rows.map((row, index) => {
    const record = /** @type {Record<string, unknown>} */ (row);
    const { startTime, endTime } = buildSlotDisplayTimes(record);
    const value = buildSlotValue(record, startTime, endTime);
    const id = String(
      record.crm_schedule_key ?? record.id ?? record.schedule_id ?? `${value}-${index}`
    );

    return {
      id,
      day: "",
      startTime,
      endTime,
      label: value,
      value,
      crmScheduleKey: String(
        record.crm_schedule_key ?? record.schedule_key ?? record.crm_key ?? record.key ?? id
      ).trim() || null,
    };
  });
}

/**
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function formatScheduleTime(raw) {
  if (!raw) return "";
  const part = String(raw).trim().split(":").slice(0, 2);
  if (part.length < 2) return String(raw).trim();
  return `${part[0].padStart(2, "0")}:${part[1].padStart(2, "0")}`;
}

/**
 * @param {Array<{ id?: number | string, day?: string, start_time?: string, end_time?: string }>} schedules
 * @returns {ScheduleSlot[]}
 */
export function normalizeServiceSchedules(schedules) {
  if (!Array.isArray(schedules) || !schedules.length) return [];

  return schedules.map((row) => {
    const startTime = formatScheduleTime(row.start_time);
    const endTime = formatScheduleTime(row.end_time);
    const id = String(row.id ?? `${row.day}-${startTime}-${endTime}`);
    const label = `${startTime} – ${endTime}`;

    return {
      id,
      day: String(row.day ?? "").trim(),
      startTime,
      endTime,
      label,
      value: label,
      crmScheduleKey: String(
        row.crm_schedule_key ?? row.schedule_key ?? row.crm_key ?? row.id ?? id
      ).trim() || null,
    };
  });
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function getWeekdayName(date) {
  return date.toLocaleDateString("en-GB", { weekday: "long" });
}

/**
 * @param {ScheduleSlot[]} schedules
 * @param {Date | null | undefined} date
 * @returns {ScheduleSlot[]}
 */
export function getScheduleSlotsForDate(schedules, date) {
  if (!date || !schedules?.length) return [];
  const day = getWeekdayName(date);
  return schedules.filter((s) => s.day.toLowerCase() === day.toLowerCase());
}

/**
 * @param {ScheduleSlot[]} schedules
 * @param {Date | null | undefined} date
 * @param {(date: Date) => boolean} isPast
 */
export function dateHasScheduleSlots(schedules, date, isPast) {
  if (!date || isPast(date)) return false;
  if (!schedules?.length) return false;
  return getScheduleSlotsForDate(schedules, date).length > 0;
}
