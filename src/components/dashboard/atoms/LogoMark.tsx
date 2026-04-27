import { Dumbbell } from "lucide-react";
import { C } from "../tokens";

export function LogoMark() {
  return (
    <div style={{ width: 30, height: 30, background: C.accent, borderRadius: 7, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Dumbbell size={16} color="white" />
    </div>
  );
}
