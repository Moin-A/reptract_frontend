"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { type Lead } from "@/lib/types";
import { LEAD_STATUS_MAP } from "./statuses";

type Props = {
  leads:     Lead[];
  onEdit:    (id: number) => void;
  onDelete:  (id: number) => void;
  onConvert: (id: number) => void;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= rating ? "#E0A82E" : "#E7E4DE"}
          style={{ flexShrink: 0 }}>
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function initials(lead: Lead) {
  return ((lead.first_name?.[0] ?? lead.name?.[0] ?? "") + (lead.last_name?.[0] ?? lead.name?.split(" ")[1]?.[0] ?? "")).toUpperCase();
}

export function LeadListView({ leads, onEdit, onDelete, onConvert }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (leads.length === 0) {
    return (
      <div style={{ padding: "32px 20px", fontSize: 13.5, color: C.muted, textAlign: "center" }}>
        No leads match your filters.
      </div>
    );
  }

  return (
    <div>
      {leads.map(lead => {
        const status    = LEAD_STATUS_MAP[lead.status] ?? LEAD_STATUS_MAP["new"];
        const isHovered = hoveredId === lead.id;
        const role      = [lead.title, lead.company].filter(Boolean).join(" at ");

        return (
          <div
            key={lead.id}
            onMouseEnter={() => setHoveredId(lead.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px", borderBottom: `1px solid ${C.line}`,
              cursor: "pointer",
              background: isHovered ? "#FAFAF7" : "transparent",
              transition: "background 120ms",
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: 38, flexShrink: 0,
              background: status.color, display: "grid", placeItems: "center",
              fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "-0.01em",
            }}>
              {initials(lead)}
            </div>

            {/* Status pill */}
            <span style={{
              flexShrink: 0, width: 96,
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 11px", borderRadius: 100,
              fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap",
              background: status.pillBg, color: status.pillColor,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: status.color, flexShrink: 0 }} />
              {status.label}
            </span>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <a href="#" onClick={e => { e.preventDefault(); onEdit(lead.id); }}
                  style={{ color: C.ink, textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.ink; }}
                >
                  {lead.first_name || lead.last_name ? `${lead.first_name} ${lead.last_name}`.trim() : lead.name}
                </a>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {role}
                {lead.referred_by && (
                  <span style={{ color: C.muted2 }}> — referred by {lead.referred_by}</span>
                )}
              </div>
            </div>

            {/* Star rating */}
            <Stars rating={lead.rating ?? 0} />

            {/* Hover action buttons */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
              opacity: isHovered ? 1 : 0,
              pointerEvents: isHovered ? "auto" : "none",
              transition: "opacity 120ms",
            }}>
              <ActionBtn
                label="Convert"
                color={C.ok}
                onClick={e => { e.stopPropagation(); onConvert(lead.id); }}
              />
              <span style={{ color: C.line, fontSize: 12 }}>|</span>
              <ActionBtn
                label="Edit"
                color={C.ink2}
                onClick={e => { e.stopPropagation(); onEdit(lead.id); }}
              />
              <span style={{ color: C.line, fontSize: 12 }}>|</span>
              <ActionBtn
                label="Delete"
                color={C.err}
                onClick={e => {
                  e.stopPropagation();
                  if (confirm(`Delete "${lead.name || `${lead.first_name} ${lead.last_name}`}"?`)) onDelete(lead.id);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      style={{ fontSize: 12, color, background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      {label}
    </button>
  );
}
