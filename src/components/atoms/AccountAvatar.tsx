"use client";

type Props = {
  name:  string;
  color: string;
};

function initials(name: string): string {
  const parts = name.replace(/[^A-Za-z\s\-]/g, "").trim().split(/[\s\-]+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function AccountAvatar({ name, color }: Props) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "-0.01em", flexShrink: 0, background: color }}>
      {initials(name)}
    </div>
  );
}
