import { dateHasScheduleSlots, getScheduleSlotsForDate } from "@/lib/schedules";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function formatMoney(amount) {
  return `£${parseFloat(amount).toFixed(2)}`;
}

export function formatLongDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMonthYear(year, month) {
  return new Date(year, month, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

/** Monday-based calendar grid; adjacent month dates fill empty cells */
export function getCalendarCells(year, month) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  const prevMonthEnd = new Date(year, month, 0);
  const prevYear = prevMonthEnd.getFullYear();
  const prevMonth = prevMonthEnd.getMonth();
  const daysInPrevMonth = prevMonthEnd.getDate();

  for (let i = startPad - 1; i >= 0; i--) {
    cells.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push(new Date(year, month + 1, nextDay));
    nextDay += 1;
  }

  return cells;
}

export function isOutsideViewMonth(date, viewYear, viewMonth) {
  return date.getFullYear() !== viewYear || date.getMonth() !== viewMonth;
}

export { WEEKDAY_LABELS };

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

export function dateHasSlots(date) {
  if (!date || isPastDate(date)) return false;
  const day = date.getDay();
  return day !== 0;
}

export function getTodayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isToday(date) {
  return isSameDay(date, getTodayStart());
}

/** Default booking date: today if available, otherwise next weekday with slots */
export function getDefaultBookingDate() {
  const cursor = getTodayStart();
  for (let i = 0; i < 21; i++) {
    if (dateHasSlots(cursor)) return new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
  return getTodayStart();
}

/** Pick first date that has API schedule slots */
export function getDefaultBookingDateForSchedules(schedules) {
  if (!schedules?.length) return getDefaultBookingDate();

  const cursor = getTodayStart();
  for (let i = 0; i < 42; i++) {
    if (dateHasScheduleSlots(schedules, cursor, isPastDate)) return new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
  }
  return null;
}

export function dateHasAvailableSlots(date, schedules) {
  if (schedules?.length) return dateHasScheduleSlots(schedules, date, isPastDate);
  return dateHasSlots(date);
}

export function getTimeSlotsForBooking(date, schedules) {
  if (!date) return [];
  if (schedules?.length) return getScheduleSlotsForDate(schedules, date);
  return [];
}

export { getScheduleSlotsForDate };
