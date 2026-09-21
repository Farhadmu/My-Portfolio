import { useEffect, useState } from "react";
import { Eye, Menu, X } from "lucide-react";
import { navSections, profile } from "@/data/portfolio";
import { Magnetic } from "./Magnetic";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0.01, 0.25, 0.6] },
    );
    navSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5 ${
          scrolled ? "glass shadow-[var(--shadow-depth)]" : "border border-transparent"
        }`}
        style={{ width: "min(100% - 1.5rem, 72rem)" }}
        aria-label="Primary"
      >
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2.5 text-left"
          aria-label="Go to top"
        >
          <span
            className="grid size-9 place-items-center rounded-xl text-sm font-bold text-primary-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            {profile.initials}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            {profile.shortName}
            <span className="mono block text-[10px] font-normal text-muted-foreground">
              cse · developer
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navSections.map((s) => (
            <li key={`${s.id}-${s.label}`}>
              <button
                onClick={() => go(s.id)}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  active === s.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
                {active === s.id && (
                  <span
                    className="absolute inset-x-2 -bottom-0.5 h-px"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                )}
              </button>
            </li>
          ))}
          <li>
            <a
              href="/blog"
              className="relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Blog
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/blog"
            className="lg:hidden rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
          >
            Blog
          </a>
          <Magnetic className="hidden sm:inline-block">
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center gap-2 rounded-xl border border-primary/40 px-3.5 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
            >
              <Eye className="size-3.5" /> view resume
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            className="glass grid size-10 place-items-center rounded-xl lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 grid max-w-6xl gap-1 rounded-2xl p-3 lg:hidden" style={{ width: "min(100% - 1.5rem, 72rem)" }}>
          {navSections.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className="mono rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              ~/{s.label.toLowerCase()}
            </button>
          ))}
          <a
            href="/blog"
            className="mono rounded-lg px-3 py-2.5 text-left text-sm font-medium text-primary hover:bg-secondary"
          >
            ~/blog [ live tech feed ]
          </a>
          <a
            href="/admin"
            className="mono rounded-lg px-3 py-2.5 text-left text-xs text-muted-foreground hover:bg-secondary"
          >
            ~/admin [ cms portal ]
          </a>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="mono rounded-lg px-3 py-2.5 text-sm text-primary"
          >
            [ view resume ]
          </a>
        </div>
      )}
    </header>
  );
}
