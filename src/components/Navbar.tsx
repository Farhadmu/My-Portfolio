import { useEffect, useState } from "react";
import { Menu, X, Volume2, VolumeX, FileText, Sun, Moon, Languages } from "lucide-react";
import { navSections, profile } from "@/data/portfolio";
import { Magnetic } from "./Magnetic";
import { isSoundEnabled, setSoundEnabled, sound } from "@/lib/sound";
import { useHomeSectionsConfig, useProfileConfig } from "@/hooks/usePortfolioData";
import { useI18n } from "@/lib/i18n";
import { EasterEggDoodleModal } from "./EasterEggDoodleModal";

export function Navbar() {
  const profileConfig = useProfileConfig();
  const homeSections = useHomeSectionsConfig();
  const { lang, setLanguage, t, isBn } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Easter Egg 5-click tracking on logo
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Filter out hidden sections
  const enabledIds = new Set(
    homeSections.sections.filter((s) => s.enabled).map((s) => s.id)
  );
  const filteredNavSections = navSections.filter((s) => enabledIds.has(s.id));
  const isGuestbookEnabled = enabledIds.has("guestbook");

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail) setSoundOn(customEvent.detail.enabled);
    };
    window.addEventListener("portfolio_sound_changed", handleSoundChange);
    return () => window.removeEventListener("portfolio_sound_changed", handleSoundChange);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) sound.pop();
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("farhad_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("farhad_theme", "light");
    }
    sound.click();
  };

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
    filteredNavSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, [filteredNavSections]);

  const go = (id: string) => {
    sound.click();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2500) {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount >= 5) {
        sound.pop();
        setShowEasterEgg(true);
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
    go("home");
  };

  const openResume = () => {
    sound.pop();
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open_resume_modal"));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-4"
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card px-4 py-2.5 shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] sm:px-5"
        style={{ width: "min(100% - 1.5rem, 72rem)" }}
        aria-label="Primary"
      >
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          aria-label="Go to top (Click 5 times for secret doodle)"
          title="Farhadul Islam (Click 5 times for a secret Easter Egg!)"
        >
          {profileConfig.avatar ? (
            <img
              src={profileConfig.avatar}
              alt={profileConfig.name || profile.name}
              className="size-9 rounded-md object-cover border-2 border-slate-900 dark:border-slate-600 shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] transition-transform duration-200 group-hover:scale-105 active:scale-95"
            />
          ) : (
            <span className="grid size-9 place-items-center rounded-md border-2 border-slate-900 dark:border-slate-600 bg-primary text-sm font-bold text-primary-foreground shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] transition-transform duration-200 group-hover:scale-105 active:scale-95">
              {profile.initials}
            </span>
          )}
          <span className="hidden text-sm font-bold tracking-tight sm:block text-foreground">
            {profileConfig.name ? profileConfig.name.split(" ")[0] : profile.shortName}
            <span className="font-mono block text-[10px] font-normal text-muted-foreground">
              {profileConfig.subRole ? profileConfig.subRole.split("·")[0].trim() : "cse · developer"}
            </span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {filteredNavSections.map((s) => (
            <li key={`${s.id}-${s.label}`}>
              <button
                type="button"
                onClick={() => go(s.id)}
                className={`relative rounded-md px-2.5 py-1.5 text-xs font-bold transition-all ${
                  active === s.id
                    ? "bg-slate-900 text-white dark:bg-primary dark:text-slate-950 shadow-[1px_1px_0px_#0f172a]"
                    : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}

          {isGuestbookEnabled && (
            <li>
              <button
                type="button"
                onClick={() => go("guestbook")}
                className="relative rounded-md px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Guestbook
              </button>
            </li>
          )}

          <li>
            <a
              href="/blog"
              className="relative inline-flex items-center gap-1.5 rounded-md border border-slate-900 dark:border-slate-600 bg-[#fef08a] dark:bg-amber-300 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a] hover:bg-yellow-200"
            >
              <span>Blog</span>
              <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {/* Bangla / English Language Toggle */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              setLanguage(isBn ? "en" : "bn");
            }}
            className="inline-flex items-center gap-1 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card px-2 py-1 text-xs font-mono font-bold text-foreground shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            title="Toggle language (English / বাংলা)"
            aria-label="Toggle language"
          >
            <Languages className="size-3 text-primary" />
            <span className={!isBn ? "text-primary font-extrabold" : "text-muted-foreground"}>EN</span>
            <span className="text-slate-400">/</span>
            <span className={isBn ? "text-rose-600 dark:text-rose-400 font-extrabold" : "text-muted-foreground"}>বাং</span>
          </button>

          {/* Chalkboard / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card p-1.5 text-foreground shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            title={isDark ? "Switch to Day Notebook" : "Switch to Chalkboard Theme"}
            aria-label="Toggle Chalkboard Dark Mode"
          >
            {isDark ? <Sun className="size-4 text-amber-300" /> : <Moon className="size-4 text-slate-700" />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className={`rounded-md border-2 border-slate-900 dark:border-slate-600 p-1.5 shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 ${
              soundOn ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300" : "bg-card text-foreground"
            }`}
            title={soundOn ? "Mute developer SFX" : "Enable developer SFX"}
            aria-label="Toggle sound effects"
          >
            {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>

          <a
            href="/blog"
            className="lg:hidden rounded-md border-2 border-slate-900 dark:border-slate-600 bg-[#fef08a] dark:bg-amber-300 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a]"
          >
            Blog
          </a>

          {/* Quick CV Button */}
          <Magnetic className="hidden sm:inline-block">
            <button
              type="button"
              onClick={openResume}
              className="inline-flex items-center gap-1.5 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
            >
              <FileText className="size-3.5 text-primary" /> View CV
            </button>
          </Magnetic>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setOpen((o) => !o);
            }}
            className="grid size-9 place-items-center rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card text-foreground shadow-[1px_1px_0px_#0f172a] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="mx-auto mt-2 grid max-w-6xl gap-1 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card p-3 shadow-[4px_4px_0px_#0f172a] dark:shadow-[4px_4px_0px_#000] lg:hidden"
          style={{ width: "min(100% - 1.5rem, 72rem)" }}
        >
          {/* Mobile Language Switch */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
            <span className="font-mono text-xs font-bold text-muted-foreground">Language / ভাষা</span>
            <button
              type="button"
              onClick={() => {
                sound.click();
                setLanguage(isBn ? "en" : "bn");
              }}
              className="rounded border border-slate-900 dark:border-slate-700 bg-secondary px-2.5 py-1 text-xs font-mono font-bold"
            >
              {isBn ? "বাংলা (Active)" : "English (Active)"}
            </button>
          </div>

          {filteredNavSections.map((s) => (
            <button
              key={`${s.id}-${s.label}`}
              onClick={() => go(s.id)}
              className="font-mono rounded-md px-3 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary"
            >
              ~/{s.label.toLowerCase()}
            </button>
          ))}
          {isGuestbookEnabled && (
            <button
              onClick={() => go("guestbook")}
              className="font-mono rounded-md px-3 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary"
            >
              ~/guestbook
            </button>
          )}
          <a
            href="/blog"
            className="font-mono rounded-md px-3 py-2 text-left text-xs font-bold text-primary hover:bg-secondary"
          >
            ~/blog
          </a>
          <button
            type="button"
            onClick={openResume}
            className="font-mono rounded-md px-3 py-2 text-left text-xs font-bold text-foreground hover:bg-secondary"
          >
            ~/resume [ view cv ]
          </button>
        </div>
      )}

      {/* Easter Egg Secret Doodle Modal */}
      <EasterEggDoodleModal
        isOpen={showEasterEgg}
        onClose={() => setShowEasterEgg(false)}
      />
    </header>
  );
}
