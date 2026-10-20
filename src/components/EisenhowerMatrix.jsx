import React, { useMemo, useState } from "react";
import FlagChips from "./FlagChips.jsx";
import { isDone, progressOf, quadrantOf } from "../store.js";

// Classic order: top row = important, left column = urgent
const QUADRANTS = [
  {
    key: "do",
    title: "Do now",
    hint: "Urgent and important",
    empty: "Nothing urgent here.",
  },
  {
    key: "plan",
    title: "Schedule",
    hint: "Important, not urgent",
    empty: "Nothing planned. Mark tasks as important, without urgency.",
    focus: true,
  },
  {
    key: "delegate",
    title: "Delegate",
    hint: "Urgent, not important",
    empty: "Nothing to delegate.",
  },
  {
    key: "drop",
    title: "Eliminate",
    hint: "Neither urgent nor important",
    empty: "Nothing to eliminate.",
  },
];

const MatrixTask = ({ task, selected, onSelect, actions }) => {
  const { total, completed } = progressOf(task);
  return (
    <li className="tm-mt">
      <button
        type="button"
        className="tm-mt-btn"
        aria-expanded={selected}
        onClick={onSelect}
      >
        <span className="tm-mt-name">{task.name}</span>
        {total > 0 && (
          <span className="tm-mt-meta">
            {completed}/{total}
          </span>
        )}
      </button>
      {selected && (
        <FlagChips
          task={task}
          onChange={(k, v) => actions.setFlag(task.id, k, v)}
        />
      )}
    </li>
  );
};

const EisenhowerMatrix = ({ tasks, actions }) => {
  const [selected, setSelected] = useState(null);

  const { groups, unsorted, doneCount } = useMemo(() => {
    const groups = { do: [], plan: [], delegate: [], drop: [] };
    const unsorted = [];
    let doneCount = 0;
    tasks.forEach((t) => {
      if (isDone(t)) doneCount += 1;
      else if (t.urgent === null || t.important === null) unsorted.push(t);
      else groups[quadrantOf(t)].push(t);
    });
    return { groups, unsorted, doneCount };
  }, [tasks]);

  return (
    <div>
      <p className="tm-lead">
        Focus your effort on Schedule: it's the important work that hasn't become urgent yet.
      </p>

      {unsorted.length > 0 && (
        <section className="tm-tray" aria-label="Unclassified tasks">
          <h3 className="tm-quad-title">Unclassified</h3>
          <p className="tm-quad-hint">
            Mark urgent and important to place them on the matrix.
          </p>
          <ul>
            {unsorted.map((t) => (
              <li key={t.id} className="tm-mt">
                <span className="tm-mt-name tm-mt-name--full">{t.name}</span>
                <FlagChips
                  task={t}
                  onChange={(k, v) => actions.setFlag(t.id, k, v)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="tm-matrix">
        {QUADRANTS.map((q) => (
          <section
            key={q.key}
            className={`tm-quad tm-quad--${q.key}`}
            aria-label={q.title}
          >
            <div className="tm-quad-head">
              <span className="tm-dot" aria-hidden="true" />
              <h3 className="tm-quad-title">{q.title}</h3>
              {q.focus && <span className="tm-focus">Focus</span>}
            </div>
            <p className="tm-quad-hint">{q.hint}</p>
            {groups[q.key].length ? (
              <ul>
                {groups[q.key].map((t) => (
                  <MatrixTask
                    key={t.id}
                    task={t}
                    actions={actions}
                    selected={selected === t.id}
                    onSelect={() =>
                      setSelected((cur) => (cur === t.id ? null : t.id))
                    }
                  />
                ))}
              </ul>
            ) : (
              <p className="tm-quad-empty">{q.empty}</p>
            )}
          </section>
        ))}
      </div>

      {doneCount > 0 && (
        <p className="tm-footnote">
          {doneCount}{" "}
          {doneCount === 1
            ? "completed task outside"
            : "completed tasks outside"}{" "}
          the matrix.
        </p>
      )}
    </div>
  );
};

export default EisenhowerMatrix;