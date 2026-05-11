import { C } from "@/components/organisms/dashboard/tokens";

export function ChevronDown({ color = C.muted }: { color?: string }) {
  return (
    <svg
      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
