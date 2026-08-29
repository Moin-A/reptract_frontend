"use client";

import { useCallback, useEffect, useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

const DISMISS_KEY = "reptrack:push-prompt-dismissed-at";
const DISMISS_DAYS = 7;

// Four render states, driven by Notification.permission plus what the server
// knows. "prompt" is our own card — it costs nothing and is re-showable.
// The real browser prompt is only spent on an explicit Enable click.
type Phase = "hidden" | "prompt" | "working" | "granted" | "denied" | "error" | "unsupported";

// applicationServerKey wants raw bytes, not the base64url string we ship in env.
// Return type is pinned to Uint8Array<ArrayBuffer>: TS 5.7 defaults the generic
// to ArrayBufferLike, which BufferSource (and so applicationServerKey) rejects.
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

function dismissedRecently(): boolean {
  try {
    const at = localStorage.getItem(DISMISS_KEY);
    return !!at && Date.now() - Number(at) < DISMISS_DAYS * 86_400_000;
  } catch {
    return false; // private mode / storage blocked — just show it
  }
}

export function PushPrompt() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Service workers need a secure context. The spec whitelists the literal
    // hosts localhost/127.0.0.1 — lvh.me resolves there but is not whitelisted,
    // so http://lvh.me:8000 has no navigator.serviceWorker at all.
    if (!window.isSecureContext) {
      setDetail(
        `${window.location.origin} is not a secure context, so the browser ` +
          "exposes no service worker. Use https, or run Chrome with " +
          "--unsafely-treat-insecure-origin-as-secure.",
      );
      return setPhase("unsupported");
    }

    const supported =
      "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

    if (!supported) {
      // iOS Safari outside an installed PWA also lands here.
      setDetail("This browser has no Push API. On iOS, add the app to your home screen first.");
      return setPhase("unsupported");
    }

    if (Notification.permission === "denied") return setPhase("denied");
    if (Notification.permission === "granted") return setPhase("granted");
    if (!dismissedRecently()) setPhase("prompt");
  }, []);

  const enable = useCallback(async () => {
    setPhase("working");
    setDetail("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPhase(permission === "denied" ? "denied" : "prompt");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set");

      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key),
        }));

      // Log it here too — the same JSON is what lands at the Rails pry.
      console.log("[push] subscription", subscription.toJSON());

      // Mint a short-lived identity token from Rails (authenticated by the
      // session cookie). Rails returns it as the HttpOnly push_token cookie;
      // the subscriptions BFF reads that cookie to authenticate with notif.
      const tokenRes = await fetch("/subscriptions/token");
      if (!tokenRes.ok) throw new Error(`GET /subscriptions/token → ${tokenRes.status}`);

      // Send the subscription. The BFF attaches the JWT (from the push_token
      // cookie) when forwarding to notif.
      const res = await fetch("/api/push/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!res.ok) throw new Error(`POST /api/push/subscriptions → ${res.status}`);
      setPhase("granted");
    } catch (err) {
      setDetail(err instanceof Error ? err.message : String(err));
      setPhase("error");
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage blocked — dismissal just won't persist */
    }
    setPhase("hidden");
  }, []);

  if (phase === "hidden") return null;

  return (
    <div style={shell}>
      <span style={{ fontSize: 18, lineHeight: "24px" }}>🔔</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {phase === "unsupported" ? (
          <>
            <div style={title}>Push isn&apos;t available here</div>
            <div style={{ ...body, color: C.warn }}>{detail}</div>
          </>
        ) : phase === "denied" ? (
          <>
            <div style={title}>Notifications are blocked</div>
            <div style={body}>
              Your browser is blocking notifications for this site. Re-enable them in
              site settings — we can&apos;t ask again from here.
            </div>
          </>
        ) : phase === "granted" ? (
          <>
            <div style={title}>Notifications are on</div>
            <div style={body}>Subscription sent. Check the Rails console.</div>
          </>
        ) : phase === "error" ? (
          <>
            <div style={title}>Couldn&apos;t enable notifications</div>
            <div style={{ ...body, color: C.err }}>{detail}</div>
          </>
        ) : (
          <>
            <div style={title}>Get notified when a task is assigned to you</div>
            <div style={body}>
              We&apos;ll only notify you about your own tasks. You can turn this off
              at any time.
            </div>
          </>
        )}
      </div>

      {(phase === "prompt" || phase === "working" || phase === "error") && (
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={dismiss} disabled={phase === "working"} style={ghostBtn}>
            Not now
          </button>
          <button onClick={enable} disabled={phase === "working"} style={primaryBtn}>
            {phase === "working" ? "Enabling…" : "Enable"}
          </button>
        </div>
      )}
    </div>
  );
}

const shell: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  margin: "12px 16px 0",
  padding: "12px 14px",
  background: C.surface,
  border: `1px solid ${C.line}`,
  borderRadius: 10,
};

const title: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 13,
  color: C.ink,
  marginBottom: 2,
};

const body: React.CSSProperties = { fontSize: 12, color: C.muted, lineHeight: 1.5 };

const baseBtn: React.CSSProperties = {
  height: 28,
  padding: "0 12px",
  fontSize: 12,
  fontWeight: 500,
  borderRadius: 8,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  ...baseBtn,
  background: "transparent",
  color: C.muted,
  border: `1px solid ${C.line}`,
};

const primaryBtn: React.CSSProperties = {
  ...baseBtn,
  background: C.accent,
  color: "#fff",
  border: "1px solid transparent",
};
