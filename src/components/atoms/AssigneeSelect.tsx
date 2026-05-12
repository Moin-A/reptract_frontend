"use client";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { SelectWrap } from "./SelectWrap";
import { baseSelect } from "./formStyles";
import { focusInput, blurInput } from "./formHelpers";

type Props = {
  value:    string;
  onChange: (v: string) => void;
};

export function AssigneeSelect({ value, onChange }: Props) {
  const { users } = useDashboard();
  return (
    <SelectWrap>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
        <option value="">Unassigned</option>
        {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
      </select>
    </SelectWrap>
  );
}
