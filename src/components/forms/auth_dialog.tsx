"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Zap, Shield, Users, Mail, Lock, User, type LucideIcon } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

function IconInput({ id, icon: Icon, ...props }: React.ComponentProps<"input"> & { icon: LucideIcon }) {
  return (
    <div className="relative">
      <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-300 pointer-events-none" />
      <Input
        id={id}
        {...props}
        className="h-7 pl-8 text-xs rounded-md bg-zinc-50 border-zinc-200 shadow-inner placeholder:text-zinc-300 focus-visible:ring-1 focus-visible:ring-brand focus-visible:ring-offset-0 focus-visible:border-brand transition-colors"
      />
    </div>
  );
}

const LABEL = "text-[10px] font-bold uppercase tracking-widest text-zinc-400";

export function AuthDialog({ isOpen, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-border">
        <DialogTitle className="sr-only">Sign in to RepTrack</DialogTitle>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}

export function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    console.log("submitted:", mode);
  };

  return (
    <div className="flex min-h-[420px]">
      {/* Left brand strip — ~38%, content centered */}
      <div className="hidden sm:flex flex-col justify-center gap-8 w-[38%] shrink-0 bg-sidebar-bg px-6 py-7">
        <div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand mb-4">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <p className="text-xs font-bold text-sidebar-text-bright tracking-tight leading-none">RepTrack</p>
          <p className="text-[11px] text-sidebar-text mt-1.5 leading-snug">
            {mode === "signin" ? "Good to see you again." : "Join thousands of gyms."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: Zap,    label: "Instant onboarding" },
            { icon: Shield, label: "Role-based access"  },
            { icon: Users,  label: "Full member view"   },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sidebar-border-col">
                <Icon className="h-3 w-3 text-sidebar-text" />
              </div>
              <span className="text-[11px] text-sidebar-text">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex flex-col flex-1 px-7 py-7 gap-5">
        {/* Pill tabs */}
        <div className="flex gap-1 border-b border-border pb-4">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                mode === m
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          {mode === "signup" && (
            <div className="grid gap-1.5">
              <Label htmlFor="name" className={LABEL}>Full name</Label>
              <IconInput id="name" icon={User} type="text" placeholder="Jane Smith" required />
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="email" className={LABEL}>Email</Label>
            <IconInput id="email" icon={Mail} type="email" placeholder="you@example.com" required />
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className={LABEL}>Password</Label>
              {mode === "signin" && (
                <a href="#" className="text-[10px] text-brand hover:text-brand-hover transition-colors">
                  Forgot password?
                </a>
              )}
            </div>
            <IconInput id="password" icon={Lock} type="password" required />
          </div>

          {mode === "signup" && (
            <div className="grid gap-1.5">
              <Label htmlFor="confirm" className={LABEL}>Confirm password</Label>
              <IconInput id="confirm" icon={Lock} type="password" required />
            </div>
          )}

          <div className="flex flex-col gap-2 mt-auto pt-1">
            <Button
              type="submit"
              className="w-full h-7 text-xs bg-brand hover:bg-brand-hover text-white font-semibold rounded-md shadow-sm"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>

            <p className="text-[10px] text-center text-muted-foreground">
              {mode === "signin" ? "No account? " : "Already registered? "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-brand hover:text-brand-hover font-medium transition-colors"
              >
                {mode === "signin" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
