"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthDialog } from "@/components/forms/auth_dialog";
import {
  Users,
  TrendingUp,
  Calendar,
  CheckSquare,
  Megaphone,
  Dumbbell,
  BarChart3,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Member Management",
    description:
      "Track every member's profile, membership plan, payment status, and training history in one place.",
  },
  {
    icon: TrendingUp,
    title: "Lead & Prospect Tracking",
    description:
      "Capture walk-ins and enquiries, rate them, follow up, and convert prospects into paying members with one click.",
  },
  {
    icon: BarChart3,
    title: "Membership Pipeline",
    description:
      "Visualise your sales pipeline from prospecting to closed — know exactly where each deal stands.",
  },
  {
    icon: Calendar,
    title: "Class Schedule",
    description:
      "Manage class timetables, trainer assignments, and member bookings all from within the CRM.",
  },
  {
    icon: CheckSquare,
    title: "Tasks & Follow-ups",
    description:
      "Never miss a follow-up. Assign tasks to staff, set due dates, and track completion across the team.",
  },
  {
    icon: Megaphone,
    title: "Promotions & Campaigns",
    description:
      "Run targeted promotions, track campaign spend vs leads generated, and measure ROI.",
  },
];

const stats = [
  { value: "10x", label: "Faster member onboarding" },
  { value: "40%", label: "Higher lead conversion" },
  { value: "360°", label: "Member visibility" },
  { value: "1 app", label: "Everything you need" },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Owner, Iron Peak Gym",
    body: "RepTrack replaced three separate tools we were using. Our staff actually use it every day now.",
    stars: 5,
  },
  {
    name: "Priya N.",
    role: "General Manager, FlexFit",
    body: "The prospect-to-member conversion flow is brilliant. We close 40% more trials than before.",
    stars: 5,
  },
  {
    name: "Leon K.",
    role: "Head Coach, Urban Strength",
    body: "Finally a CRM built for gyms. Everything maps to how we actually work.",
    stars: 5,
  },
];

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useSearchParams()

  useEffect(()=>{
    const isVerified = params.get("verified")
    setIsOpen(isVerified === "true")
  },[])
  
  return (
    <div className="min-h-screen bg-surface text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto px-6 flex items-center justify-between" style={{ maxWidth: "var(--page-max-w)", height: "var(--topbar-height)" }}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">RepTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features"      className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials"  className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing"       className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">

              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>Sign in</Button>

            <Link href="/login">
              <Button size="sm" className="bg-brand hover:bg-brand-hover text-white">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 bg-brand-muted text-brand-muted-fg border-brand/20 hover:bg-brand-muted">
            Built for fitness businesses
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            The CRM that works
            <span className="text-brand"> as hard </span>
            as your members
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            RepTrack gives your gym a complete view of every member, prospect, and deal —
            so your team can focus on building relationships, not chasing spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-brand hover:bg-brand-hover text-white px-8 h-12 text-base">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                See a demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required · Set up in 5 minutes</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-sidebar-bg py-14 px-6">
        <div className="mx-auto grid grid-cols-2 md:grid-cols-4 gap-10" style={{ maxWidth: "var(--page-max-w)" }}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-brand">{s.value}</p>
              <p className="mt-1 text-sm text-sidebar-text">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto" style={{ maxWidth: "var(--page-max-w)" }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Everything your gym needs</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every module maps to how a real gym operates — not a generic business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border p-8 hover:border-brand/30 hover:shadow-md transition-all bg-surface"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted group-hover:bg-brand-muted transition-colors">
                  <f.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why RepTrack */}
      <section className="py-24 px-6 bg-app-bg">
        <div className="mx-auto grid md:grid-cols-2 gap-16 items-center" style={{ maxWidth: "var(--page-max-w)" }}>
          <div>
            <Badge className="mb-4 bg-brand-muted text-brand-muted-fg border-brand/20 hover:bg-brand-muted">
              Why RepTrack
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
              Designed around how gyms actually work
            </h2>
            <div className="space-y-5">
              {[
                { icon: Zap,      text: "Convert prospects to members in a single click — contact, plan, and billing created instantly." },
                { icon: Shield,   text: "Role-based access so front-desk staff see what they need, managers see everything." },
                { icon: Users,    text: "Trainer profiles linked directly to their members and class schedule." },
                { icon: BarChart3,text: "Dashboard built for gym KPIs: churn risk, active plans, revenue, class attendance." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-4">
                  <div className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-muted">
                    <Icon className="h-4 w-4 text-brand-muted-fg" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mock dashboard preview */}
          <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
            <div className="bg-sidebar-bg px-4 py-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-danger" />
              <div className="h-3 w-3 rounded-full bg-warning" />
              <div className="h-3 w-3 rounded-full bg-success" />
              <span className="ml-2 text-xs text-sidebar-text">reptrack-ui.vercel.app/dashboard</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Active Members",  value: "1,247" },
                  { label: "Open Prospects",  value: "38"    },
                  { label: "Monthly Revenue", value: "$42.8k"},
                  { label: "Tasks Due Today", value: "12"    },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-app-bg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-app-bg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">RECENT ACTIVITY</p>
                {[
                  "Sarah K. upgraded to Premium Plan",
                  "New prospect: James L. — trial booked",
                  "Campaign 'Summer Shred' started",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                    <p className="text-xs text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-surface">
        <div className="mx-auto" style={{ maxWidth: "var(--page-max-w)" }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Loved by gym owners</h2>
            <p className="text-muted-foreground">Real feedback from real fitness businesses.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border p-8 shadow-sm bg-surface">
                <div className="flex mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand text-brand" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{t.body}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-sidebar-bg">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex h-16 w-16 mx-auto mb-6 items-center justify-center rounded-2xl bg-brand">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-sidebar-text-bright mb-4">
            Ready to track every rep?
          </h2>
          <p className="text-sidebar-text mb-8 text-lg">
            Join gym owners who&apos;ve replaced their spreadsheets with RepTrack.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-brand hover:bg-brand-hover text-white px-10 h-12 text-base">
              Get started — it&apos;s free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar-bg border-t border-sidebar-border-col py-10 px-6">
        <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4" style={{ maxWidth: "var(--page-max-w)" }}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand">
              <Dumbbell className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-sidebar-text-bright">RepTrack</span>
          </div>
          <p className="text-xs text-sidebar-text">
            © {new Date().getFullYear()} RepTrack. Built for gyms, by people who lift.
          </p>
          <div className="flex gap-6 text-xs text-sidebar-text">
            <a href="#" className="hover:text-sidebar-text-bright transition-colors">Privacy</a>
            <a href="#" className="hover:text-sidebar-text-bright transition-colors">Terms</a>
            <a href="#" className="hover:text-sidebar-text-bright transition-colors">Contact</a>
          </div>
        </div>
        <AuthDialog isOpen={isOpen} onOpenChange={() => {debugger;setIsOpen(!isOpen)}} />
      </footer>
    </div>
  );
}
