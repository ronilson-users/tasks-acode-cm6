import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { LOCALE, addDays, parseKey, todayKey, toKey } from "../store.js";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthOf = (key) => {
  const d = parseKey(key);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// Inline picker that follows the plugin theme (the native Android one does not).
// onChange receives "YYYY-MM-DD" or null (clear).
const DatePicker = ({ value, onChange }) => {
  const today = todayKey();
  const [cursor, setCursor] = useState(() => monthOf(value ?? today));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: lastDay }, (_, i) => i + 1)];

  const quick = [
    { label: "Today", key: today },
    { label: "Tomorrow", key: addDays(today, 1) },
    { label: "Next week", key: addDays(today, 7) },
  ];

  return (
    <div className="tm-picker">
      <div className="tm-chips">
        {quick.map((q) => (
          <button
            key={q.label}
            type="button"
            className="tm-chip tm-chip--pick"
            aria-pressed={value === q.key}
            onClick={() => onChange(q.key)}
          >
            {q.label}
          </button>
        ))}
        {value && (
          <button type="button" className="tm-chip" onClick={() => onChange(null)}>
            <LuX /> Clear
          </button>
        )}
      </div>

      <div className="tm-cal-head">
        <h3 className="tm-cal-title">
          {cursor.toLocaleDateString(LOCALE, { month: "long", year: "numeric" })}
        </h3>
        <button
          type="button"
          className="tm-icon-btn"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          className="tm-icon-btn"
          aria-label="Next month"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          <LuChevronRight />
        </button>
      </div>

      <div className="tm-cal-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="tm-weekday">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`blank-${i}`} />;
          const key = toKey(new Date(year, month, day));
          const classes = ["tm-day"];
          if (key === value) classes.push("is-selected");
          if (key === today) classes.push("is-today");
          return (
            <button
              key={key}
              type="button"
              className={classes.join(" ")}
              aria-pressed={key === value}
              aria-label={parseKey(key).toLocaleDateString(LOCALE, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              onClick={() => onChange(key)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
