"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PlatformKey } from "@/lib/types";
import { PLATFORMS, CARD_STYLE, type Post } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";
import { CampaignSectionLabel } from "@/components/atoms/CampaignSectionLabel";
import { CountRing } from "@/components/atoms/CountRing";
import { CaptionInput } from "@/components/atoms/CaptionInput";
import { CaptionToolbar } from "@/components/atoms/CaptionToolbar";
import { MediaThumbnail } from "@/components/atoms/MediaThumbnail";
import { Dropzone } from "@/components/ui/dropzone";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";

type SocialAccount = { id: number; platform_tag: string; label: string; active: boolean };
type Props = { editingPost?: Post | null; onSaved?: () => void };

export function CampaignComposer({ editingPost = null, onSaved }: Props) {
  // Initialised from editingPost (parent remounts via `key` when it changes).
  const [kind, setKind]       = useState<"post" | "ad">(editingPost?.kind === "ad" ? "ad" : "post");
  const [caption, setCaption] = useState(editingPost?.content ?? editingPost?.body ?? "");
  const [link, setLink]       = useState(editingPost?.url ?? "");
  // A post must exist before it can be published — postId tracks that.
  const [postId, setPostId]   = useState<number | null>(editingPost?.id ?? null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const useFileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<FormError | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  // The post's already-uploaded image (display-only); a newly picked File wins.
  const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(editingPost?.media?.[0]?.url ?? null);

  // Load the user's connected accounts; default to all active ones selected.
  useEffect(() => {
    fetch("/api/campaign/social_accounts")
      .then(res => (res.ok ? res.json() : []))
      .then((data: SocialAccount[]) => {
        setAccounts(data);
        setSelected(new Set(data.filter(a => a.active).map(a => a.id)));
      })
      .catch(() => {});
  }, []);

  function resetForm() {
    setCaption(""); setLink(""); setKind("post"); setMedia(null); setExistingMediaUrl(null); setPostId(null);
  }

  // Blob preview for a newly-picked File (revoked on change/unmount); else the existing URL.
  const filePreview = useMemo(() => (media ? URL.createObjectURL(media) : null), [media]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const previewUrl = filePreview ?? existingMediaUrl;

  const limit = useMemo(() => {
    const limits = accounts
      .filter(a => selected.has(a.id))
      .map(a => PLATFORMS[a.platform_tag as PlatformKey]?.limit)
      .filter((n): n is number => typeof n === "number");
    return limits.length ? Math.min(...limits) : 280;
  }, [selected, accounts]);

  const canSave = caption.trim().length > 0;
  const canPublish = postId != null && selected.size > 0 && caption.length > 0 && caption.length <= limit;

  function toggle(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) { setError(null); setMedia(file); }
  }

  // Create (new) or update (existing) the post; records post_id so it can be published.
  async function savePost(): Promise<void> {
    setError(null);
    const body = new FormData();
    body.append("campaign_post[content]", caption);
    body.append("campaign_post[kind]", kind);
    body.append("campaign_post[url]", link);
    if (media) body.append("campaign_post[media]", media);

    const res = await fetch(
      postId != null ? `/api/campaign/posts/${postId}` : "/api/campaign/posts",
      { method: postId != null ? "PATCH" : "POST", body },
    );
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError({ title: postId != null ? "Couldn't update post" : "Couldn't create post", body: (Array.isArray(d?.errors) ? d.errors.join(", ") : d?.error) ?? "The server returned an error." });
      return;
    }
    const json = await res.json().catch(() => null);
    const id = json?.data?.id ?? json?.id ?? postId;
    if (id != null) setPostId(Number(id));
  }

  // Fan the already-created post out to the selected accounts (publications only).
  async function publish(): Promise<void> {
    if (postId == null) return;
    setError(null);
    const res = await fetch("/api/campaign/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: postId, social_account_ids: [...selected] }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError({ title: "Couldn't publish", body: (Array.isArray(d?.errors) ? d.errors.join(", ") : d?.error) ?? "The server returned an error." });
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
            {accounts.length === 0 && (
              <div style={{ fontSize: 12.5, color: C.muted2, padding: "4px 2px" }}>No connected accounts — connect one from the sidebar.</div>
            )}
            {accounts.map(a => {
              const on = selected.has(a.id);
              const disabled = !a.active;
              const platform = a.platform_tag as PlatformKey;
              const meta = PLATFORMS[platform];
              const over = on && !!meta && caption.length > meta.limit;
              return (
                <label key={a.id} className="cc-target" style={{
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
                  {meta
                    ? <PlatformBadge platform={platform} size={30} />
                    : <span style={{ width: 30, height: 30, borderRadius: 9, flex: "none", display: "grid", placeItems: "center", background: C.line2, color: "#fff", fontSize: 14, fontWeight: 700 }}>{a.platform_tag[0]?.toUpperCase()}</span>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: over ? C.err : C.muted, fontWeight: over ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
                      {disabled ? "reconnect needed" : (meta ? `${caption.length}/${meta.limit}` : a.platform_tag)}
                    </div>
                  </div>
                  <input type="checkbox" checked={on} disabled={disabled} onChange={() => toggle(a.id)} style={{ display: "none" }} />
                </label>
              );
            })}
          </div>

          <p style={{ fontSize: 11.5, color: C.muted, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.line}`, lineHeight: 1.45, display: "flex", gap: 7 }}>
            <span>ⓘ</span>
            <span>{postId == null ? "Create the post first, then publish it to your accounts." : "Ready to publish to the selected accounts."}</span>
          </p>
        </div>
      </div>

      {/* footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: `1px solid ${C.line}`, background: "#FAFAF7" }}>
        <span style={{ fontSize: 13, color: C.muted }}>{postId != null ? "● Draft saved" : "● Draft — not saved"}</span>
        <div style={{ display: "flex", gap: 10 }}>
          {postId != null && (
            <button className="cc-btn" onClick={() => { resetForm(); onSaved?.(); }} style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.surface, fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: C.muted }}>Cancel</button>
          )}
          <button className="cc-btn" onClick={savePost} disabled={!canSave} style={{
            padding: "9px 16px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.surface,
            fontSize: 13.5, fontWeight: 600, cursor: canSave ? "pointer" : "not-allowed", color: C.ink, opacity: canSave ? 1 : 0.5,
          }}>{postId != null ? "Update post" : "Create post"}</button>
          <button className="cc-btn" onClick={publish} disabled={!canPublish} title={postId == null ? "Create the post first" : undefined} style={{
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
