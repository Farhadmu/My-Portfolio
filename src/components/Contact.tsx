import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send, Check, Copy, Loader2, AlertCircle } from "lucide-react";
import { profile } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon, FacebookIcon, WhatsappIcon } from "./BrandIcons";
import { track } from "./analytics";

const socials = [
  { href: profile.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: profile.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: profile.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
];

const FORMSPREE_READY = profile.formspreeId && profile.formspreeId !== "YOUR_FORM_ID";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — bots tend to fill every field; real visitors never see this one.
    if (fd.get("_gotcha")) return;

    if (!FORMSPREE_READY) {
      // No Formspree ID configured yet — fall back to the visitor's mail app.
      const subject = encodeURIComponent(`Portfolio contact — ${fd.get("name")}`);
      const body = encodeURIComponent(
        `${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`,
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      track("contact_form_submit", { method: "mailto_fallback" });
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (res.ok) {
        setStatus("sent");
        track("contact_form_submit", { method: "formspree" });
        form.reset();
      } else {
        setStatus("error");
        track("contact_form_error");
      }
    } catch {
      setStatus("error");
      track("contact_form_error");
    } finally {
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <Section id="contact" className="overflow-hidden">
      {/* ambient network background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
          style={{ background: "var(--gradient-brand)" }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <SectionHeading
        eyebrow="Get In Touch"
        title="Let's Build Something"
        desc="Open to internships, freelance work and collaboration. I usually reply within a day."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Reveal className="space-y-4">
          {[
            {
              Icon: Mail,
              label: "Email",
              value: profile.email,
              href: `mailto:${profile.email}`,
              copyKey: "email",
            },
            {
              Icon: Phone,
              label: "Phone",
              value: profile.phone,
              href: `tel:${profile.phone.replace(/\s/g, "")}`,
              copyKey: "phone",
            },
            { Icon: MapPin, label: "Location", value: profile.location },
          ].map(({ Icon: I, label, value, href, copyKey }) => (
            <div
              key={label}
              className="panel flex items-center gap-4 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <a
                href={href}
                className={`flex min-w-0 flex-1 items-center gap-4 ${href ? "" : "pointer-events-none"}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <I className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="truncate text-sm text-foreground">{value}</p>
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
                  className="mono grid shrink-0 size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {copied === copyKey ? (
                    <Check className="size-3.5 text-lime" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
              )}
            </div>
          ))}

          <div className="panel p-5">
            <p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Find me online
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map(({ href, label, Icon: I }) => (
                <Magnetic key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-[var(--glow-cyan)]"
                  >
                    <I className="size-4" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={onSubmit} className="panel space-y-4 p-6 sm:p-8">
            {/* Honeypot field — hidden from real visitors, bots fill it in */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] size-px opacity-0"
              aria-hidden="true"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your Name" placeholder="Jane Doe" />
              <Field name="email" label="Email" type="email" placeholder="jane@company.com" />
            </div>
            <label className="block">
              <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell me about your project…"
                className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
              />
            </label>
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: "var(--gradient-brand)" }}
              >
                {status === "sending" && <Loader2 className="size-4 animate-spin" />}
                {status === "sent" && <Check className="size-4" />}
                {status === "error" && <AlertCircle className="size-4" />}
                {status === "idle" && <Send className="size-4" />}
                {status === "sending" && "Sending…"}
                {status === "sent" &&
                  (FORMSPREE_READY ? "Message sent!" : "Opening your mail app…")}
                {status === "error" && "Something went wrong — try again"}
                {status === "idle" && "Send Message"}
              </button>
            </Magnetic>
            <p className="mono text-center text-[10px] text-muted-foreground">
              {FORMSPREE_READY
                ? `Delivered straight to ${profile.email}`
                : `or email directly at ${profile.email}`}
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
      <span className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
      />
    </label>
  );
}
