"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  tags:     string[];
  onChange: (tags: string[]) => void;
  inputId:  string;
};

export function TagsInput({ tags, onChange, inputId }: Props) {
  const [tagInput, setTagInput] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(",", "");
      if (val && !tags.includes(val)) onChange([...tags, val]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      onClick={() => document.getElementById(inputId)?.focus()}
      style={{ minHeight: 40, border: `1px solid ${C.line}`, borderRadius: 9, padding: "6px 10px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", background: "white", cursor: "text" }}
    >
      {tags.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.ink, color: "white", borderRadius: 100, padding: "3px 10px 3px 12px", fontSize: 12, fontWeight: 500 }}>
          {t}
          <span
            onClick={() => onChange(tags.filter((_, j) => j !== i))}
            style={{ cursor: "pointer", opacity: 0.6, fontSize: 14, lineHeight: 1 }}
          >&times;</span>
        </span>
      ))}
      <input
        id={inputId}
        value={tagInput}
        onChange={e => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ border: 0, outline: 0, fontSize: 13, fontFamily: "inherit", minWidth: 120, background: "transparent", color: C.ink }}
        placeholder={tags.length ? "" : "Type and press Enter…"}
      />
    </div>
  );
}
