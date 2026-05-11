import { C } from "@/components/dashboard/tokens";

export function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.accent;
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,91,31,0.12)";
}

export function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.line;
  e.currentTarget.style.boxShadow = "none";
}
