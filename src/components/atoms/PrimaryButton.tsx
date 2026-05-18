import { C } from "@/components/organisms/dashboard/tokens";

export function PrimaryButton({ style, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        background: C.accent, color: "white", border: `1px solid ${C.accent}`,
        cursor: "pointer", ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
