type AvatarProps = {
  initials: string;
  color: string;
  size?: number;
};

export function Avatar({ initials, color, size = 28 }: AvatarProps) {
  return (
    <div
      aria-label={initials}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color, color: "white",
        fontSize: Math.round(size * 0.4), fontWeight: 700,
        display: "grid", placeItems: "center", flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
