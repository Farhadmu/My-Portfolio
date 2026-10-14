import { ArrowRight, Eye, Mail, MapPin, Terminal, ArrowUpRight, MessageSquare, Sparkles } from "lucide-react";
import { profile, stats } from "@/data/portfolio";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { track } from "./analytics";
import { sound } from "@/lib/sound";
import { useHomeSectionsConfig } from "@/hooks/usePortfolioData";
import { HeroPortrait } from "./HeroPortrait";
import { useI18n } from "@/lib/i18n";

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const homeSections = useHomeSectionsConfig();
  const { t, isBn } = useI18n();
  const heroData = homeSections.hero || {
    name: profile.name,
    tagline: profile.tagline,
    intro: profile.intro,
    badgeText: "✦ AVAILABLE FOR HIRE & COLLABORATION",
    location: profile.location,
    photoUrl: profile.photo,
    resumeUrl: profile.resume,
  };

  return (
    <section id="home" className="relative min-h-[92svh] px-5 pb-16 pt-32 overflow-hidden">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left Column: Workshop Header & Introduction */}
        <div>
          {/* Hand-Stamped Sticker Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border-2 border-slate-900 bg-[#fef08a] px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{heroData.badgeText || "✦ AVAILABLE FOR HIRE & COLLABORATION"}</span>
          </div>

          {/* Main Title in Bold Ink */}
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.2rem] text-foreground">
            <span className="block text-slate-600 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-[0.2em] font-mono mb-2 font-bold">
              Software Engineer &amp; Full-Stack Builder
            </span>
            <span className="relative inline-block text-foreground">
              {heroData.name || profile.name}
              {/* Signature Moment: Hand-drawn underline SVG path animation */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full overflow-visible pointer-events-none"
                height="14"
                viewBox="0 0 260 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9.5C65 3.5 185 2 258 8C205 13 85 12 35 11"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  className="text-primary stroke-draw"
                />
              </svg>
            </span>
          </h1>

          {/* Role Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1 font-bold text-foreground shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000]">
              <Terminal className="size-3.5 text-primary" /> CSE @ BAIUST
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 font-bold text-slate-800 dark:text-amber-200 shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000]">
              Systems Architecture · React · Next.js · Node.js
            </span>
          </div>

          {/* Tagline & Intro */}
          <p className="mt-6 max-w-[65ch] text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-semibold">
            {heroData.tagline || profile.tagline}
          </p>
          <p className="mt-2.5 max-w-[65ch] text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-normal">
            {heroData.intro || profile.intro}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  go("projects");
                }}
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a]"
              >
                <span>{t.hero.viewProjects}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>

            <Magnetic>
              <a
                href={heroData.resumeUrl || profile.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("resume_click", { source: "hero" })}
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card px-5 py-3 text-sm font-bold text-foreground shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
              >
                <Eye className="size-4 text-primary" />
                <span>{t.hero.viewResume}</span>
                <ArrowUpRight className="size-3.5 opacity-70" />
              </a>
            </Magnetic>

            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  sound.pop();
                  window.dispatchEvent(new CustomEvent("open_message_modal"));
                }}
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-[#fef08a] dark:bg-amber-300 px-5 py-3 text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
              >
                <MessageSquare className="size-4 text-slate-900" />
                <span>{t.hero.messageMe}</span>
              </button>
            </Magnetic>
          </div>

          {/* Social Links & Location */}
          <div className="mt-8 flex items-center gap-3">
            {[
              { href: profile.github, icon: GithubIcon, label: "GitHub" },
              { href: profile.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, icon: Mail, label: "Email" },
            ].map(({ href, icon: I, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid size-10 place-items-center rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card text-foreground shadow-[2px_2px_0px_#0f172a] dark:shadow-[2px_2px_0px_#000] transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
              >
                <I className="size-4" />
              </a>
            ))}
            <span className="font-mono ml-2 inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <MapPin className="size-3.5 text-rose-600" /> {heroData.location || profile.location}
            </span>
          </div>
        </div>

        {/* Right Column: Hero Portrait with 10s Matrix Code Transition */}
        <HeroPortrait
          initialPhoto={heroData.photoUrl || profile.photo}
          name={heroData.name || profile.name}
        />
      </div>

      {/* Bento Stats / Metrics Grid */}
      <div className="relative mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-card p-4 sm:p-5 text-center shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0f172a]"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-primary">
              {s.value}
            </div>
            <div className="font-mono mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
