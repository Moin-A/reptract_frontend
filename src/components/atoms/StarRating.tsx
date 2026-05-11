"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  rating:   number;
  onChange: (n: number) => void;
};

export function StarRating({ rating, onChange }: Props) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, height: 40, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 12px", background: "white" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24"
          fill={(hovered || rating) >= i ? C.warn : "none"}
          stroke={(hovered || rating) >= i ? C.warn : C.line}
          strokeWidth="1.5"
          style={{ cursor: "pointer", transition: "fill 100ms, transform 100ms", transform: hovered === i ? "scale(1.15)" : "none" }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(rating === i ? 0 : i)}
        >
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 21.2l1.7-7L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
      {rating > 0 && (
        <span onClick={() => onChange(0)} style={{ fontSize: 11.5, color: C.muted, marginLeft: "auto", cursor: "pointer" }}>
          Clear
        </span>
      )}
    </div>
  );
}
