import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { profile, navSections } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon, FacebookIcon, WhatsappIcon } from "./BrandIcons";

export function Footer() {
  const socials = [
    { href: profile.github, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: profile.whatsapp, label: "WhatsApp", Icon: WhatsappIcon },
  ];

  const [subscribed, setSubscribed] = useState(false);
  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("newsletter-email");
    // No backend wired up yet — this notifies via a mailto so the request
    // still reaches you. Swap in a real provider (e.g. Buttondown, ConvertKit)
    // once the blog has regular posts.
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      "New update notify request",
    )}&body=${encodeURIComponent(`Please notify: ${email}`)}`;
    setSubscribed(true);
    e.currentTarget.reset();
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative border-t border-border px-5 py-12">
      <div className="mx-auto mb-10 w-full max-w-6xl">
        <div className="panel flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-foreground">Get new posts &amp; project updates</p>
            <p className="mt-1 text-xs text-muted-foreground">
              A note whenever I ship something new or publish on the blog. No spam.
            </p>
          </div>
          <form
            onSubmit={onSubscribe}
            className="flex w-full max-w-sm shrink-0 items-center gap-2 sm:w-auto"
          >
            <input
              name="newsletter-email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full min-w-0 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="mono inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              style={{ background: "var(--gradient-brand)" }}
            >
              {subscribed ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
              {subscribed ? "Done" : "Notify me"}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <a href="#home" className="mono text-lg font-bold text-gradient">
            {profile.initials}_
          </a>
          <p className="mt-2 text-sm font-semibold text-foreground">{profile.name}</p>
          <p className="mono text-[11px] text-muted-foreground">CSE Student · Developer</p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
            {profile.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Quick Links
          </p>
          <ul className="grid grid-cols-2 gap-y-2">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Connect
          </p>
          <div className="flex flex-wrap gap-2">
            {socials.map(({ href, label, Icon: I }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
              >
                <I className="size-4" />
              </a>
            ))}
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mono mt-4 block text-[11px] text-primary hover:underline"
          >
            {profile.email}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-border pt-6 sm:flex-row">
        <p className="mono text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="mono text-[11px] text-muted-foreground">
          Designed &amp; Built with <span className="text-pink">❤</span> and Code
        </p>
      </div>
    </footer>
  );
}
