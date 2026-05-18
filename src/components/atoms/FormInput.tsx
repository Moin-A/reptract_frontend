import { baseInput } from "@/components/atoms/formStyles";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";

export function FormInput({ disabled, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onFocus={focusInput}
      onBlur={blurInput}
      {...props}
      disabled={disabled}
      style={{ ...baseInput, opacity: disabled ? 0.5 : 1, ...style }}
    />
  );
}
