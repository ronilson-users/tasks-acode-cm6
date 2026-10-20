import { useEffect, useMemo, useState } from "react";

const KEY = "task-manager:tasks";
const LEGACY_KEY = "tasks"; // key from the previous version (migrated on first load)
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Change this to your own locale (e.g. "pt-BR") to localize dates.
export const LOCALE = "en-US";

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/* ---------- date helpers (due dates are local "YYYY-MM-DD" keys) ---------- */

const pad = (n) => String(n).padStart(2, "0");
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => toKey(new Date());
export const parseKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
// Days from a to b (positive when b is later)
export const dayDiff = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000);

export const addDays = (key, n) => {
  const d = parseKey(key);
  return toKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
};

export const formatDay = (key) => {
  const d = parseKey(key);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
};

export const formatStamp = (ms) =>
  new Date(ms).toLocaleDateString(LOCALE, { month: "short", day: "numeric", year: "numeric" });

const days = (n) => `${n} ${n === 1 ? "day" : "days"}`;

/* ---------- normalization / migration ---------- */

const normalizeChecklist = (items) =>
  (Array.isArray(items) ? items : []).map((c) =>
    typeof c === "string"
      ? { id: uid(), text: c, done: false }
      : { id: c.id ?? uid(), text: String(c.text ?? ""), done: !!c.done }
  );

const normalizeSubtask = (s = {}) => ({
  id: s.id ?? uid(),
  name: String(s.name ?? ""),
  completed: !!s.completed,
  note: String(s.note ?? ""),
  // "checkboxes" was the old field (list of strings)
  checklist: normalizeChecklist(s.checklist ?? s.checkboxes),
});

const normalizeTask = (t = {}) => ({
  id: t.id ?? uid(),
  name: String(t.name ?? "").trim() || "Untitled",
  done: !!t.done,
  // null = not classified in the matrix yet
  urgent: typeof t.urgent === "boolean" ? t.urgent : null,
  important: typeof t.important === "boolean" ? t.important : null,
  createdAt: Number.isFinite(t.createdAt) ? t.createdAt : null, // ms; null for tasks made before dates existed
  dueDate: typeof t.dueDate === "string" && DATE_RE.test(t.dueDate) ? t.dueDate : null,
  completedAt: Number.isFinite(t.completedAt) ? t.completedAt : null,
  subtasks: (Array.isArray(t.subtasks) ? t.subtasks : []).map(normalizeSubtask),
});

export const loadTasks = () => {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
  } catch (e) {
    console.error("[task-manager] failed to load tasks", e);
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("[task-manager] failed to save tasks", e);
  }
};

/* ---------- derived values ---------- */

export const isDone = (t) =>
  t.subtasks.length ? t.subtasks.every((s) => s.completed) : t.done;

export const progressOf = (t) => {
  const total = t.subtasks.length;
  const completed = t.subtasks.filter((s) => s.completed).length;
  return { total, completed, percent: total ? (completed / total) * 100 : 0 };
};

// Eisenhower quadrant from the two criteria the user marked
export const quadrantOf = (t) =>
  t.urgent ? (t.important ? "do" : "delegate") : t.important ? "plan" : "drop";

// The commitment status of a task: how it stands against its due date
export function dueInfo(t) {
  if (!t.dueDate) return null;
  if (isDone(t)) {
    if (!t.completedAt) return { kind: "done", label: `Was due ${formatDay(t.dueDate)}` };
    const late = dayDiff(t.dueDate, toKey(new Date(t.completedAt)));
    return late <= 0
      ? { kind: "ontime", label: "Done on time" }
      : { kind: "late", label: `Done ${days(late)} late` };
  }
  const left = dayDiff(todayKey(), t.dueDate);
  if (left < 0) return { kind: "overdue", label: `Overdue by ${days(-left)}` };
  if (left === 0) return { kind: "today", label: "Due today" };
  if (left === 1) return { kind: "soon", label: "Due tomorrow" };
  if (left <= 3) return { kind: "soon", label: `Due in ${days(left)}` };
  return { kind: "later", label: `Due ${formatDay(t.dueDate)}` };
}

// An open task that is not urgent yet but is overdue or due within 2 days
export const suggestsUrgent = (t) =>
  !!t.dueDate && !isDone(t) && t.urgent !== true && dayDiff(todayKey(), t.dueDate) <= 2;

/* ---------- sorting ---------- */

export const SORT_OPTIONS = [
  { key: "manual", label: "Manual order" },
  { key: "due", label: "Due date" },
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "name", label: "Name A to Z" },
];

// "manual" keeps the stored order (that is the order the user arranges).
// Other modes sort a copy and always send completed tasks to the end.
export function sortTasks(tasks, mode) {
  if (mode === "manual") return tasks;
  const index = new Map(tasks.map((t, i) => [t.id, i]));
  const by =
    {
      due: (a, b) => (a.dueDate ?? "9999-99-99").localeCompare(b.dueDate ?? "9999-99-99"),
      newest: (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
      oldest: (a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0),
      name: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    }[mode] ?? (() => 0);
  const cmp = (a, b) => by(a, b) || index.get(a.id) - index.get(b.id);
  return [...tasks.filter((t) => !isDone(t)).sort(cmp), ...tasks.filter(isDone).sort(cmp)];
}

/* ---------- small persisted preference (e.g. sort mode) ---------- */

export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

/* ---------- data hook (everything immutable) ---------- */

// Keeps completedAt in sync whenever a change flips a task between open and done
const withCompletion = (prev, next) => {
  const was = isDone(prev);
  const now = isDone(next);
  return was === now ? next : { ...next, completedAt: now ? Date.now() : null };
};

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const actions = useMemo(() => {
    const patchTask = (id, fn) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? withCompletion(t, fn(t)) : t)));

    return {
      addTask(name, extra = {}) {
        const n = name.trim();
        if (!n) return false;
        setTasks((prev) => [normalizeTask({ name: n, createdAt: Date.now(), ...extra }), ...prev]);
        return true;
      },
      renameTask(id, name) {
        const n = name.trim();
        if (!n) return false;
        patchTask(id, (t) => ({ ...t, name: n }));
        return true;
      },
      setDueDate: (id, key) =>
        patchTask(id, (t) => ({
          ...t,
          dueDate: typeof key === "string" && DATE_RE.test(key) ? key : null,
        })),
      // dir: -1 moves up, +1 moves down (in the stored order)
      moveTask: (id, dir) =>
        setTasks((prev) => {
          const i = prev.findIndex((t) => t.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= prev.length) return prev;
          const next = [...prev];
          [next[i], next[j]] = [next[j], next[i]];
          return next;
        }),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      toggleDone: (id) =>
        patchTask(id, (t) => {
          const next = !isDone(t);
          return {
            ...t,
            done: next,
            subtasks: t.subtasks.map((s) => ({ ...s, completed: next })),
          };
        }),
      // Touching either criterion classifies the task
      setFlag: (id, key, value) =>
        patchTask(id, (t) => ({
          ...t,
          urgent: t.urgent ?? false,
          important: t.important ?? false,
          [key]: value,
        })),
      addSubtask(id, name) {
        const n = name.trim();
        if (!n) return false;
        patchTask(id, (t) => ({
          ...t,
          subtasks: [...t.subtasks, normalizeSubtask({ name: n })],
        }));
        return true;
      },
      updateSubtask: (id, subId, patch) =>
        patchTask(id, (t) => ({
          ...t,
          subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, ...patch } : s)),
        })),
      deleteSubtask: (id, subId) =>
        patchTask(id, (t) => ({
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subId),
        })),
    };
  }, []);

  return { tasks, actions };
}
