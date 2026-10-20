import React, { useMemo } from "react";
import TaskItem from "./TaskItem.jsx";
import { sortTasks } from "../store.js";

const TaskList = ({ tasks, actions, sort = "manual", reorder = false }) => {
  const visible = useMemo(() => sortTasks(tasks, sort), [tasks, sort]);

  if (!tasks.length) {
    return (
      <p className="tm-empty">No tasks yet. Write down what you need to do and tap Add.</p>
    );
  }

  return (
    <ul className="tm-list">
      {visible.map((task, i) => (
        <TaskItem
          key={task.id}
          task={task}
          actions={actions}
          reorder={reorder}
          isFirst={i === 0}
          isLast={i === visible.length - 1}
        />
      ))}
    </ul>
  );
};

export default TaskList;
