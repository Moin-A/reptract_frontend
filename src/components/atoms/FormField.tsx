import { C } from "@/components/organisms/dashboard/tokens";
import { fieldLabel } from "@/components/atoms/formStyles";

export function FormField({ label, required, children }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={fieldLabel}>
        {label}{required && <span style={{ color: C.err }}> *</span>}
      </label>
      {children}
    </div>
  );
}
