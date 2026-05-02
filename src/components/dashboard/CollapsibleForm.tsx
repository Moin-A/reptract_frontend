"use client";
import { useRef, useState, useEffect } from "react";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { C } from "@/components/dashboard/tokens";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { type Task } from "./TaskItem";

const usersCache: Record<string, User[]> = {};

interface Props {
  open: boolean;
  onClose: () => void;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  name: string;
}

const selectStyle: React.CSSProperties = {
  width: "100%", height: 38, border: `1px solid ${C.line}`,
  borderRadius: 8, padding: "0 30px 0 12px", fontSize: 13,
  fontFamily: "inherit", background: "white", color: C.ink,
  appearance: "none", cursor: "pointer", outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: C.muted, display: "block", marginBottom: 6,
};

function ChevronDown() {
  return (
    <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const CollapsibleForm = ({ open, onClose }: Props) => {
  const { tasks, activeTab, setTasks } = useDashboard();

  const dueOptions: { [key: string]: Task[] } = tasks ?? {};
  const [users, setUsers] = useState<User[]>(usersCache[activeTab] ?? []);
  const nameRef = useRef<HTMLInputElement>(null);
  const dueRef = useRef<HTMLSelectElement>(null);
  const assignRef = useRef<HTMLSelectElement>(null);
  const catRef = useRef<HTMLSelectElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (usersCache[activeTab]) return;
    fetch("/api/users", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        usersCache[activeTab] = data;
        setUsers(data);
      });
  }, [activeTab]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!nameRef.current?.value.trim()) { nameRef.current?.focus(); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current.value.trim(),
          description: descRef.current?.value.trim() || null,
          bucket: dueRef.current?.value,
          assigned_to: assignRef.current?.value || null,
          category: catRef.current?.value || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const newTask = await res.json();
      setTasks(prev => ({ ...prev, [newTask.bucket]: [...(prev[newTask.bucket] || []), newTask] }));
      onClose();
    } catch {
      setError("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Collapsible open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <CollapsibleContent>
        <div style={{ borderBottom: `1px solid ${C.line}`, padding: "18px 20px", background: "#FAFAF7" }}>

          {/* Title row */}
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            Create Task
            <button onClick={onClose} style={{ color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 6px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              &times;
            </button>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Name <span style={{ color: C.err }}>*</span></label>
            <input
              ref={nameRef}
              type="text"
              placeholder="Task name…"
              style={{ width: "100%", height: 38, border: `1px solid ${C.accent}`, borderRadius: 8, padding: "0 12px", fontSize: 14, fontFamily: "inherit", outline: "none", background: "white", color: C.ink }}
              onFocus={e => { e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,91,31,0.15)"; }}
              onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Description</label>
            <input
              ref={descRef}
              type="text"
              placeholder="Optional description…"
              style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 8, padding: "0 12px", fontSize: 13, fontFamily: "inherit", outline: "none", background: "white", color: C.ink }}
              onFocus={e => { e.currentTarget.style.borderColor = C.accent; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.line; }}
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
            />
          </div>

          {/* 3-column row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 18 }}>

            <div>
              <label style={labelStyle}>Due</label>
              <div style={{ position: "relative" }}>
                <select ref={dueRef} style={selectStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.line; }}>
                  {Object.keys(dueOptions).map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Assign to</label>
              <div style={{ position: "relative" }}>
                <select ref={assignRef} style={selectStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.line; }}>
                  <option value="">Unassigned</option>
                  {users.map((u, i) => (
                    <option key={i} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <div style={{ position: "relative" }}>
                <select ref={catRef} style={selectStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = C.accent; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.line; }}>
                  <option value="">-- Select --</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="lunch">Lunch</option>
                  <option value="meeting">Meeting</option>
                  <option value="money">Money</option>
                  <option value="presentation">Presentation</option>
                  <option value="trip">Trip</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown />
              </div>
            </div>

          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={handleSubmit} disabled={submitting} style={{ display: "inline-flex", alignItems: "center", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.accent, color: "white", border: `1px solid ${C.accent}`, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit" }}>
              {submitting ? "Creating…" : "Create Task"}
            </button>
            <span style={{ fontSize: 13, color: C.muted }}>or</span>
            <button onClick={onClose} disabled={submitting} style={{ fontSize: 13, color: C.accent, fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
              Cancel
            </button>
            {error && <span style={{ fontSize: 12, color: C.err, marginLeft: 8 }}>{error}</span>}
          </div>

        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleForm;
