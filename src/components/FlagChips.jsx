import React from "react";
import { LuFlame, LuStar } from "react-icons/lu";

// The two Eisenhower criteria as toggle buttons (icon only, labelled for screen readers)
const FlagChips = ({ task, onChange }) => (
  <div className="tm-chips">
    <button
      type="button"
      className="tm-chip tm-chip--urgent"
      aria-label="Urgent"
      title="Urgent"
      aria-pressed={task.urgent === true}
      onClick={() => onChange("urgent", task.urgent !== true)}
    >
      <LuFlame />
    </button>
    <button
      type="button"
      className="tm-chip tm-chip--important"
      aria-label="Important"
      title="Important"
      aria-pressed={task.important === true}
      onClick={() => onChange("important", task.important !== true)}
    >
      <LuStar />
    </button>
  </div>
);

// Offered when the due date is close; the user decides whether to accept
export const UrgentSuggestion = ({ onAccept, compact = false }) => (
  <div className={`tm-suggest${compact ? " tm-suggest--compact" : ""}`}>
    <LuFlame aria-hidden="true" />
    <span>{compact ? "Due soon" : "Due soon. Mark as urgent?"}</span>
    <button type="button" className="tm-btn tm-btn--sm" onClick={onAccept}>
      {compact ? "Urgent" : "Mark urgent"}
    </button>
  </div>
);

export default FlagChips;
