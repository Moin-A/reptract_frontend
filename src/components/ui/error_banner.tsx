"use client";

import { useEffect, useRef, useState } from "react";

// ── Shared animation/style injection ────────────────────────────────────────
const ALL_CSS = `
@keyframes fb-shake {
  10%, 90% { transform: translateX(-1px) }
  20%, 80% { transform: translateX(2px) }
  30%, 50%, 70% { transform: translateX(-4px) }
  40%, 60% { transform: translateX(4px) }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(20px) translateY(-4px); }
  to   { opacity: 1; transform: none; }
}
@keyframes toast-out {
  to { opacity: 0; transform: translateX(20px); }
}
@keyframes toast-bar {
  to { width: 0; }
}
@keyframes banner-in {
  from { max-height: 0; opacity: 0; }
  to   { max-height: 80px; opacity: 1; }
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.94) translateY(8px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

// ── Colour constants (matching design file tokens) ───────────────────────────
const C = {
  err:          '#D84A3F',
  errSoftBg:    '#FDECEA',
  errLightBg:   '#FEF2F2',
  errIconBg:    '#FEE2E2',
  errBorder:    '#F5C2BD',
  errTitle:     '#6B1F18',
  errBody:      '#8F2A22',
  errBannerTxt: '#7F1D1D',
  errBodyDeep:  '#991B1B',
  muted:        '#6B6B70',
  line:         '#E7E4DE',
  surface:      '#FFFFFF',
  inkDark:      '#0B0B0C',
  bgLight:      '#FAFAF7',
  accent:       '#FF5B1F',
  accentHover:  '#e64d13',
} as const;

// ── Shared icon components ────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18"/>
    </svg>
  );
}

function AlertCircleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 8v5"/>
      <circle cx="12" cy="16" r=".5" fill="currentColor"/>
      <circle cx="12" cy="12" r="9"/>
    </svg>
  );
}

function TriangleAlertIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <path d="M12 9v4M12 17h.01"/>
    </svg>
  );
}

// ── Shared error shape ────────────────────────────────────────────────────────
export interface FormError {
  title: string;
  body:  string;
}

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 01 · Toast (top-right)
// Non-blocking. Auto-dismisses after autoHideMs (default 5 s).
// ════════════════════════════════════════════════════════════════════════════
interface ErrorToastProps {
  error:        FormError | null;
  onDismiss?:   () => void;
  onRetry?:     () => void;
  autoHideMs?:  number;
}

export function ErrorToast({
  error,
  onDismiss,
  onRetry,
  autoHideMs = 5000,
}: ErrorToastProps) {
  const [hiding, setHiding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barRef   = useRef<HTMLDivElement>(null);

  // restart everything when a new error arrives
  useEffect(() => {
    if (!error) return;
    setHiding(false);

    if (barRef.current) {
      barRef.current.style.animation = 'none';
      void barRef.current.offsetWidth;
      barRef.current.style.animation = `toast-bar ${autoHideMs}ms linear forwards`;
    }

    timerRef.current = setTimeout(dismiss, autoHideMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, autoHideMs]);

  function dismiss() {
    setHiding(true);
    setTimeout(() => { setHiding(false); onDismiss?.(); }, 220);
  }

  if (!error) return null;

  return (
    <>
      <style>{ALL_CSS}</style>
      <div
        role="alert"
        aria-live="assertive"
        style={{
          position:     'fixed',
          top:          14,
          right:        14,
          width:        340,
          maxWidth:     'calc(100vw - 28px)',
          background:   C.surface,
          border:       `1px solid ${C.line}`,
          borderRadius: 12,
          boxShadow:    '0 14px 36px -8px rgba(0,0,0,0.18), 0 4px 10px -3px rgba(0,0,0,0.08)',
          padding:      14,
          overflow:     'hidden',
          animation:    hiding ? 'toast-out 220ms ease forwards' : 'toast-in 320ms cubic-bezier(.2,.9,.3,1.2)',
          zIndex:       9999,
        }}
        onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current); }}
        onMouseLeave={() => { timerRef.current = setTimeout(dismiss, 2000); }}
      >
        {/* Left severity stripe */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: C.err,
        }}/>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute', top: 8, right: 8, color: C.muted,
            padding: 4, borderRadius: 6, lineHeight: 0,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          <CloseIcon/>
        </button>

        {/* Body */}
        <div style={{ display: 'flex', gap: 11, paddingLeft: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 28, background: C.errIconBg,
            color: C.err, flexShrink: 0, display: 'grid', placeItems: 'center',
          }}>
            <AlertCircleIcon size={14}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.inkDark, lineHeight: 1.3 }}>
              {error.title}
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45, marginTop: 3 }}>
              {error.body}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 9, fontSize: 12, fontWeight: 600 }}>
              {onRetry && (
                <button type="button" onClick={onRetry}
                  style={{ color: C.accent, background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontWeight: 600, fontSize: 12, fontFamily: 'inherit' }}>
                  Retry
                </button>
              )}
              <button type="button" onClick={dismiss}
                style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, fontWeight: 600, fontSize: 12, fontFamily: 'inherit' }}>
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', left: 3, right: 0, bottom: 0, height: 2, background: C.line }}>
          <div
            ref={barRef}
            style={{ height: '100%', background: C.err, width: '100%' }}
          />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 02 · Top Banner
// Full-width sticky bar below the nav. For connection loss, expired sessions,
// or any global app-wide degraded state.
// ════════════════════════════════════════════════════════════════════════════
interface ErrorTopBannerProps {
  error:      FormError | null;
  onDismiss?: () => void;
  onRetry?:   () => void;
}

export function ErrorTopBanner({ error, onDismiss, onRetry }: ErrorTopBannerProps) {
  if (!error) return null;

  return (
    <>
      <style>{ALL_CSS}</style>
      <div
        role="alert"
        aria-live="polite"
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          background:   C.errLightBg,
          borderBottom: `1px solid ${C.errBorder}`,
          color:        C.errBannerTxt,
          padding:      '11px 18px',
          fontSize:     13,
          animation:    'banner-in 280ms ease',
          overflow:     'hidden',
        }}
      >
        {/* Icon */}
        <div style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: 22,
          background: C.err, color: 'white',
          display: 'grid', placeItems: 'center',
          fontWeight: 700, fontSize: 11,
        }}>!</div>

        {/* Title + body */}
        <span style={{ fontWeight: 700 }}>{error.title}</span>
        <span style={{ color: C.errBodyDeep, flex: 1 }}>{error.body}</span>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>
          {onRetry && (
            <button type="button" onClick={onRetry}
              style={{ color: C.errBannerTxt, background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, fontWeight: 600, fontSize: 12.5, fontFamily: 'inherit',
                textDecoration: 'underline', textUnderlineOffset: 2 }}>
              Retry now
            </button>
          )}
          {onDismiss && (
            <button type="button" onClick={onDismiss} aria-label="Dismiss"
              style={{ color: C.errBannerTxt, opacity: 0.6, background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
              <CloseIcon/>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 03 · Inline Banner (FormErrorBanner)
// Lives inside the card or form section that failed.
// ════════════════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    bg:     C.errSoftBg,
    border: C.errBorder,
    title:  C.errTitle,
    body:   C.errBody,
    icon:   C.err,
  },
  dark: {
    bg:     'rgba(216,74,63,0.10)',
    border: 'rgba(216,74,63,0.45)',
    title:  '#FFD3CE',
    body:   '#FFB4AD',
    icon:   C.err,
  },
} as const;

interface FormErrorBannerProps {
  error:        FormError | null;
  onDismiss?:   () => void;
  onRetry?:     () => void;
  theme?:       'light' | 'dark';
  errorRef?:    string;
  /** Pass [email, password] (or any values) — banner clears when they change */
  watchValues?: unknown[];
}

export function FormErrorBanner({
  error,
  onDismiss,
  onRetry,
  theme = 'light',
  errorRef,
  watchValues,
}: FormErrorBannerProps) {
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
      <style>{ALL_CSS}</style>
      <div
        role="alert"
        aria-live="polite"
        style={{
          display:      'flex',
          alignItems:   'flex-start',
          gap:          11,
          padding:      '13px 14px',
          borderRadius: 10,
          background:   t.bg,
          border:       `1px solid ${t.border}`,
          marginBottom: 10,
          animation:    'fb-shake 360ms cubic-bezier(.36,.07,.19,.97)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: t.icon,
          color: 'white', display: 'grid', placeItems: 'center',
          fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1, lineHeight: 1,
        }}>!</div>

        {/* Body */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: t.title, fontSize: 13, marginBottom: 2 }}>
            {error.title}
          </div>
          <div style={{ color: t.body, fontSize: 12.5, lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {error.body}
            {errorRef && (
              <> Reference <code style={{
                background: 'rgba(216,74,63,0.12)', padding: '1px 6px', borderRadius: 4,
                fontFamily: 'monospace', fontSize: 11.5,
              }}>{errorRef}</code></>
            )}
          </div>
          {(onRetry || onDismiss) && (
            <div style={{ display: 'flex', gap: 14, marginTop: 9, fontSize: 12.5, fontWeight: 600 }}>
              {onRetry && (
                <button type="button" onClick={onRetry}
                  style={{ color: '#7F1D1D', background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontWeight: 600, fontSize: 12.5, fontFamily: 'inherit',
                    textDecoration: 'underline', textUnderlineOffset: 2 }}>
                  Try again
                </button>
              )}
              {onDismiss && (
                <button type="button" onClick={onDismiss}
                  style={{ color: C.muted, background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontWeight: 600, fontSize: 12.5, fontFamily: 'inherit',
                    textDecoration: 'underline', textUnderlineOffset: 2 }}>
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dismiss X */}
        {onDismiss && (
          <button type="button" onClick={onDismiss} aria-label="Dismiss"
            style={{ color: t.body, opacity: 0.7, display: 'flex', alignItems: 'flex-start',
              cursor: 'pointer', flexShrink: 0, marginTop: 1,
              background: 'none', border: 'none', padding: 0 }}>
            <CloseIcon/>
          </button>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 04 · Error Modal (Blocking)
// Blocks the UI. Use only when the user MUST acknowledge or choose.
// ════════════════════════════════════════════════════════════════════════════
interface ErrorModalProps {
  error:        FormError | null;
  onDismiss?:   () => void;
  onRetry?:     () => void;
  retryLabel?:  string;
  errorDetail?: string;
}

export function ErrorModal({
  error,
  onDismiss,
  onRetry,
  retryLabel = 'Try again',
  errorDetail,
}: ErrorModalProps) {
  // Trap focus + Esc to close
  useEffect(() => {
    if (!error) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss?.();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [error, onDismiss]);

  if (!error) return null;

  return (
    <>
      <style>{ALL_CSS}</style>
      {/* Backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="em-title"
        aria-describedby="em-body"
        onClick={(e) => { if (e.target === e.currentTarget) onDismiss?.(); }}
        style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(11,11,12,0.45)',
          backdropFilter: 'blur(2px)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          zIndex:         9998,
          animation:      'fade-in 200ms ease',
        }}
      >
        {/* Card */}
        <div style={{
          background:   C.surface,
          borderRadius: 14,
          width:        420,
          maxWidth:     'calc(100vw - 32px)',
          boxShadow:    '0 30px 60px -10px rgba(0,0,0,0.35)',
          overflow:     'hidden',
          animation:    'modal-in 320ms cubic-bezier(.2,.9,.3,1.2)',
        }}>
          {/* Body */}
          <div style={{ padding: 24 }}>
            {/* Icon with outer glow */}
            <div style={{
              width:        48,
              height:       48,
              borderRadius: 48,
              background:   C.errIconBg,
              color:        C.err,
              display:      'grid',
              placeItems:   'center',
              marginBottom: 14,
              boxShadow:    '0 0 0 6px rgba(216,74,63,0.10)',
            }}>
              <TriangleAlertIcon size={22}/>
            </div>

            <div id="em-title" style={{
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3,
              color: C.inkDark,
            }}>
              {error.title}
            </div>
            <div id="em-body" style={{
              fontSize: 13.5, color: C.muted, marginTop: 6, lineHeight: 1.55,
            }}>
              {error.body}
            </div>

            {/* Raw error detail block */}
            {errorDetail && (
              <div style={{
                background:   C.bgLight,
                border:       `1px solid ${C.line}`,
                borderRadius: 8,
                padding:      '10px 12px',
                marginTop:    14,
                fontFamily:   'monospace',
                fontSize:     11.5,
                color:        C.muted,
                maxHeight:    80,
                overflowY:    'auto',
              }}>
                <span style={{ color: C.err, fontWeight: 700 }}>Error</span>: {errorDetail}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding:         '14px 20px',
            borderTop:       `1px solid ${C.line}`,
            background:      C.bgLight,
            display:         'flex',
            justifyContent:  'flex-end',
            gap:             8,
          }}>
            {onDismiss && (
              <button type="button" onClick={onDismiss}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', border: `1px solid ${C.line}`, background: C.surface,
                  color: C.inkDark, fontFamily: 'inherit',
                }}>
                Cancel
              </button>
            )}
            {onRetry && (
              <button type="button" onClick={onRetry}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', border: `1px solid ${C.accent}`,
                  background: C.accent, color: 'white', fontFamily: 'inherit',
                }}>
                {retryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
