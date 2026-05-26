"use client";
import { useState, useRef, useEffect } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { fieldLabel } from "./formStyles";

export type PermValue = "private" | "everyone" | "some";

type Props = {
  value:    PermValue;
  onChange: (v: PermValue) => void;
  users:    string[];
  groups:   string[];
  onUsersChange:  (u: string[]) => void;
  onGroupsChange: (g: string[]) => void;
};


const OPTIONS: { value: PermValue; title: string; sub: string }[] = [
  { value: "private",  title: "Keep it private",                   sub: "Only you (and admins) can see this account." },
  { value: "everyone", title: "Share it with everyone",            sub: "All RepTrack users in your workspace can view this account." },
  { value: "some",     title: "Share it with the following people", sub: "Pick specific users and/or groups who can see this account." },
];

export function PermissionsField({ value, onChange, users, groups, onUsersChange, onGroupsChange }: Props) {
  const { users: allUsers, groups: rawGroups } = useDashboard();
  console.log({rawGroups})
  const usersDirectory  = [...new Set(allUsers.map(u => u.name))];
  const groupsDirectory = rawGroups.map(g => g.name);
  return (
    <div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 14 }}>
        Decide who else can see and edit this account.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {OPTIONS.map(opt => (
          <PermRadio
            key={opt.value}
            option={opt}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
          />
        ))}
      </div>

      {value === "some" && (
        <div style={{ marginTop: 10, padding: 14, background: "#FAFAF7", border: `1px solid ${C.line}`, borderRadius: 9, animation: "fadein 220ms ease" }}>
          <div style={{ marginBottom: 14, position: "relative" }}>
            <label style={fieldLabel}>Users</label>
            <ChipInput
              chips={users}
              onAdd={u => onUsersChange([...users, u])}
              onRemove={u => onUsersChange(users.filter(x => x !== u))}
              directory={usersDirectory}
              placeholder="Add a user…"
              inputId="perm-users-input"
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={fieldLabel}>Groups</label>
            <ChipInput
              chips={groups}
              onAdd={g => onGroupsChange([...groups, g])}
              onRemove={g => onGroupsChange(groups.filter(x => x !== g))}
              directory={groupsDirectory}
              placeholder="Add a group…"
              inputId="perm-groups-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PermRadio({ option, selected, onSelect }: { option: typeof OPTIONS[0]; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "10px 12px", border: `1px solid ${selected ? C.accent : C.line}`,
        borderRadius: 9, background: selected ? "#FFF8F4" : "white",
        boxShadow: selected ? `0 0 0 3px rgba(255,91,31,0.10)` : "none",
        cursor: "pointer", transition: "border-color 140ms, background 140ms",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = C.ink2; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = C.line; }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${selected ? C.accent : C.line2}`,
        flexShrink: 0, marginTop: 2, display: "grid", placeItems: "center",
        transition: "border-color 140ms",
      }}>
        {selected && (
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{option.title}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{option.sub}</div>
      </div>
    </div>
  );
}

type ChipInputProps = {
  chips:       string[];
  onAdd:       (v: string) => void;
  onRemove:    (v: string) => void;
  directory:   string[];
  placeholder: string;
  inputId:     string;
};

function ChipInput({ chips, onAdd, onRemove, directory, placeholder, inputId }: ChipInputProps) {
  const [query,    setQuery]    = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef  = useRef<HTMLDivElement>(null);

  const matches = directory
    .filter(d => !chips.includes(d) && d.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  useEffect(() => { setActiveIdx(0); }, [query]);

  function commit(val: string) {
    if (!val.trim() || chips.includes(val)) return;
    onAdd(val.trim());
    setQuery("");
    setShowDrop(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (showDrop && matches[activeIdx]) commit(matches[activeIdx]);
      else if (query.trim()) commit(query);
    } else if (e.key === "Backspace" && !query && chips.length) {
      onRemove(chips[chips.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setShowDrop(false);
    }
  }

  const isFocused = showDrop;

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          minHeight: 40, border: `1px solid ${isFocused ? C.accent : C.line}`,
          borderRadius: 9, padding: "6px 10px", display: "flex", flexWrap: "wrap",
          gap: 6, alignItems: "center", background: "white", cursor: "text",
          boxShadow: isFocused ? `0 0 0 3px rgba(255,91,31,0.12)` : "none",
          transition: "border-color 140ms, box-shadow 140ms",
        }}
      >
        {chips.map(chip => (
          <span key={chip} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "white", color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, padding: "3px 7px 3px 6px", fontSize: 12.5, fontWeight: 500 }}>
            <span
              onClick={e => { e.stopPropagation(); onRemove(chip); }}
              style={{ cursor: "pointer", color: C.muted, fontSize: 13, lineHeight: 1, display: "inline-flex", alignItems: "center" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = C.err; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = C.muted; }}
            >×</span>
            {chip}
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
          onFocus={() => setShowDrop(true)}
          onBlur={() => setTimeout(() => setShowDrop(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder={chips.length ? "" : placeholder}
          autoComplete="off"
          style={{ border: 0, outline: 0, fontSize: 13, fontFamily: "inherit", minWidth: 120, flex: 1, background: "transparent", color: C.ink }}
        />
      </div>

      {showDrop && matches.length > 0 && (
        <div
          ref={dropRef}
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "white", border: `1px solid ${C.line}`, borderRadius: 9,
            boxShadow: "0 14px 30px -6px rgba(0,0,0,0.12)",
            padding: 4, zIndex: 50, maxHeight: 200, overflowY: "auto",
          }}
        >
          {matches.map((m, i) => (
            <div
              key={m}
              onMouseDown={e => { e.preventDefault(); commit(m); }}
              style={{
                padding: "7px 10px", borderRadius: 6, fontSize: 13, cursor: "pointer",
                background: i === activeIdx ? "#FFF1E8" : "transparent",
                color: i === activeIdx ? C.accent : C.ink,
              }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
