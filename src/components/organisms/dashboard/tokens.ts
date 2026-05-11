export const C = {
  bg:          "#F3F1EC",
  surface:     "#FFFFFF",
  ink:         "#0B0B0C",
  ink2:        "#1A1A1C",
  muted:       "#6B6B70",
  muted2:      "#9A9AA0",
  line:        "#E7E4DE",
  line2:       "#2A2A2D",
  accent:      "#FF5B1F",
  ok:          "#1F9D55",
  warn:        "#E0A82E",
  err:         "#D84A3F",
  sidebarBg:   "#F7F6F3",
  navHoverBg:  "#1A1A1C",
  navActiveBg: "#1F1F22",
} as const;

export type StatusVariant = "new" | "active" | "closed" | "lost";

export const STATUS_STYLES: Record<StatusVariant, { bg: string; color: string }> = {
  new:    { bg: "#EEF2FF", color: "#3730A3" },
  active: { bg: "#ECFDF5", color: "#065F46" },
  closed: { bg: "#F0FFF4", color: "#15803D" },
  lost:   { bg: "#FEF2F2", color: "#991B1B" },
};
