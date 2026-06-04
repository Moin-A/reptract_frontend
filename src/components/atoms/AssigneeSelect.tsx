"use client";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { SelectWrap } from "./SelectWrap";
import { baseSelect } from "./formStyles";
import { focusInput, blurInput } from "./formHelpers";

type Props = {
  value:    string;
  onChange: (v: string) => void;
  useId?:   boolean;  // when true, emits String(user.id) instead of user.name
};

export function AssigneeSelect({ value, onChange, useId = false }: Props) {
  const { users } = useDashboard();
  return (
    <SelectWrap>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
        <option value="">Unassigned</option>
        {users.map(u => <option key={u.id} value={useId ? String(u.id) : u.name}>{u.name}</option>)}
      </select>
    </SelectWrap>
  );
}
