import { FormRow } from "@/components/atoms/FormRow";
import { FormField } from "@/components/atoms/FormField";
import { FormInput } from "@/components/atoms/FormInput";

type FieldConfig = { label: string; placeholder?: string; type?: string };

export function FormInputGroup({ fields, values, setters, columns }: {
  fields: readonly FieldConfig[];
  values: string[];
  setters: ((v: string) => void)[];
  columns: string;
}) {
  return (
    <FormRow columns={columns}>
      {fields.map((f, i) => (
        <FormField key={f.label} label={f.label}>
          <FormInput type={f.type} value={values[i]} onChange={e => setters[i](e.target.value)} placeholder={f.placeholder} />
        </FormField>
      ))}
    </FormRow>
  );
}
