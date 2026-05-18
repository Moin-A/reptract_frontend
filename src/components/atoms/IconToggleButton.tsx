import { C } from "@/components/organisms/dashboard/tokens";

export function IconToggleButton({ active, title, onClick, children }: {
  active: boolean;
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 7,
        display: "grid", placeItems: "center",
        border: `1px solid ${C.line}`, cursor: "pointer",
        background: active ? C.ink : "white",
        color: active ? "white" : C.muted,
        transition: "all 120ms",
      }}
    >
      {children}
    </button>
  );
}
