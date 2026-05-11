"use client";
import { C } from "@/components/dashboard/tokens";

type Props = {
  name: string;
  acct: string;
  daysAgo: number;
  user: string;
  amt: string;
  prob: number;
};

export function OppRowInfo({ name, acct, daysAgo, user, amt, prob }: Props) {
  return (
    <>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontSize: 12.5, color: C.muted }}>
          from <a href="#" onClick={e => e.preventDefault()} style={{ color: C.accent }}>{acct}</a> · added {daysAgo} days ago by {user}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: "right", minWidth: 120 }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{amt}</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{prob}% probability</div>
      </div>
    </>
  );
}
