"use client";

import { useEffect, useRef } from "react";

// ── Shake keyframes ────────────────────────────────────────────────────────
const SHAKE_CSS = `
@keyframes fb-shake {
  10%, 90% { transform: translateX(-1px) }
  20%, 80% { transform: translateX(2px) }
  30%, 50%, 70% { transform: translateX(-4px) }
  40%, 60% { transform: translateX(4px) }
}
`;

const THEMES = {
  light: {
    bg:     '#FDECEA',
    border: '#F5C2BD',
    title:  '#6B1F18',
    body:   '#8F2A22',
    icon:   '#D84A3F',
  },
  dark: {
    bg:     'rgba(216,74,63,0.10)',
    border: 'rgba(216,74,63,0.45)',
    title:  '#FFD3CE',
    body:   '#FFB4AD',
    icon:   '#D84A3F',
  },
} as const;

export interface FormError {
  title: string;
  body:  string;
}

interface FormErrorBannerProps {
  error:        FormError | null;
  onDismiss?:   () => void;
  theme?:       'light' | 'dark';
  /** Pass [email, password] (or any values) — banner clears when they change */
  watchValues?: unknown[];
}

export function FormErrorBanner({
  error,
  onDismiss,
  theme = 'light',
  watchValues,
}: FormErrorBannerProps) {
  // Auto-clear when watched values change
  const watchKey = watchValues !== undefined ? JSON.stringify(watchValues) : undefined;
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (onDismiss) onDismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  if (!error) return null;

  const t = THEMES[theme];

  return (
    <>
      <style>{SHAKE_CSS}</style>
      <div
        role="alert"
        aria-live="polite"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 10,
          background: t.bg,
          border: `1px solid ${t.border}`,
          boxShadow: 'none',
          marginBottom: 10,
          animation: 'fb-shake 360ms cubic-bezier(.36,.07,.19,.97)',
        }}
      >
        {/* Leading icon */}
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: t.icon,
          color: 'white', display: 'grid', placeItems: 'center',
          fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1, lineHeight: 1,
        }}>!</div>

        {/* Text */}
        <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
          <div style={{ fontWeight: 700, color: t.title, marginBottom: 2 }}>
            {error.title}
          </div>
          <div style={{ color: t.body }}>
            {error.body}
          </div>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{
              color: t.body, opacity: 0.7, display: 'flex', alignItems: 'flex-start',
              cursor: 'pointer', flexShrink: 0, marginTop: 1,
              background: 'none', border: 'none', padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
