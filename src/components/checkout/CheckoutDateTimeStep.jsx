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
  isPastDate,
  isSameDay,
  isToday,
} from "@/components/checkout/checkoutUtils";

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
  schedules = [],
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onContinue,
  error,
}) {
  const today = useMemo(() => getTodayStart(), []);
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());

  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);
  const hasSchedules = schedules.length > 0;
  const slotsAvailable = selectedDate ? dateHasAvailableSlots(selectedDate, schedules) : false;
  const timeSlots = useMemo(
    () => getTimeSlotsForBooking(selectedDate, schedules),
    [selectedDate, schedules]
  );

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
    if (dateHasAvailableSlots(today, schedules)) onSelectDate(new Date(today));
  }

  return (
    <div className="home1-checkout-step-panel">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 1 of 3</p>
        <h2 className="home1-checkout-step-title">When should we visit?</h2>
        <p className="home1-checkout-step-lead">
          Choose a date and an available time slot.
        </p>
      </header>

      {/* {selectedDate && slotsAvailable ? (
        <div className="home1-checkout-selected-chip" role="status">
          <span className="home1-checkout-selected-chip-label">Selected visit</span>
          <strong>
            {formatLongDate(selectedDate)}
            {selectedTime ? ` · ${selectedTime}` : " — choose a slot below"}
          </strong>
        </div>
      ) : null} */}

      <div className="home1-checkout-card home1-checkout-calendar-card">
        <div className="home1-checkout-card-head">
          <div>
            <h3 className="home1-checkout-card-title">Select a date</h3>
            <p className="home1-checkout-card-sub">
              {hasSchedules ? "Dates match this service schedule" : "Available Monday – Saturday"}
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
          {cells.map((date, i) => {
            if (!date) {
              return <span key={`empty-${i}`} className="home1-checkout-cal-empty" />;
            }
            const disabled = isPastDate(date) || !dateHasAvailableSlots(date, schedules);
            const selected = isSameDay(date, selectedDate);
            const todayCell = isToday(date);
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(date)}
                className={`home1-checkout-cal-day${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${todayCell ? " is-today" : ""}`}
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

      {selectedDate && !slotsAvailable ? (
        <p className="home1-checkout-alert home1-checkout-alert--warn" role="alert">
          No time slots on this day. Please choose another date.
        </p>
      ) : null}

      {selectedDate && slotsAvailable && timeSlots.length > 0 ? (
        <div className="home1-checkout-card home1-checkout-times-card">
          <div className="home1-checkout-card-head">
            <div>
              <h3 className="home1-checkout-card-title">Select a time slot</h3>
              <p className="home1-checkout-card-sub">{formatLongDate(selectedDate)}</p>
            </div>
          </div>

          <div className="home1-checkout-schedule-grid" role="group" aria-label="Available time slots">
            {timeSlots.map((slot) => {
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
        </div>
      ) : null}

      {hasSchedules && !timeSlots.length && selectedDate && slotsAvailable ? (
        <p className="home1-checkout-alert home1-checkout-alert--warn" role="alert">
          No slots listed for this date. Try another day.
        </p>
      ) : null}

      {error ? (
        <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        className="home1-checkout-continue"
        disabled={!selectedDate || !selectedTime}
      >
        <span>Continue to your details</span>
        <span className="home1-checkout-continue-arrow" aria-hidden="true">
          →
        </span>
      </button>
    </div>
  );
}
