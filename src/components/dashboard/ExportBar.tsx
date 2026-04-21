import { C } from "./tokens";

type ExportBarProps = {
  formats?: string[];
  onExport?: (format: string) => void;
};

const DEFAULT_FORMATS = ["XLS", "CSV", "RSS", "ATOM", "PERM"];

export function ExportBar({ formats = DEFAULT_FORMATS, onExport }: ExportBarProps) {
  return (
    <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", fontSize: 12 }}>
      {formats.map((fmt, i) => (
        <span
          key={fmt}
          onClick={() => onExport?.(fmt)}
          style={{
            color: C.muted, fontWeight: 500, cursor: "pointer",
            padding: i === 0 ? "0 8px 0 0" : "0 8px",
            borderRight: i < formats.length - 1 ? `1px solid ${C.line}` : "none",
          }}
        >
          {fmt}
        </span>
      ))}
    </div>
  );
}
