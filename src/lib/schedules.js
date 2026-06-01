/** @typedef {{ id: string, day: string, startTime: string, endTime: string, label: string, value: string }} ScheduleSlot */

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
