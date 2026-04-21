import { Check } from "lucide-react";
import { C } from "./tokens";

export type Task = {
  id: number;
  name: string;
  due: string;
  overdue: boolean;
  badge: string;
  badgeColor: string;
  badgeTextColor: string;
  done: boolean;
};

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  isLast?: boolean;
};

export function TaskItem({ task, onToggle, isLast = false }: TaskItemProps) {
  const nameColor  = task.overdue && !task.done ? C.err : C.ink;
  const dueColor   = task.overdue && !task.done ? C.err : C.muted;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 0",
      borderBottom: isLast ? "none" : `1px solid ${C.line}`,
      opacity: task.done ? 0.45 : 1,
    }}>
      {/* Checkbox */}
      <button
        role="checkbox"
        aria-checked={task.done}
        aria-label={`Mark "${task.name}" as ${task.done ? "incomplete" : "complete"}`}
        onClick={() => onToggle(task.id)}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2,
          cursor: "pointer", display: "grid", placeItems: "center",
          background: task.done ? C.ok : "transparent",
          border: task.done ? `1.5px solid ${C.ok}` : `1.5px solid ${C.ink2}`,
          transition: "background 140ms, border-color 140ms",
        }}
      >
        {task.done && <Check size={10} color="white" strokeWidth={3} />}
      </button>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: nameColor, textDecoration: task.done ? "line-through" : "none" }}>
          {task.name}
        </div>
        <div style={{ fontSize: 12, color: dueColor, marginTop: 2 }}>{task.due}</div>
      </div>

      {/* Category badge */}
      <span style={{
        display: "inline-flex", alignItems: "center",
        fontSize: 11, fontWeight: 600, padding: "3px 9px",
        borderRadius: 100, flexShrink: 0,
        background: task.badgeColor, color: task.badgeTextColor,
      }}>
        {task.badge}
      </span>
    </div>
  );
}
