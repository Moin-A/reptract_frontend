import { C } from "@/components/organisms/dashboard/tokens";

type IconTone = "create" | "move" | "email" | "note" | "signup" | "delete" | "default";

const TONE_STYLES: Record<IconTone, { bg: string; border: string; color: string }> = {
  create:  { bg: "#ECFDF5", border: "#BBF7D0", color: "#065F46" },
  move:    { bg: "#F3E8FF", border: "#DDD6FE", color: "#6D28D9" },
  email:   { bg: "#DBEAFE", border: "#BFDBFE", color: "#1D4ED8" },
  note:    { bg: "#FEF3C7", border: "#FDE68A", color: "#92400E" },
  signup:  { bg: "#FFEDD5", border: "#FED7AA", color: "#C2410C" },
  delete:  { bg: "#FEE2E2", border: "#FECACA", color: "#991B1B" },
  default: { bg: "#F3F1EC", border: "#E7E4DE", color: "#6B6B70" },
};

const TONE_ICONS: Record<IconTone, React.ReactNode> = {
  create: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  move: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  email: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
    </svg>
  ),
  note: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 14h6M9 17h4"/>
    </svg>
  ),
  signup: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>
    </svg>
  ),
  delete: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
    </svg>
  ),
  default: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
};

import { type ActivityEntry } from "@/lib/types";
export type { ActivityEntry };

export function ActivityItem({ tone, actor, action, object, objectHref, suffix, metaTag, metaExtra, time }: ActivityEntry) {
  const ts = TONE_STYLES[tone];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "32px 1fr auto",
      gap: 12,
      alignItems: "flex-start",
      padding: "10px 0",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: `1px solid ${ts.border}`,
        background: ts.bg,
        color: ts.color,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
      }}>
        {TONE_ICONS[tone]}
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.45 }}>
          <b style={{ fontWeight: 600 }}>{actor}</b>{" "}
          <span style={{ color: C.muted }}>{action}</span>
          {object && (
            <>{" "}<a href={objectHref ?? "#"} style={{ color: C.accent, fontWeight: 500, textDecoration: "none" }}>{object}</a></>
          )}
          {suffix && <span style={{ color: C.muted }}> {suffix}</span>}
        </div>
        {(metaTag || metaExtra) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            {metaTag && (
              <span style={{
                display: "inline-flex", alignItems: "center",
                padding: "0px 6px", borderRadius: 20,
                background: C.bg, border: `1px solid ${C.line}`,
                fontSize: 10, fontWeight: 500, color: C.muted,
              }}>{metaTag}</span>
            )}
            {metaTag && metaExtra && <span style={{ fontSize: 12, color: C.muted2 }}>·</span>}
            {metaExtra && <span style={{ fontSize: 12, color: C.muted2 }}>{metaExtra}</span>}
          </div>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: C.muted2, whiteSpace: "nowrap", paddingTop: 2 }}>
        {time}
      </div>
    </div>
  );
}
