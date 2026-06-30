"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PlatformKey } from "@/lib/types";
import { ACCOUNTS, PLATFORMS, CARD_STYLE, type Post } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";
import { CampaignSectionLabel } from "@/components/atoms/CampaignSectionLabel";
import { CountRing } from "@/components/atoms/CountRing";
import { CaptionInput } from "@/components/atoms/CaptionInput";
import { CaptionToolbar } from "@/components/atoms/CaptionToolbar";
import { MediaThumbnail } from "@/components/atoms/MediaThumbnail";
import { Dropzone } from "@/components/ui/dropzone";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";


type Props = { editingPost?: Post | null; onSaved?: () => void };

export function CampaignComposer({ editingPost = null, onSaved }: Props) {
  // Initialised from editingPost. The parent remounts this via `key` when the
  // edited post changes, so these initial values are always correct.
  // (Existing media isn't loaded into the File upload slot — pick a new file to replace.)
  const [kind, setKind]         = useState<"post" | "ad">(editingPost?.kind === "ad" ? "ad" : "post");
  const [caption, setCaption]   = useState(editingPost?.content ?? editingPost?.body ?? "");
  const [link, setLink]         = useState(editingPost?.url ?? "");
  const [selected, setSelected] = useState<Set<PlatformKey>>(new Set(["mastodon", "x"]));
  const useFileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<FormError | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  // The post's already-uploaded image (display-only); a newly picked File takes precedence.
  const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(editingPost?.media?.[0]?.url ?? null);

  function resetForm() {
    setCaption(""); setLink(""); setKind("post"); setMedia(null); setExistingMediaUrl(null);
  }

  // Blob preview for a newly-picked File (revoked on change/unmount); otherwise
  // fall back to the existing image URL.
  const filePreview = useMemo(() => (media ? URL.createObjectURL(media) : null), [media]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const previewUrl = filePreview ?? existingMediaUrl;

  const limit = useMemo(() => {
    const limits = [...selected].map(p => PLATFORMS[p].limit);
    return limits.length ? Math.min(...limits) : 280;
  }, [selected]);

  const canPublish = caption.trim().length > 0 && selected.size > 0 && caption.length <= limit;

  function toggle(p: PlatformKey) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  }

  // Stage the chosen image locally — nothing is sent until "Save draft".
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      setError(null);
      setMedia(file);
    }
  }

  async function saveDraft(): Promise<void> {
    setError(null);
    const body = new FormData();
    body.append("campaign_post[content]", caption);
    body.append("campaign_post[kind]", kind);
    body.append("campaign_post[url]", link);
    if (media) body.append("campaign_post[media]", media);

    const editId = editingPost?.id;
    const response = await fetch(
      editId != null ? `/api/campaign/posts/${editId}` : "/api/campaign/posts",
      { method: editId != null ? "PATCH" : "POST", body },
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const detail = Array.isArray(data?.errors) ? data.errors.join(", ") : data?.error;
      setError({ title: editId != null ? "Couldn't update draft" : "Couldn't save draft", body: detail ?? "The server returned an error." });
      return;
    }
    resetForm();
    onSaved?.();
  }

  return (
    <section style={{ ...CARD_STYLE, overflow: "hidden" }}>
      <input type="file" accept="image/*" ref={useFileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

      {error && (
        <div style={{ padding: "16px 20px 0" }}>
          <FormErrorBanner error={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: C.accent }} /> New {kind}
        </div>
        <div style={{ display: "inline-flex", padding: 3, background: C.bg, borderRadius: 10, border: `1px solid ${C.line}` }}>
          {(["post", "ad"] as const).map(k => {
            const on = kind === k;
            return (
              <button key={k} className="cc-btn" onClick={() => setKind(k)} style={{
                padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, textTransform: "capitalize",
                background: on ? C.surface : "transparent",
                color: on ? (k === "ad" ? C.accent : C.ink) : C.muted,
                boxShadow: on ? "0 1px 2px rgba(0,0,0,.08)" : "none",
              }}>{k}</button>
            );
          })}
        </div>
      </header>

      {/* body — two columns */}
      <div className="cc-compose-grid" style={{ padding: 20 }}>
        {/* left: caption + media + link */}
        <div>
          <CaptionInput value={caption} onChange={setCaption} placeholder="What's happening at your gym? Write your caption…" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 2px 20px" }}>
            <CaptionToolbar />
            <CountRing used={caption.length} limit={limit} />
          </div>

          <CampaignSectionLabel>Media</CampaignSectionLabel>

          {previewUrl ? (
            <MediaThumbnail src={previewUrl} alt={media?.name} onRemove={() => { setMedia(null); setExistingMediaUrl(null); }} />
          ) : (
            <Dropzone onClick={() => useFileInputRef.current?.click()} />
          )}


          <CampaignSectionLabel>Link <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400, color: C.muted2 }}>(optional)</span></CampaignSectionLabel>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted2 }}>🔗</span>
            <input className="cc-field" value={link} onChange={e => setLink(e.target.value)} placeholder="https://reptrack.io/promo"
              style={{ width: "100%", padding: "11px 12px 11px 34px", fontSize: 14, color: C.ink, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, fontFamily: "inherit" }} />
          </div>
        </div>

        {/* right: publish targets */}
        <div>
          <CampaignSectionLabel count={`${selected.size} selected`}>Publish to</CampaignSectionLabel>
          <div style={{ background: "#FAFAF7", border: `1px solid ${C.line}`, borderRadius: 12, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            {ACCOUNTS.map(a => {
              const on = selected.has(a.platform);
              const disabled = !a.healthy;
              const meta = PLATFORMS[a.platform];
              const over = on && caption.length > meta.limit;
              return (
                <label key={a.platform} className="cc-target" style={{
                  display: "flex", alignItems: "center", gap: 10, padding: on ? 9 : 10, borderRadius: 9,
                  cursor: disabled ? "not-allowed" : "pointer",
                  border: on ? `1px solid ${C.accent}` : "1px solid transparent",
                  background: on ? C.surface : "transparent",
                  boxShadow: on ? "0 0 0 2px rgba(255,91,31,.10)" : "none",
                  opacity: disabled ? 0.55 : 1,
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: on ? C.accent : C.surface, border: `1.5px solid ${on ? C.accent : C.line2}`, color: "#fff", fontSize: 12,
                  }}>{on ? "✓" : ""}</span>
                  <PlatformBadge platform={a.platform} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{meta.label}</div>
                    <div style={{ fontSize: 11, color: over ? C.err : C.muted, fontWeight: over ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
                      {disabled ? "reconnect needed" : `${caption.length}/${meta.limit}`}
                    </div>
                  </div>
                  <input type="checkbox" checked={on} disabled={disabled} onChange={() => toggle(a.platform)} style={{ display: "none" }} />
                </label>
              );
            })}
          </div>

          <p style={{ fontSize: 11.5, color: C.muted, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, lineHeight: 1.45, display: "flex", gap: 7 }}>
            <span>ⓘ</span>
            <span>Need different text per platform? <span className="cc-link" style={{ color: C.ink2, cursor: "pointer", borderBottom: `1px solid ${C.line}` }}>Add per-platform overrides</span> after saving.</span>
          </p>
        </div>
      </div>

      {/* footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: `1px solid ${C.line}`, background: "#FAFAF7" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{editingPost ? "● Editing draft" : "● Draft — not saved"}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {editingPost && (
            <button className="cc-btn" onClick={() => { resetForm(); onSaved?.(); }} style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.surface, fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: C.muted }}>Cancel</button>
          )}
          <button className="cc-btn" onClick={saveDraft} style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.surface, fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: C.ink }}>{editingPost ? "Update draft" : "Save draft"}</button>
          <button className="cc-btn" disabled={!canPublish} style={{
            padding: "9px 18px", borderRadius: 10, border: "none", fontSize: 13.5, fontWeight: 600,
            cursor: canPublish ? "pointer" : "not-allowed",
            background: C.accent, color: "#fff", opacity: canPublish ? 1 : 0.45,
            boxShadow: canPublish ? "0 4px 14px -4px rgba(255,91,31,.5)" : "none",
          }}>Publish to {selected.size}</button>
        </div>
      </footer>
    </section>
  );
}
