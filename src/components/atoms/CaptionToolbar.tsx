import { C } from "@/components/organisms/dashboard/tokens";

const ITEMS = ["☺", "@", "#"];

/** Caption formatting shortcuts (emoji / mention / hashtag). */
export function CaptionToolbar() {
  return (
    <div style={{ display: "flex", gap: 14, color: C.muted2, fontSize: 16 }}>
      {ITEMS.map(item => (
        <span key={item} style={{ cursor: "pointer" }}>{item}</span>
      ))}
    </div>
  );
}
