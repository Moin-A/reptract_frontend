
  // Make sure the tokens file exists and exports 'C'

  import { C } from "../tokens"; // Update the path if tokens.ts is in the parent directory

  type HoverTaskType = {
    hovered: boolean,
    onEdit?: (id: number) => void,
    onDelete?: (id: number) => void,
    task: { id: number }
  };
  export const HoverAction = ({hovered, onEdit, onDelete, task}: HoverTaskType) => {

    return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      opacity: hovered ? 1 : 0,
      pointerEvents: hovered ? "auto" : "none",
          transition: "opacity 120ms",
      }}>
        <button
          onClick={() => onEdit && onEdit(task.id)}
          style={{ fontSize: 12, color: C.ink2, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Edit
        </button>
        <span style={{ color: C.line, fontSize: 12 }}>|</span>
        <button
          onClick={() => onDelete && onDelete(task.id)}
          style={{ fontSize: 12, color: C.err, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Delete
        </button>
      </div>
      )  
    }