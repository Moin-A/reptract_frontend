import { C } from "@/components/organisms/dashboard/tokens";

export type AddressIds = { id?: string; street1: string; street2: string; city: string; state: string; zip: string; country: string };

export function readAddr(ids: AddressIds, type: string) {
  const v = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
  return {
    id:         ids.id ? (v(ids.id) || undefined) : undefined,
    address_type: type,
    street1: v(ids.street1),
    street2: v(ids.street2),
    city:    v(ids.city),
    state:   v(ids.state),
    zipcode: v(ids.zip),
    country: v(ids.country),
  };
}

export function focusInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.accent;
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,91,31,0.12)";
}

export function blurInput(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = C.line;
  e.currentTarget.style.boxShadow = "none";
}
