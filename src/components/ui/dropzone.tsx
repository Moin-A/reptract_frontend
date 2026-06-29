import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  onClick?: () => void;
  title?: string;
  subtitle?: string;
};

/** Dashed click/drop target for selecting media. Hover styling via `.cc-dropzone`. */
export function Dropzone({
  onClick,
  title = "Drop images here or click to upload",
  subtitle = "PNG, JPG, GIF up to 10MB · video coming soon",
}: Props) {
  return (
    <div className="cc-dropzone" onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "26px", border: `1.5px dashed ${C.line}`, borderRadius: 14, cursor: "pointer", marginBottom: 20,
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted2 }}>⬚</div>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.muted2 }}>{subtitle}</div>
    </div>
  );
}
