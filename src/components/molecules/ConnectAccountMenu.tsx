"use client";

import { useEffect, useRef, useState } from "react";
import type { PlatformKey } from "@/lib/types";
import { PLATFORMS } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";

type Field = { key: string; label: string; placeholder: string; required?: boolean; secret?: boolean };

// Per-network credential fields (from the design; keys match what the backend
// adapters expect in SocialAccount#credentials).
const CONNECT_FIELDS: Record<PlatformKey, Field[]> = {
  facebook: [
    { key: "page_id",      label: "Facebook Page ID",    placeholder: "e.g. 1029384756",          required: true },
    { key: "access_token", label: "Facebook Page Token", placeholder: "EAAB… page access token",  required: true, secret: true },
  ],
  instagram: [
    { key: "business_id",  label: "Instagram Business ID", placeholder: "e.g. 17841400000000000", required: true },
    { key: "access_token", label: "Access Token",          placeholder: "IGQ… access token",      required: true, secret: true },
  ],
  x: [
    { key: "handle",  label: "Handle",  placeholder: "@yourhandle",      required: true },
    { key: "api_key", label: "API Key", placeholder: "Consumer API key", required: true, secret: true },
  ],
  mastodon: [
    { key: "base_url",     label: "Instance URL", placeholder: "https://mastodon.social", required: true },
    { key: "handle",       label: "Handle",       placeholder: "@you@instance",           required: true },
    { key: "access_token", label: "Access Token", placeholder: "write-scoped token",      required: true, secret: true },
  ],
};

const HINTS: Partial<Record<PlatformKey, string>> = {
  facebook:  "Graph API → your Page's ID and a Page access token with pages_manage_posts.",
  mastodon:  "Preferences → Development → New application (write scope) on your instance.",
  instagram: "Requires an Instagram Business account linked to a Facebook Page.",
  x:         "From the X developer portal (posting support coming soon).",
};

export type ConnectedAccountPayload = {
  id: number;
  platform_tag: string;
  label: string;
  active: boolean;
  connected_at: string | null;
  metadata?: Record<string, unknown>;
};

type Props = { onConnected: (account: ConnectedAccountPayload) => void };

/** "+ Connect account" button with the network-picker dropdown and per-network
 *  credentials form (credentials go straight to the backend, stored encrypted). */
export function ConnectAccountMenu({ onConnected }: Props) {
  const [open, setOpen] = useState(false);
  const [net, setNet] = useState<PlatformKey | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [missingKey, setMissingKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  function close() {
    setOpen(false); setNet(null); setValues({}); setMissingKey(null); setError(null);
  }

  // Outside click closes the menu (as in the design). Listen on mousedown —
  // it fires before React re-renders, so a click that swaps picker → form
  // doesn't hit the listener with an already-detached target (which would
  // read as "outside" and close the menu immediately).
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (!target.isConnected) return;
      if (rootRef.current && !rootRef.current.contains(target)) close();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function deriveLabel(platform: PlatformKey, v: Record<string, string>): string {
    return v.handle?.trim()
      || (v.page_id ? `Page ${v.page_id}` : "")
      || (v.business_id ? `IG ${v.business_id}` : "")
      || (v.base_url ? v.base_url.replace(/^https?:\/\//, "") : "")
      || PLATFORMS[platform].label;
  }

  async function connect() {
    if (!net) return;
    const fields = CONNECT_FIELDS[net];
    const firstMissing = fields.find(f => f.required && !values[f.key]?.trim());
    if (firstMissing) { setMissingKey(firstMissing.key); return; }

    setBusy(true); setError(null);
    const res = await fetch("/api/campaign/social_accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform_tag: net, label: deriveLabel(net, values), credentials: values }),
    });
    const data = await res.json().catch(() => null);
    setBusy(false);
    if (!res.ok) {
      setError(Array.isArray(data?.errors) ? data.errors.join(", ") : "Couldn't connect the account.");
      return;
    }
    onConnected(data as ConnectedAccountPayload);
    close();
  }

  const fieldLabel: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: C.muted,
    textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px",
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button className="cc-connect" onClick={() => (open ? close() : setOpen(true))} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%",
        padding: 10, borderRadius: 10, border: `1.5px dashed ${C.line2}`, background: "transparent",
        color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>+ Connect account</button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 60,
          background: C.surface, border: `1px solid ${C.line}`, borderRadius: 11, padding: 6,
          boxShadow: "0 16px 34px -8px rgba(0,0,0,0.18)",
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, padding: "6px 8px 8px" }}>
            {net ? `Connect ${PLATFORMS[net].label}` : "Choose a network"}
          </div>

          {!net && (Object.keys(CONNECT_FIELDS) as PlatformKey[]).map(key => (
            <div key={key} className="cc-row" onClick={() => setNet(key)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 8, cursor: "pointer",
            }}>
              <PlatformBadge platform={key} size={28} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: 1 }}>{PLATFORMS[key].label}</span>
              <span style={{ fontSize: 11.5, color: C.accent, fontWeight: 600 }}>Connect</span>
            </div>
          ))}

          {net && (
            <div style={{ padding: "6px 8px 8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>
                <PlatformBadge platform={net} size={26} />
                <span>{PLATFORMS[net].label}</span>
              </div>

              {CONNECT_FIELDS[net].map((f, i, arr) => (
                <div key={f.key}>
                  <label style={fieldLabel}>{f.label}{f.required && <span style={{ color: C.err }}> *</span>}</label>
                  <input
                    className="cc-field"
                    type={f.secret ? "password" : "text"}
                    placeholder={f.placeholder}
                    autoComplete="off"
                    value={values[f.key] ?? ""}
                    onChange={e => { setValues(v => ({ ...v, [f.key]: e.target.value })); if (missingKey === f.key) setMissingKey(null); }}
                    onKeyDown={e => { if (e.key === "Enter" && i === arr.length - 1) connect(); }}
                    style={{
                      width: "100%", height: 38, borderRadius: 8, padding: "0 11px", fontSize: 13.5,
                      fontFamily: "inherit", color: C.ink, background: C.surface, marginBottom: 10,
                      border: `1px solid ${missingKey === f.key ? C.err : C.line}`, outline: "none",
                    }}
                  />
                </div>
              ))}

              {HINTS[net] && <div style={{ fontSize: 11, color: C.muted2, lineHeight: 1.45, marginBottom: 4 }}>{HINTS[net]}</div>}
              {error && <div style={{ fontSize: 11.5, color: C.err, lineHeight: 1.45, marginBottom: 4 }}>{error}</div>}

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="cc-btn" onClick={close} style={{
                  flex: "none", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.line}`,
                  background: C.surface, fontSize: 12.5, fontWeight: 600, color: C.muted, cursor: "pointer",
                }}>Cancel</button>
                <button className="cc-btn" onClick={connect} disabled={busy} style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.accent}`,
                  background: C.accent, color: "#fff", fontSize: 12.5, fontWeight: 600,
                  cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1,
                }}>{busy ? "Connecting…" : "Connect"}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
