import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send, Check, Copy, Loader2, AlertCircle, Sparkles, MessageSquare, Terminal } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon, FacebookIcon, WhatsappIcon } from "./BrandIcons";
import { track } from "./analytics";
import { sendDirectMessage } from "@/lib/supabase";
import { toast } from "sonner";

const socials = [
  { href: profile.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: profile.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: profile.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
];

const intentPills = [
  "Software Engineering Role",
  "Full-Stack Contract",
  "Architecture Review",
  "General Inquiry",
];

const FORMSPREE_READY = profile.formspreeId && profile.formspreeId !== "YOUR_FORM_ID";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<string>("Software Engineering Role");
  const [message, setMessage] = useState<string>("");

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      // clipboard API unavailable
    }
  };

  const handleIntentClick = (intent: string) => {
    setSelectedIntent(intent);
    if (!message || intentPills.some((p) => message.startsWith(`[${p}]`))) {
      const cleanMsg = message.replace(/^\[.*?\]\s*/, "");
      setMessage(`[${intent}] ${cleanMsg}`);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot
    if (fd.get("_gotcha")) return;

    const senderName = (fd.get("name") as string)?.trim() || "Visitor";
    const senderEmail = (fd.get("email") as string)?.trim() || "";
    const brief = message.trim();

    if (!senderEmail || !brief) {
      toast.error("Please provide both your email and a message brief.");
      return;
    }

    setStatus("sending");
    try {
      // 1. Save directly into Farhad's dashboard
      await sendDirectMessage({
        name: senderName,
        email: senderEmail,
        message: brief,
        topic: selectedIntent,
      });

      // 2. Dispatch to Formspree if configured
      if (FORMSPREE_READY) {
        try {
          await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
        } catch (err) {
          console.warn("Formspree forward error:", err);
        }
      }

      setStatus("sent");
      track("contact_form_submit", { method: "dashboard_direct" });
      toast.success("Message dispatched! Delivered directly to Farhad's dashboard.");
      form.reset();
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Could not transmit message. Please try again.");
    } finally {
      setTimeout(() => setStatus("idle"), 4500);
    }
  };

  return (
    <Section id="contact" className="overflow-hidden">
      {/* Ambient background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
          style={{ background: "var(--gradient-brand)" }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <SectionHeading
        eyebrow="DIRECT ENGINEERING PIPELINE"
        title="Initiate Contact & Collaboration"
        desc="Available for Software Engineering roles, contract architecture, and high-performance product builds."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
        {/* Left Column: Direct Channels & Status */}
        <Reveal className="space-y-4">
          {/* Availability Status Card */}
          <div className="panel rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card p-5 backdrop-blur-md shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Current Availability
              </span>
            </div>
            <h4 className="text-base font-bold text-foreground">
              Open for Full-Time SWE Roles &amp; Contracts
            </h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Based in Bangladesh (UTC+6) with reliable high-speed infrastructure. Experienced in remote &amp; asynchronous workflows.
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] mono text-muted-foreground border-t border-border/40 pt-2.5">
              <span>Response SLA:</span>
              <span className="text-primary font-semibold">&lt; 4 Hours</span>
            </div>
          </div>

          {/* Contact Methods */}
          {[
            {
              Icon: Mail,
              label: "Primary Email",
              value: profile.email,
              href: `mailto:${profile.email}`,
              copyKey: "email",
            },
            {
              Icon: Phone,
              label: "Direct Phone",
              value: profile.phone,
              href: `tel:${profile.phone.replace(/\s/g, "")}`,
              copyKey: "phone",
            },
            {
              Icon: MapPin,
              label: "Engineering Location",
              value: profile.location,
            },
          ].map(({ Icon: I, label, value, href, copyKey }) => (
            <div
              key={label}
              className="panel flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/75 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/95"
            >
              <a
                href={href}
                className={`flex min-w-0 flex-1 items-center gap-3.5 ${href ? "" : "pointer-events-none"}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-primary shadow-sm">
                  <I className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="truncate text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                    {value}
                  </p>
                </div>
              </a>

              {copyKey && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    copy(value, copyKey);
                  }}
                  aria-label={`Copy ${label.toLowerCase()}`}
                  className="mono grid shrink-0 size-8 place-items-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {copied === copyKey ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              )}
            </div>
          ))}

          {/* Social Links */}
          <div className="panel rounded-2xl border border-border/80 bg-card/75 p-5 backdrop-blur-sm">
            <p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              Direct Engineering Profiles
            </p>
            <div className="flex flex-wrap gap-2.5">
              {socials.map(({ href, label, Icon: I }) => (
                <Magnetic key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-secondary hover:text-primary hover:shadow-[var(--glow-cyan)]"
                  >
                    <I className="size-3.5" />
                    <span>{label}</span>
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right Column: Contact Terminal Form */}
        <Reveal delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="panel relative space-y-4 rounded-3xl border border-border/80 bg-card/85 p-6 sm:p-8 backdrop-blur-md shadow-2xl"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] size-px opacity-0"
              aria-hidden="true"
            />

            {/* Inquire Intent Selector */}
            <div>
              <span className="mono mb-2 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Inquiry Topic
              </span>
              <div className="flex flex-wrap gap-1.5">
                {intentPills.map((pill) => (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => handleIntentClick(pill)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedIntent === pill
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-1">
              <Field name="name" label="Your Name / Organization" placeholder="e.g. Alex Rivera · Tech Corp" />
              <Field name="email" label="Contact Email" type="email" placeholder="alex@company.com" />
            </div>

            <label className="block">
              <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Project / Role Brief
              </span>
              <textarea
                name="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share details about the role, project scope, tech stack, or problem to solve..."
                className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
              />
            </label>

            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:brightness-110 disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: "var(--gradient-brand)" }}
              >
                {status === "sending" && <Loader2 className="size-4 animate-spin" />}
                {status === "sent" && <Check className="size-4 text-emerald-300" />}
                {status === "error" && <AlertCircle className="size-4" />}
                {status === "idle" && <Send className="size-4" />}
                {status === "sending" && "Dispatching to Dashboard..."}
                {status === "sent" && "Delivered to Farhad's Dashboard!"}
                {status === "error" && "Delivery Failed — Please Try Again"}
                {status === "idle" && "Transmit Message"}
              </button>
            </Magnetic>

            <p className="mono text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct transmission to Farhad's live dashboard &amp; {profile.email}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
      />
    </label>
  );
}
