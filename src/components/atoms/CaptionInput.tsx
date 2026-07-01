import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/** Multi-line caption field used by the campaign composer. */
export function CaptionInput({ value, onChange, placeholder }: Props) {
  return (
    <textarea
      className="cc-field"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", minHeight: 140, resize: "vertical", padding: 14, fontSize: 14.5,
        lineHeight: 1.55, color: C.ink, background: C.surface, border: `1px solid ${C.line}`,
        borderRadius: 12, fontFamily: "inherit",
      }}
    />
  );
}
