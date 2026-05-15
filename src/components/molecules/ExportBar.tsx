import { ExportItem } from "@/components/atoms/ExportItem";

type ExportBarProps = {
  formats?: string[];
  onExport?: (format: string) => void;
};

const DEFAULT_FORMATS = ["XLS", "CSV", "RSS", "ATOM", "PERM"];

export function ExportBar({ formats = DEFAULT_FORMATS, onExport }: ExportBarProps) {
  return (
    <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", fontSize: 12 }}>
      {formats.map((fmt, i) => (
        <ExportItem key={fmt} label={fmt} first={i === 0} last={i === formats.length - 1} onClick={() => onExport?.(fmt)} />
      ))}
    </div>
  );
}
