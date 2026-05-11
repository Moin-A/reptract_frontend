"use client";
import { SelectWrap } from "./SelectWrap";
import { baseSelect } from "./formStyles";
import { focusInput, blurInput } from "./formHelpers";

const ASSIGNEES = ["Admin (me)", "Marco Kent", "Priya Kumar", "Sam Rivera", "Aaron Assembler", "Cindy Cluster"];

type Props = {
  value:    string;
  onChange: (v: string) => void;
};

export function AssigneeSelect({ value, onChange }: Props) {
  return (
    <SelectWrap>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
        <option value="">Unassigned</option>
        {ASSIGNEES.map(a => <option key={a}>{a}</option>)}
      </select>
    </SelectWrap>
  );
}
