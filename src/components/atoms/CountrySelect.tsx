import { SelectWrap } from "@/components/atoms/SelectWrap";
import { baseSelect } from "@/components/atoms/formStyles";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia"];

export function CountrySelect({ id, disabled, onChange }: {
  id: string;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <SelectWrap>
      <select
        id={id}
        disabled={disabled}
        style={{ ...baseSelect, opacity: disabled ? 0.5 : 1 }}
        onFocus={focusInput}
        onBlur={blurInput}
        onChange={onChange}
      >
        <option value="">Select a country</option>
        {COUNTRIES.map(c => <option key={c}>{c}</option>)}
      </select>
    </SelectWrap>
  );
}
