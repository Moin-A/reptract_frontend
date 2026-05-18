import { C } from "@/components/organisms/dashboard/tokens";
import { FormInput } from "@/components/atoms/FormInput";
import { CountrySelect } from "@/components/atoms/CountrySelect";

export type AddressIds = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export function AddressGroup({ title, icon, ids, disabled, onInput }: {
  title: string;
  icon: React.ReactNode;
  ids: AddressIds;
  disabled?: boolean;
  onInput?: () => void;
}) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, background: "white" }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        {icon}{title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <FormInput id={ids.street1} disabled={disabled} placeholder="Street address" onInput={onInput} />
        <FormInput id={ids.street2} disabled={disabled} placeholder="Apt, suite, etc." onInput={onInput} />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
          <FormInput id={ids.city}  disabled={disabled} placeholder="City"  onInput={onInput} />
          <FormInput id={ids.state} disabled={disabled} placeholder="State" onInput={onInput} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
          <FormInput id={ids.zip} disabled={disabled} placeholder="ZIP" onInput={onInput} />
          <CountrySelect id={ids.country} disabled={disabled} onChange={onInput} />
        </div>
      </div>
    </div>
  );
}
