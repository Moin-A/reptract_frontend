import { useEffect, useRef } from "react";

const ALL_CSS = `
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

@keyframes success-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

const C = {
  success: "#16A34A",
  successSoftBg: "#ECFDF3",
  successBorder: "#BBF7D0",
  successTitle: "#14532D",
  successBody: "#166534",

  error: "#DC2626",
  errorSoftBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorTitle: "#7F1D1D",
  errorBody: "#991B1B",

  muted: "#6B6B70",
} as const;

const THEMES = {
  success: {
    light: {
      bg: C.successSoftBg,
      border: C.successBorder,
      title: C.successTitle,
      body: C.successBody,
      icon: C.success,
      codeBg: "rgba(22,163,74,0.12)",
    },
    dark: {
      bg: "rgba(22,163,74,0.12)",
      border: "rgba(22,163,74,0.45)",
      title: "#BBF7D0",
      body: "#86EFAC",
      icon: C.success,
      codeBg: "rgba(22,163,74,0.18)",
    },
  },

  error: {
    light: {
      bg: C.errorSoftBg,
      border: C.errorBorder,
      title: C.errorTitle,
      body: C.errorBody,
      icon: C.error,
      codeBg: "rgba(220,38,38,0.12)",
    },
    dark: {
      bg: "rgba(220,38,38,0.12)",
      border: "rgba(220,38,38,0.45)",
      title: "#FECACA",
      body: "#FCA5A5",
      icon: C.error,
      codeBg: "rgba(220,38,38,0.18)",
    },
  },
} as const;

export interface FormBannerMessage {
  title: string;
  body: string;
}

interface FormBannerProps {
  message: FormBannerMessage | null;
  variant?: "success" | "error";
  theme?: "light" | "dark";
  onDismiss?: () => void;
  reference?: string;
  autoDismissMs?: number;
  watchValues?: unknown[];
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17 4 12" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function FormSuccessBanner({
  message,
  variant = "success",
  theme = "light",
  onDismiss,
  reference,
  autoDismissMs,
  watchValues,
}: FormBannerProps) {
  const watchKey =
    watchValues !== undefined ? JSON.stringify(watchValues) : undefined;

  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    onDismiss?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  useEffect(() => {
    if (!message || !onDismiss || !autoDismissMs) return;

    const timer = window.setTimeout(() => {
      onDismiss();
    }, autoDismissMs);

    return () => window.clearTimeout(timer);
  }, [message, onDismiss, autoDismissMs]);

  if (!message) return null;

  const t = THEMES[variant][theme];

  return (
    <>
      <style>{ALL_CSS}</style>

      <div
        role="status"
        aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 11,
        padding: "13px 14px",
        borderRadius: 10,
        background: t.bg,
        border: `1px solid ${t.border}`,
        marginBottom: 10,
        animation: "success-in 180ms ease-out",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: t.icon,
            color: "white",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            marginTop: 1,
            lineHeight: 1,
          }}
        >
          {variant === "success" ? <CheckIcon /> : <ErrorIcon />}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              color: t.title,
              fontSize: 13,
              marginBottom: 2,
            }}
          >
            {message.title}
          </div>

          <div
            style={{
              color: t.body,
              fontSize: 12.5,
              lineHeight: 1.5,
              whiteSpace: "pre-line",
            }}
          >
            {message.body}

            {reference && (
              <>
                {" "}
                Reference{" "}
                <code
                  style={{
                    background: t.codeBg,
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontFamily: "monospace",
                    fontSize: 11.5,
                  }}
                >
                  {reference}
                </code>
              </>
            )}
          </div>

          {onDismiss && (
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 9,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <button
                type="button"
                onClick={onDismiss}
                style={{
                  color: C.muted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: 600,
                  fontSize: 12.5,
                  fontFamily: "inherit",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            style={{
              color: t.body,
              opacity: 0.7,
              display: "flex",
              alignItems: "flex-start",
              cursor: "pointer",
              flexShrink: 0,
              marginTop: 1,
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </>
  );
}