import React, { useEffect, useRef, useState } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuCalendar,
  LuCheck,
  LuChevronDown,
  LuListChecks,
  LuPencilLine,
  LuPlus,
  LuStickyNote,
  LuTrash2,
} from "react-icons/lu";
import FlagChips, { UrgentSuggestion } from "./FlagChips.jsx";
import DatePicker from "./DatePicker.jsx";
import { confirmAction } from "../dialogs.js";
import { dueInfo, formatStamp, isDone, progressOf, suggestsUrgent, uid } from "../store.js";

/* ---------- subtask (editing state is local, not in the data) ---------- */

const SubtaskRow = ({ taskId, sub, actions }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(sub.note);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("");

  const patch = (p) => actions.updateSubtask(taskId, sub.id, p);

  const startEdit = () => {
    setDraft(sub.note);
    setStatus("");
    setEditing(true);
  };

  const save = () => {
    patch({ note: draft.trim() }); // empty note is allowed: clears the note
    setEditing(false);
  };

  // "# text." in the note becomes a checklist item (keeps what was already checked)
  const makeChecklist = () => {
    const texts = [...draft.matchAll(/#\s*(.+?)\./g)].map((m) => m[1].trim()).filter(Boolean);
    if (!texts.length) {
      setStatus("No items found. Write in the format # item.");
      return;
    }
    const before = new Map(sub.checklist.map((c) => [c.text, c.done]));
    patch({
      note: draft.trim(),
      checklist: texts.map((text) => ({ id: uid(), text, done: before.get(text) ?? false })),
    });
    setStatus(`${texts.length} ${texts.length === 1 ? "item converted" : "items converted"} to checklist.`);
  };

  const toggleCheck = (id) =>
    patch({
      checklist: sub.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    });

  const remove = async () => {
    if (await confirmAction("Delete subtask", `Delete "${sub.name}"?`)) {
      actions.deleteSubtask(taskId, sub.id);
    }
  };

  return (
    <li className="tm-sub">
      <div className="tm-row">
        <button
          type="button"
          role="checkbox"
          aria-checked={sub.completed}
          aria-label={sub.completed ? "Reopen subtask" : "Complete subtask"}
          className="tm-check tm-check--sm"
          onClick={() => patch({ completed: !sub.completed })}
        >
          {sub.completed && <LuCheck />}
        </button>
        <span className={`tm-sub-name${sub.completed ? " is-done" : ""}`}>{sub.name}</span>
        <button
          type="button"
          className="tm-icon-btn tm-icon-btn--sm"
          aria-label={editing ? "Close note" : "Edit note"}
          onClick={editing ? () => setEditing(false) : startEdit}
        >
          <LuPencilLine />
        </button>
        <button
          type="button"
          className="tm-icon-btn tm-icon-btn--sm"
          aria-label="Delete subtask"
          onClick={remove}
        >
          <LuTrash2 />
        </button>
      </div>

      {editing && (
        <div className="tm-edit">
          <textarea
            className="tm-field"
            value={draft}
            placeholder="Write a note"
            aria-label="Subtask note"
            onChange={(e) => setDraft(e.target.value)}
          />
          <p className="tm-hint" role="status">
            {status || "Tip: write # item. to create a checklist."}
          </p>
          <div className="tm-actions">
            <button type="button" className="tm-btn tm-btn--primary tm-btn--sm" onClick={save}>
              Save note
            </button>
            <button type="button" className="tm-btn tm-btn--sm" onClick={makeChecklist}>
              <LuListChecks /> Generate checklist
            </button>
            <button type="button" className="tm-btn tm-btn--sm" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!editing && sub.note && (
        <button
          type="button"
          className={`tm-note${expanded ? "" : " is-clamped"}`}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {sub.note}
        </button>
      )}

      {sub.checklist.length > 0 && (
        <ul className="tm-checklist">
          {sub.checklist.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={c.done}
                className="tm-checkitem"
                onClick={() => toggleCheck(c.id)}
              >
                <span className="tm-check tm-check--xs">{c.done && <LuCheck />}</span>
                <span className={c.done ? "is-done" : ""}>{c.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

/* ---------- task ---------- */

const TaskItem = ({ task, actions, reorder = false, isFirst = false, isLast = false }) => {
  const [open, setOpen] = useState(false);
  const [subName, setSubName] = useState("");
  
  // Estados para edição do nome
  const [nameDraft, setNameDraft] = useState(task.name);
  const [editingName, setEditingName] = useState(false);
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const rootRef = useRef(null);
  const moved = useRef(false);

  const done = isDone(task);
  const { total, completed, percent } = progressOf(task);
  const hasNotes = task.subtasks.some((s) => s.note.trim());
  const due = dueInfo(task);
  const suggest = suggestsUrgent(task) && !reorder;

  // Keep the rename field in sync if the name changes elsewhere
  useEffect(() => {
    setNameDraft(task.name);
  }, [task.name]);

  // After a move, keep the task in view
  useEffect(() => {
    if (moved.current) {
      moved.current = false;
      rootRef.current?.scrollIntoView({ block: "nearest" });
    }
  });

  const move = (dir) => {
    moved.current = true;
    actions.moveTask(task.id, dir);
  };

  const startEditName = () => {
    setNameDraft(task.name);
    setEditingName(true);
  };

  const commitName = (e) => {
    e?.preventDefault?.();
    const next = nameDraft.trim();
    if (next && next !== task.name) actions.renameTask(task.id, next);
    else setNameDraft(task.name); // empty or unchanged: restore
    setEditingName(false);
  };

  const submitSub = (e) => {
    e.preventDefault();
    if (actions.addSubtask(task.id, subName)) setSubName("");
  };

  const remove = async () => {
    if (await confirmAction("Delete task", `Delete "${task.name}" and its subtasks?`)) {
      actions.deleteTask(task.id);
    }
  };

  const showDetails = open && !reorder;

  return (
    <li ref={rootRef} className={`tm-card${done ? " is-done" : ""}`}>
      <div className="tm-row">
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={done ? "Reopen task" : "Complete task"}
          className="tm-check"
          onClick={() => actions.toggleDone(task.id)}
        >
          {done && <LuCheck />}
        </button>

        {/* Nome da tarefa ou Input de edição rápida */}
        {editingName ? (
          <form onSubmit={commitName} style={{ flex: 1, minWidth: 0 }}>
            <input
              className="tm-field"
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              autoFocus
              style={{ padding: '4px 8px', minHeight: '32px', fontSize: '15px', fontWeight: '600' }}
            />
          </form>
        ) : (
          <button
            type="button"
            className="tm-name"
            aria-expanded={showDetails}
            onClick={() => !reorder && setOpen((v) => !v)}
          >
            {task.name}
          </button>
        )}

        {reorder ? (
          <>
            <button
              type="button"
              className="tm-icon-btn"
              aria-label="Move up"
              disabled={isFirst}
              onClick={() => move(-1)}
            >
              <LuArrowUp />
            </button>
            <button
              type="button"
              className="tm-icon-btn"
              aria-label="Move down"
              disabled={isLast}
              onClick={() => move(1)}
            >
              <LuArrowDown />
            </button>
          </>
        ) : (
          <>
            {/* Botão de Editar Nome adicionado aqui */}
            <button
              type="button"
              className="tm-icon-btn"
              aria-label="Edit task name"
              onClick={startEditName}
            >
              <LuPencilLine />
            </button>
            <button
              type="button"
              className="tm-icon-btn"
              aria-label={open ? "Collapse" : "Expand"}
              onClick={() => setOpen((v) => !v)}
            >
              <LuChevronDown className={open ? "tm-flip" : ""} />
            </button>
            <button type="button" className="tm-icon-btn" aria-label="Delete task" onClick={remove}>
              <LuTrash2 />
            </button>
          </>
        )}
      </div>

      <div className="tm-meta">
        <FlagChips task={task} onChange={(k, v) => actions.setFlag(task.id, k, v)} />
        <button
          type="button"
          className={`tm-due tm-due--${due ? due.kind : "none"}`}
          aria-expanded={pickerOpen}
          aria-label={due ? `${due.label}. Change due date` : "Add due date"}
          onClick={() => setPickerOpen((v) => !v)}
        >
          <LuCalendar aria-hidden="true" /> {due ? due.label : "Add date"}
        </button>
        <span className="tm-count">
          {hasNotes && <LuStickyNote aria-label="Has notes" />}
          {total > 0 && `${completed}/${total}`}
        </span>
      </div>

      {pickerOpen && (
        <DatePicker
          value={task.dueDate}
          onChange={(key) => {
            actions.setDueDate(task.id, key);
            setPickerOpen(false);
          }}
        />
      )}

      {suggest && (
        <UrgentSuggestion onAccept={() => actions.setFlag(task.id, "urgent", true)} />
      )}

      {total > 0 && (
        <div
          className="tm-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
        >
          <i style={{ width: `${percent}%` }} />
        </div>
      )}

      {showDetails && (
        <>
          {/* Timestamps movidos para cá, mais discretos */}
          {(task.createdAt || task.completedAt) && (
            <dl className="tm-stamps" style={{ marginTop: '16px' }}>
              {task.createdAt && (
                <div>
                  <dt>Created</dt>
                  <dd>{formatStamp(task.createdAt)}</dd>
                </div>
              )}
              {task.completedAt && done && (
                <div>
                  <dt>Completed</dt>
                  <dd>{formatStamp(task.completedAt)}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="tm-subs">
            <form className="tm-add" onSubmit={submitSub}>
              <input
                className="tm-field"
                type="text"
                placeholder="New subtask"
                aria-label="New subtask"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
              />
              <button type="submit" className="tm-btn" aria-label="Add subtask">
                <LuPlus />
              </button>
            </form>
            {task.subtasks.length > 0 && (
              <ul className="tm-sublist">
                {task.subtasks.map((s) => (
                  <SubtaskRow key={s.id} taskId={task.id} sub={s} actions={actions} />
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;