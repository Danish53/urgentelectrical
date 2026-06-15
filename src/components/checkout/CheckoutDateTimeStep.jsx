"use client";

import { useMemo, useState } from "react";
import {
  WEEKDAY_LABELS,
  dateHasAvailableSlots,
  formatLongDate,
  formatMonthYear,
  getCalendarCells,
  getTimeSlotsForBooking,
  getTodayStart,
  isOutsideViewMonth,
  isPastDate,
  isSameDay,
  isToday,
} from "@/components/checkout/checkoutUtils";
import { isNoSlotsScheduleError } from "@/lib/schedules";

function SlotsWarning({ message = "No time slots available for this date." }) {
  return (
    <div className="home1-checkout-slots-warning" role="status">
      {/* <span className="home1-checkout-slots-warning-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span> */}
      <p>{message}</p>
    </div>
  );
}

function CalNavIcon({ direction }) {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function CheckoutDateTimeStep({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onContinue,
  error,
  timeSlots = [],
  slotsLoading = false,
  slotsError = null,
  useDynamicSchedule = false,
  schedules = [],
}) {
  const today = useMemo(() => getTodayStart(), []);
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());

  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);
  const hasStaticSchedules = !useDynamicSchedule && schedules.length > 0;
  const slotsAvailable = useDynamicSchedule
    ? Boolean(selectedDate) && !slotsLoading && timeSlots.length > 0
    : selectedDate
      ? dateHasAvailableSlots(selectedDate, schedules)
      : false;
  const displaySlots = useDynamicSchedule
    ? timeSlots
    : getTimeSlotsForBooking(selectedDate, schedules);
  const noSlotsFromApi = isNoSlotsScheduleError({ message: slotsError ?? "" });
  const showNoSlotsWarning =
    Boolean(selectedDate) &&
    !slotsLoading &&
    displaySlots.length === 0 &&
    (!slotsError || noSlotsFromApi);

  function isDateDisabled(date) {
    if (isPastDate(date)) return true;
    if (useDynamicSchedule) return false;
    return !dateHasAvailableSlots(date, schedules);
  }

  function prevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function nextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    if (useDynamicSchedule || dateHasAvailableSlots(today, schedules)) onSelectDate(new Date(today));
  }

  function handleDateClick(date) {
    if (isOutsideViewMonth(date, viewYear, viewMonth)) {
      setViewYear(date.getFullYear());
      setViewMonth(date.getMonth());
    }
    onSelectDate(date);
  }

  return (
    <div className="home1-checkout-step-panel">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 1 of 3</p>
        <h2 className="home1-checkout-step-title">When should we visit?</h2>
        <p className="home1-checkout-step-lead">Choose a date and an available time slot.</p>
      </header>

      <div className="home1-checkout-card home1-checkout-datetime-card">
        <div className="home1-checkout-datetime-grid">
          <div className="home1-checkout-datetime-calendar">
            <div className="home1-checkout-card-head home1-checkout-datetime-head">
              <div>
                <h3 className="home1-checkout-card-title">Select a date</h3>
                <p className="home1-checkout-card-sub">
                  {useDynamicSchedule
                    ? "Choose a date to see available slots"
                    : hasStaticSchedules
                      ? "Dates match this service schedule"
                      : "Available Monday – Saturday"}
                </p>
              </div>
              <button type="button" onClick={goToToday} className="home1-checkout-today-btn">
                Today
              </button>
            </div>

            <div className="home1-checkout-calendar-nav">
              <button
                type="button"
                onClick={prevMonth}
                className="home1-checkout-cal-btn"
                aria-label="Previous month"
              >
                <CalNavIcon direction="prev" />
              </button>
              <span className="home1-checkout-calendar-month">{formatMonthYear(viewYear, viewMonth)}</span>
              <button type="button" onClick={nextMonth} className="home1-checkout-cal-btn" aria-label="Next month">
                <CalNavIcon direction="next" />
              </button>
            </div>

            <div className="home1-checkout-calendar-weekdays" aria-hidden="true">
              {WEEKDAY_LABELS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="home1-checkout-calendar-grid" role="grid" aria-label="Select a date">
              {cells.map((date) => {
                const disabled = isDateDisabled(date);
                const selected = isSameDay(date, selectedDate);
                const todayCell = isToday(date);
                const outsideMonth = isOutsideViewMonth(date, viewYear, viewMonth);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDateClick(date)}
                    className={`home1-checkout-cal-day${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${todayCell ? " is-today" : ""}${outsideMonth ? " is-outside-month" : ""}`}
                    aria-pressed={selected}
                    aria-label={formatLongDate(date)}
                    aria-current={todayCell ? "date" : undefined}
                  >
                    <span className="home1-checkout-cal-day-num">{date.getDate()}</span>
                    {todayCell && !selected ? (
                      <span className="home1-checkout-cal-today-dot" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="home1-checkout-datetime-slots">
            <div className="home1-checkout-card-head home1-checkout-datetime-head">
              <div>
                <h3 className="home1-checkout-card-title">Select a time slot</h3>
                <p className="home1-checkout-card-sub">
                  {selectedDate ? formatLongDate(selectedDate) : "Pick a date on the calendar"}
                </p>
              </div>
            </div>

            {!selectedDate ? (
              <p className="home1-checkout-slots-placeholder" role="status">
                Select a date to view available time slots.
              </p>
            ) : null}

            {selectedDate && useDynamicSchedule && slotsLoading ? (
              <p className="home1-checkout-slots-loading" role="status">
                Loading available time slots…
              </p>
            ) : null}

            {showNoSlotsWarning ? <SlotsWarning /> : null}

            {slotsError && !showNoSlotsWarning ? (
              <>
                {/* {slotsError} */}
                <SlotsWarning />
              </>
            ) : null}

            {selectedDate && slotsAvailable && displaySlots.length > 0 ? (
              <div className="home1-checkout-schedule-grid" role="group" aria-label="Available time slots">
                {displaySlots.map((slot) => {
                  const isSelected = selectedTime === slot.value;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onSelectTime(slot.value)}
                      className={`home1-checkout-schedule-slot${isSelected ? " is-selected" : ""}`}
                      aria-pressed={isSelected}
                    >
                      <span className="home1-checkout-schedule-slot-label">Available</span>
                      <span className="home1-checkout-schedule-slot-times">
                        <span className="home1-checkout-schedule-slot-start">{slot.startTime}</span>
                        <span className="home1-checkout-schedule-slot-sep" aria-hidden="true">
                          to
                        </span>
                        <span className="home1-checkout-schedule-slot-end">{slot.endTime}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {error && !showNoSlotsWarning && !slotsError ? (
        <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        className="home1-checkout-continue"
        disabled={!selectedDate || !selectedTime || slotsLoading}
      >
        <span>Continue to your details</span>
        <span className="home1-checkout-continue-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
