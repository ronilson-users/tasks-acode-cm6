import React, { useMemo, useState } from "react";
import { LuCheck, LuChevronLeft, LuChevronRight, LuPlus } from "react-icons/lu";
import { LOCALE, dueInfo, isDone, parseKey, todayKey, toKey } from "../store.js";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longDay = (key) =>
  parseKey(key).toLocaleDateString(LOCALE, { weekday: "long", month: "long", day: "numeric" });

// Shows tasks by due date. Tasks live in the same store as the list and the matrix.
const Calendar = ({ tasks, actions }) => {
  const today = todayKey();
  const [cursor, setCursor] = useState(() => {
    const d = parseKey(todayKey());
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(today);
  const [text, setText] = useState("");

  const byDay = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      if (!map.has(t.dueDate)) map.set(t.dueDate, []);
      map.get(t.dueDate).push(t);
    });
    return map;
  }, [tasks]);

  const overdue = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate && !isDone(t) && t.dueDate < today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [tasks, today]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: lastDay }, (_, i) => i + 1)];

  const shiftMonth = (delta) => setCursor(new Date(year, month + delta, 1));

  const goTo = (key) => {
    const d = parseKey(key);
    setSelected(key);
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const dayTasks = [...(byDay.get(selected) ?? [])].sort((a, b) => isDone(a) - isDone(b));

  const submit = (e) => {
    e.preventDefault();
    if (actions.addTask(text, { dueDate: selected })) setText("");
  };

  return (
    <div>
      {overdue.length > 0 && (
        <section className="tm-overdue" aria-label="Overdue tasks">
          <h3 className="tm-agenda-title">Overdue</h3>
          <ul className="tm-agenda-list">
            {overdue.map((t) => (
              <li key={t.id}>
                <button type="button" className="tm-agenda-row" onClick={() => goTo(t.dueDate)}>
                  <span className="tm-agenda-name">{t.name}</span>
                  <span className="tm-due tm-due--overdue">{dueInfo(t).label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="tm-cal-head">
        <h3 className="tm-cal-title">
          {cursor.toLocaleDateString(LOCALE, { month: "long", year: "numeric" })}
        </h3>
        <button type="button" className="tm-btn tm-btn--sm" onClick={() => goTo(today)}>
          Today
        </button>
        <button
          type="button"
          className="tm-icon-btn"
          aria-label="Previous month"
          onClick={() => shiftMonth(-1)}
        >
          <LuChevronLeft />
        </button>
        <button
          type="button"
          className="tm-icon-btn"
          aria-label="Next month"
          onClick={() => shiftMonth(1)}
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
          const list = byDay.get(key) ?? [];
          const open = list.filter((t) => !isDone(t));
          const mark = !list.length
            ? null
            : open.length
              ? key < today
                ? "overdue"
                : "open"
              : "done";
          const classes = ["tm-day"];
          if (key === selected) classes.push("is-selected");
          if (key === today) classes.push("is-today");
          return (
            <button
              key={key}
              type="button"
              className={classes.join(" ")}
              aria-pressed={key === selected}
              aria-label={`${longDay(key)}${list.length ? `, ${list.length} due` : ""}`}
              onClick={() => setSelected(key)}
            >
              <span>{day}</span>
              {mark && <i className={`tm-day-ind tm-day-ind--${mark}`} />}
            </button>
          );
        })}
      </div>

      <section className="tm-agenda" aria-label={`Tasks due on ${longDay(selected)}`}>
        <h3 className="tm-agenda-title">{longDay(selected)}</h3>

        <form className="tm-add" onSubmit={submit}>
          <input
            className="tm-field"
            type="text"
            placeholder="New task for this day"
            aria-label="New task for this day"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="tm-btn" aria-label="Add task for this day">
            <LuPlus />
          </button>
        </form>

        {dayTasks.length === 0 ? (
          <p className="tm-quad-empty">Nothing due on this day.</p>
        ) : (
          <ul className="tm-agenda-list">
            {dayTasks.map((t) => (
              <li key={t.id} className={`tm-agenda-row${isDone(t) ? " is-done" : ""}`}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isDone(t)}
                  aria-label={isDone(t) ? "Reopen task" : "Complete task"}
                  className="tm-check"
                  onClick={() => actions.toggleDone(t.id)}
                >
                  {isDone(t) && <LuCheck />}
                </button>
                <span className="tm-agenda-name">{t.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Calendar;
