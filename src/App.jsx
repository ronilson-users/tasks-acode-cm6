import React, { useState } from "react";
import {
  LuArrowUpDown,
  LuCalendar,
  LuCheck,
  LuLayoutGrid,
  LuListChecks,
  LuPlus,
  LuSave,
  LuX,
} from "react-icons/lu";
import TaskList from "./components/TaskList.jsx";
import Calendar from "./components/Calendar.jsx";
import EisenhowerMatrix from "./components/EisenhowerMatrix.jsx";
import { SORT_OPTIONS, isDone, useStoredState, useTasks } from "./store.js";

const App = ({ baseUrl = "", onClose }) => {
  const { tasks, actions } = useTasks();
  const [tab, setTab] = useState("list");
  const [name, setName] = useState("");
  const [storedSort, setSort] = useStoredState("task-manager:sort", "manual");
  const [reorder, setReorder] = useState(false);

  const sort = SORT_OPTIONS.some((o) => o.key === storedSort) ? storedSort : "manual";
  const openCount = tasks.filter((t) => !isDone(t)).length;
  const caption = openCount === 0 ? "Everything is up to date" : `${openCount} open`;

  const submit = (e) => {
    e.preventDefault();
    if (actions.addTask(name)) setName("");
  };

  const changeSort = (value) => {
    setSort(value);
    if (value !== "manual") setReorder(false);
  };

  // Reordering only makes sense in manual order, so turning it on switches to it
  const toggleReorder = () => {
    if (sort !== "manual") {
      setSort("manual");
      setReorder(true);
    } else {
      setReorder((v) => !v);
    }
  };

  return (
    <div className="tm-root">
      <div className="tm-grab" aria-hidden="true" />

      <header className="tm-head">
        <img
          className="tm-logo"
          src={`${baseUrl}assets/icon.png`}
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="tm-titles">
          <h2 className="tm-title">Task Manager</h2>
          <p className="tm-caption">{caption}</p>
        </div>
        <button type="button" className="tm-icon-btn" aria-label="Close" onClick={onClose}>
          <LuX />
        </button>
      </header>

      <div className="tm-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className="tm-tab"
          aria-selected={tab === "list"}
          onClick={() => setTab("list")}
        >
          <LuListChecks /> List
        </button>
        <button
          type="button"
          role="tab"
          className="tm-tab"
          aria-selected={tab === "calendar"}
          onClick={() => setTab("calendar")}
        >
          <LuCalendar /> Calendar
        </button>
        <button
          type="button"
          role="tab"
          className="tm-tab"
          aria-selected={tab === "matrix"}
          onClick={() => setTab("matrix")}
        >
          <LuLayoutGrid /> Matrix
        </button>
      </div>

      <div className="tm-body" role="tabpanel">
        {tab === "list" && (
          <>
            <form className="tm-add" onSubmit={submit}>
              <input
                className="tm-field"
                type="text"
                placeholder="New task"
                aria-label="New task"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="tm-btn tm-btn--primary" aria-label="Add task">
                <LuSave />
              </button>
            </form>

            {tasks.length > 1 && (
              <div className="tm-toolbar">
                <select
                  className="tm-field tm-select"
                  aria-label="Sort tasks"
                  value={sort}
                  onChange={(e) => changeSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="tm-btn"
                  aria-pressed={reorder}
                  onClick={toggleReorder}
                >
                  {reorder ? (
                    <>
                      <LuCheck /> Done
                    </>
                  ) : (
                    <>
                      <LuArrowUpDown /> Reorder
                    </>
                  )}
                </button>
              </div>
            )}

            <TaskList tasks={tasks} actions={actions} sort={sort} reorder={reorder && sort === "manual"} />
          </>
        )}
        {tab === "calendar" && <Calendar tasks={tasks} actions={actions} />}
        {tab === "matrix" && <EisenhowerMatrix tasks={tasks} actions={actions} />}
      </div>
    </div>
  );
};

export default App;
