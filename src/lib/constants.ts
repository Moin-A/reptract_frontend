export const BILL_IDS = { id: "bid", street1: "b-street1", street2: "b-street2", city: "b-city", state: "b-state", zip: "b-zip", country: "b-country" };
export const SHIP_IDS = { id: "sid", street1: "s-street1", street2: "s-street2", city: "s-city", state: "s-state", zip: "s-zip", country: "s-country" };

export const PHONE_FIELDS = [
  { label: "Phone",     placeholder: "(555) 123-4567" },
  { label: "Toll-free", placeholder: "1-800-…" },
  { label: "Fax",       placeholder: "(555) 123-4568" },
] as const;

export const CONTACT_FIELDS = [
  { label: "Email",   placeholder: "hello@example.com", type: "email" },
  { label: "Website", placeholder: "https://example.com", type: "url"  },
] as const;
