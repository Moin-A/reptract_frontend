"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";
import { m } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { useState } from "react";

const T = {
  ink:      '#0B0B0C',
  accent:   '#FF5B1F',
  muted:    '#8C8C92',
  line:     '#E8E5DF',
  err:      '#C8332A',
  ok:       '#6AAF5E',
  warn:     '#D97706',
  darkLine: '#2A2A2D',
};

const CSS = `
@keyframes rt-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes rt-spin   { to{transform:rotate(360deg)} }
@keyframes rt-pop    { from{transform:scale(.6);opacity:0} to{transform:scale(1);opacity:1} }
`;

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

function useAuthForm() {
  const [mode, setModeRaw] = useState<'signin' | 'signup'>('signup');
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [serverError, setServerError] = useState<FormError | null>(null);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(v => ({ ...v, [k]: e.target.value }));
  const blur = (k: string) => () => setTouched(t => ({ ...t, [k]: true }));

  const emailOk   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const pwScore   = scorePassword(values.password);
  const pwOk      = pwScore >= 2;
  const confirmOk = values.confirm.length > 0 && values.confirm === values.password;
  const nameOk    = values.name.trim().length >= 2;

  const errors = {
    name:     touched.name     && !nameOk    ? 'Full name required'            : null,
    email:    touched.email    && !emailOk   ? 'Invalid email'                 : null,
    password: touched.password && !pwOk      ? '8+ chars, number or symbol'    : null,
    confirm:  touched.confirm  && !confirmOk ? "Passwords don't match"         : null,
  };

  const valid = mode === 'signup'
    ? nameOk && emailOk && pwOk && confirmOk
    : emailOk && values.password.length > 0;

  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!valid) return;
    setSubmitting(true);
    setServerError(null);
    let endpoint;
    if (mode === 'signup') {
      endpoint = '/api/users';
    } else {
      endpoint = '/api/users/sign_in';
    }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log(data)
        setServerError({
          title: "We couldn't sign you in",
          body: data?.errors ?? data?.errors.join(", ") ?? 'Something went wrong. Please try again.',
        });
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
      setSucceeded(true);
    } catch {
      setServerError({ title: "We couldn't sign you in", body: 'Network error. Please check your connection.' });
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSucceeded(false);
    setValues({ name: '', email: '', password: '', confirm: '' });
    setTouched({});
  };

  const setMode = (m: 'signin' | 'signup') => {
    setModeRaw(m);
    setTouched({});
    setValues({ name: '', email: '', password: '', confirm: '' });
  };

  return { mode, setMode, values, set, blur, errors, valid,
           showPw, setShowPw, showConfirm, setShowConfirm,
           pwScore, submitting, succeeded, serverError, setServerError, submit, reset };
}

// ── Icons ──────────────────────────────────────────────────────────────────
type IP = { size?: number; stroke?: number; style?: React.CSSProperties };
const Ic = ({ children, size = 20, stroke = 1.75, style }: IP & { children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: 'none', ...style }}>{children}</svg>
);
const IUser   = (p: IP) => <Ic {...p}><circle cx="12" cy="8" r="3.2"/><path d="M5 20c1.3-3.6 4-5.2 7-5.2s5.7 1.6 7 5.2"/></Ic>;
const IMail   = (p: IP) => <Ic {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></Ic>;
const ILock   = (p: IP) => <Ic {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></Ic>;
const IEye    = (p: IP) => <Ic {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/></Ic>;
const IEyeOff = (p: IP) => <Ic {...p}><path d="m3 3 18 18"/><path d="M10.6 5.2A10.5 10.5 0 0 1 22 12s-1.3 2.5-4 4.6"/><path d="M6.1 6.9C3.5 8.6 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.2-1.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></Ic>;
const ICheck  = (p: IP) => <Ic {...p}><path d="m5 12 4.5 4.5L19 7"/></Ic>;
const IArrow  = (p: IP) => <Ic {...p}><path d="M5 12h14m-5-6 6 6-6 6"/></Ic>;
const IZap    = (p: IP) => <Ic {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z"/></Ic>;
const IShield = (p: IP) => <Ic {...p}><path d="M12 3 4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7l-8-4Z"/></Ic>;
const IUsers  = (p: IP) => <Ic {...p}><circle cx="9" cy="7" r="3"/><path d="M3 20c.9-3.3 3.3-5 6-5s5.1 1.7 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M21 20c-.6-2.6-2.3-4-4-4"/></Ic>;

// ── Field — label / inline error ───────────────────────────────────────────
function Field({ label, hint, error, children }: {
  label: string; hint?: React.ReactNode; error?: string | null; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
                         textTransform: 'uppercase', color: T.muted }}>{label}</span>
          {error && (
            <span style={{ fontSize: 10, color: T.err }}> / {error}</span>
          )}
        </div>
        {hint}
      </div>
      {children}
    </div>
  );
}

// ── Icon input ─────────────────────────────────────────────────────────────
function IconInput({ icon: Icon, error, trailing, ...props }: {
  icon: (p: IP) => React.ReactNode;
  error?: string | null;
  trailing?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      border: `1px solid ${error ? T.err : focused ? '#ADADAD' : T.line}`,
      borderRadius: 8, height: 30, padding: '0 10px',
      background: '#FAFAF8',
      transition: 'border-color 120ms, box-shadow 120ms',
      boxShadow: focused ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
    }}>
      <span style={{ color: '#BFBCB6', display: 'flex', flexShrink: 0 }}><Icon size={12} /></span>
      <input
        {...props}
        onFocus={e => { setFocused(true); (props.onFocus as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined)?.(e); }}
        onBlur={e => { setFocused(false); (props.onBlur as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined)?.(e); }}
        style={{ flex: 1, border: 0, outline: 0, background: 'transparent', height: '100%',
                 fontSize: 10, color: T.ink,
                 letterSpacing: props.type === 'password' ? '0.06em' : 'normal' }}
      />
      {trailing}
    </div>
  );
}

// ── Strength meter ─────────────────────────────────────────────────────────
function StrengthMeter({ score }: { score: number }) {
  const labels = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent'];
  const colors = ['#ccc', T.err, T.warn, T.ok, T.ok];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 2,
            background: i < score ? colors[score] : '#E7E4DE', transition: 'background 200ms' }} />
        ))}
      </div>
      <div style={{ fontSize: 9, color: T.muted, marginTop: 3, display: 'flex', justifyContent: 'space-between' }}>
        <span>{labels[score]}</span><span>mix case + number</span>
      </div>
    </div>
  );
}

// ── Success state ──────────────────────────────────────────────────────────
function SuccessState({ onReset, name }: { onReset: () => void; name: string }) {
  return (
    <div style={{ padding: '40px 8px', textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 52, margin: '0 auto 14px',
                    display: 'grid', placeItems: 'center', background: T.accent, color: 'white',
                    animation: 'rt-pop 400ms cubic-bezier(.2,.9,.3,1.2)' }}>
        <ICheck size={26} stroke={2.4} />
      </div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: T.ink }}>
        You're in{name ? `, ${name.split(' ')[0]}` : ''}.
      </h2>
      <p style={{ margin: '8px 0 20px', color: T.muted, fontSize: 12 }}>
        Check your email for a verification link.
      </p>
      <button onClick={onReset} style={{ fontSize: 11, color: T.muted, textDecoration: 'underline',
                                         textUnderlineOffset: 3, cursor: 'pointer' }}>
        Use a different email
      </button>
    </div>
  );
}

// ── Left panel ─────────────────────────────────────────────────────────────
function LeftPanel() {
  const features = [
    { Icon: IZap,    label: 'Instant onboarding' },
    { Icon: IShield, label: 'Role-based access'  },
    { Icon: IUsers,  label: 'Full member view'   },
  ];
  return (
    <div style={{ background: '#0B0B0C', color: 'white', padding: '24px 20px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: -10, top: '25%', right: 0,
                    fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9,
                    color: 'rgba(255,255,255,0.04)', pointerEvents: 'none', userSelect: 'none' }}>
        Built<br/>for<br/>gyms.
      </div>

      {/* Logo */}
      <div style={{ position: 'relative' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: T.accent,
                      display: 'grid', placeItems: 'center', marginBottom: 10 }}>
          <Dumbbell size={17} color="white" />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>RepTrack</div>
        <div style={{ fontSize: 11, color: '#8C8C92', marginTop: 2 }}>Join thousands of gyms.</div>
      </div>

      {/* Features */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map(({ Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#1C1C1F',
                          display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon size={12} style={{ color: '#8C8C92' }} />
            </div>
            <span style={{ fontSize: 11, color: '#8C8C92' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Auth form ──────────────────────────────────────────────────────────────
export function AuthForm() {
  const f = useAuthForm();

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width: '100%', background: 'white', borderRadius: 16, overflow: 'hidden',
                    display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 614,
                    boxShadow: '0 24px 60px -12px rgba(0,0,0,0.28), 0 8px 20px -8px rgba(0,0,0,0.12)' }}>
        <LeftPanel />

        {/* Right — form */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', minHeight: 480 }}>
          {/* Tab switch */}
          <div style={{ display: 'inline-flex', padding: 3, borderRadius: 8, marginBottom: 18,
                        background: '#F2EFE9', border: `1px solid ${T.line}`, gap: 2, alignSelf: 'flex-start' }}>
            {(['signin', 'signup'] as const).map(k => (
              <button key={k} type="button" onClick={() => f.setMode(k)} style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600,
                color: f.mode === k ? T.ink : T.muted,
                background: f.mode === k ? 'white' : 'transparent',
                border: f.mode === k ? `1px solid ${T.line}` : '1px solid transparent',
                borderRadius: 6, transition: 'all 160ms',
                boxShadow: f.mode === k ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
              }}>
                {k === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {f.succeeded ? (
            <SuccessState onReset={f.reset} name={f.values.name} />
          ) : (
            <form onSubmit={f.submit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: 14 }}>
                <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', color: T.ink }}>
                  {f.mode === 'signup' ? 'Create your account' : 'Welcome back'}
                </h1>
                <p style={{ margin: '3px 0 0', color: T.muted, fontSize: 11 }}>
                  {f.mode === 'signup'
                    ? 'Your first 14 days are on us. No card required.'
                    : 'Sign in to your RepTrack dashboard.'}
                </p>
              </div>

              {/* Google button */}
              <button type="button" style={{
                width: '100%', height: 32, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                border: `1px solid ${T.line}`, borderRadius: 8, background: 'white',
                fontSize: 10, fontWeight: 500, color: T.ink, cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: 2,
              }}>
                <svg width="13" height="13" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.2 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44Z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.3 5.3C37.1 41 44 36 44 24c0-1.2-.1-2.4-.4-3.5Z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0',
                            color: T.muted, fontSize: 10 }}>
                <div style={{ flex: 1, height: 1, background: T.line }} />
                or continue with email
                <div style={{ flex: 1, height: 1, background: T.line }} />
              </div>

              {f.mode === 'signup' && (
                <Field label="Full name" error={f.errors.name}>
                  <IconInput icon={IUser} placeholder="Jane Smith" autoComplete="name"
                    value={f.values.name} onChange={f.set('name')} onBlur={f.blur('name')} error={f.errors.name}
                    trailing={f.values.name.trim().length >= 2 ? <ICheck size={11} style={{ color: T.ok }} /> : null} />
                </Field>
              )}

              <Field label="Email" error={f.errors.email}>
                <IconInput icon={IMail} type="email" placeholder="you@example.com" autoComplete="email"
                  value={f.values.email} onChange={f.set('email')} onBlur={f.blur('email')} error={f.errors.email}
                  trailing={
                    f.values.email && !f.errors.email && /@.+\./.test(f.values.email)
                      ? <ICheck size={11} style={{ color: T.ok }} /> : null
                  } />
              </Field>

              <Field label="Password" error={f.errors.password}
                hint={f.mode === 'signin'
                  ? <a href="#" style={{ fontSize: 10, color: T.accent, textDecoration: 'none' }}>Forgot?</a>
                  : undefined}>
                <IconInput icon={ILock} type={f.showPw ? 'text' : 'password'} autoComplete="current-password"
                  placeholder={f.mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                  value={f.values.password} onChange={f.set('password')} onBlur={f.blur('password')} error={f.errors.password}
                  trailing={
                    <button type="button" onClick={() => f.setShowPw(s => !s)}
                      style={{ color: '#BFBCB6', display: 'flex', cursor: 'pointer', padding: '0 2px' }}>
                      {f.showPw ? <IEyeOff size={12} /> : <IEye size={12} />}
                    </button>
                  } />
                {f.mode === 'signup' && f.values.password.length > 0 && <StrengthMeter score={f.pwScore} />}
              </Field>

              {f.mode === 'signup' && (
                <Field label="Confirm password" error={f.errors.confirm}>
                  <IconInput icon={ILock} type={f.showConfirm ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={f.values.confirm} onChange={f.set('confirm')} onBlur={f.blur('confirm')} error={f.errors.confirm}
                    trailing={
                      f.values.confirm && f.values.confirm === f.values.password
                        ? <ICheck size={11} style={{ color: T.ok }} />
                        : <button type="button" onClick={() => f.setShowConfirm(s => !s)}
                            style={{ color: '#BFBCB6', display: 'flex', cursor: 'pointer', padding: '0 2px' }}>
                            {f.showConfirm ? <IEyeOff size={12} /> : <IEye size={12} />}
                          </button>
                    } />
                </Field>
              )}

              <div style={{ marginTop: 'auto', paddingTop: 10 }}>
                <FormErrorBanner
                  error={f.serverError}
                  onDismiss={() => f.setServerError(null)}
                  watchValues={[f.values.email, f.values.password]}
                />
                <button type="submit" disabled={!f.valid || f.submitting} style={{
                  width: '100%', height: 36, borderRadius: 10,
                  background: !f.valid ? '#C9C6BE' : T.accent,
                  color: 'white', fontWeight: 600, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: !f.valid ? 'not-allowed' : 'pointer',
                  transition: 'background 150ms',
                }}>
                  {f.submitting
                    ? <><Spinner />{f.mode === 'signup' ? 'Creating…' : 'Signing in…'}</>
                    : <>{f.mode === 'signup' ? 'Create account' : 'Sign in'}<IArrow size={13} /></>}
                </button>
                <p style={{ marginTop: 8, fontSize: 9.5, color: '#BFBCB6', textAlign: 'center' }}>
                  By continuing you agree to our{' '}
                  <a href="#" style={{ color: T.muted, textDecoration: 'underline' }}>Terms</a> and{' '}
                  <a href="#" style={{ color: T.muted, textDecoration: 'underline' }}>Privacy policy</a>.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: 'rt-spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
      <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Dialog wrapper ─────────────────────────────────────────────────────────
interface AuthDialogProps { isOpen: boolean; onOpenChange: () => void; }

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none sm:max-w-[620px] overflow-visible">
        <DialogTitle className="sr-only">Sign in to RepTrack</DialogTitle>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
