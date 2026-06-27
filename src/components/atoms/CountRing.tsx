import { C } from "@/components/organisms/dashboard/tokens";

type Props = { used: number; limit: number };

/** Character-budget ring: shows remaining chars + a progress arc. */
export function CountRing({ used, limit }: Props) {
  const pct = Math.min(used / limit, 1);
  const over = used > limit;
  const r = 9, circ = 2 * Math.PI * r;
  const color = over ? C.err : pct > 0.9 ? C.warn : C.muted2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12, color, fontVariantNumeric: "tabular-nums", fontWeight: over ? 700 : 400 }}>{limit - used}</span>
      <svg width="22" height="22">
        <circle cx="11" cy="11" r={r} fill="none" stroke={C.line} strokeWidth="2.5" />
        <circle cx="11" cy="11" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} transform="rotate(-90 11 11)"
          style={{ transition: "stroke-dashoffset .25s ease, stroke .25s ease" }} />
      </svg>
    </div>
  );
}
