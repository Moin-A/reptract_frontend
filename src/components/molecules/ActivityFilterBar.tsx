"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { PillSelect } from "@/components/atoms/PillSelect";
import { GhostButton } from "@/components/atoms/GhostButton";

export const SHOW_OPTIONS = ["all activities", "my activities", "team activities"];
export const WHEN_OPTIONS = ["past 2 days", "today", "past week", "past 30 days"];

type User = { id: number | string; name: string };

type Props = {
  show: number;
  by: string;
  when: number;
  users: User[];
  onShowChange: (v: number) => void;
  onByChange: (v: string) => void;
  onWhenChange: (v: number) => void;
  onReset: () => void;
};

export function ActivityFilterBar({ show, by, when, users, onShowChange, onByChange, onWhenChange, onReset }: Props) {
  return (
    <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", borderBottom: `1px solid ${C.line}` }}>
      <PillSelect value={show} onChange={v => onShowChange(Number(v))} options={SHOW_OPTIONS.map((o, i) => ({ label: o, value: i }))} />
      <PillSelect value={by} onChange={onByChange} options={users.map(u => ({ label: u.name, value: u.id }))} placeholder="anyone" />
      <PillSelect value={when} onChange={v => onWhenChange(Number(v))} options={WHEN_OPTIONS.map((o, i) => ({ label: o, value: i }))} />
      <span style={{ flex: 1 }} />
      <GhostButton onClick={onReset}>Reset</GhostButton>
    </div>
  );
}
