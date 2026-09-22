import { useState, useEffect } from "react";
import { ArrowRight, Eye, Mail, MapPin, Terminal, ArrowUpRight, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { profile, stats } from "@/data/portfolio";
import { Hero3D } from "./three/Hero3D";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { track } from "./analytics";
import { sound } from "@/lib/sound";
import { getProfileConfig } from "@/lib/supabase";

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const [profileConfig, setProfileConfig] = useState(getProfileConfig);

  useEffect(() => {
    const handleUpdate = () => setProfileConfig(getProfileConfig());
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, []);
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-32">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div
        aria-hidden
        className="absolute -left-40 top-10 size-[36rem] rounded-full opacity-25 blur-[130px] pointer-events-none"
        style={{ background: "var(--cyan)" }}
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 size-[32rem] rounded-full opacity-20 blur-[140px] pointer-events-none"
        style={{ background: "var(--violet)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Engineering Availability Telemetry Pill */}
          <div className="mono mb-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-400 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.18)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <span className="tracking-wide">ACTIVE SWE PIPELINE · AVAILABLE FOR HIRE</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <span className="block text-muted-foreground/80 text-xs sm:text-sm uppercase tracking-[0.25em] font-mono mb-2">
              Software Engineer &amp; Full-Stack Builder
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
              {profile.name}
            </span>
          </h1>

          <div className="mono mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
              <Terminal className="size-3.5" /> CSE @ BAIUST
            </span>
            <span className="text-muted-foreground/60">//</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
              Systems Architecture · React · Next.js · Node.js
            </span>
          </div>

          <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-foreground/90 font-medium">
            {profile.tagline}
          </p>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                onClick={() => go("projects")}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--glow-cyan)] transition-all hover:scale-[1.02]"
                style={{ background: "var(--gradient-brand)" }}
              >
                View Projects
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("resume_click", { source: "hero" })}
                className="group inline-flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary backdrop-blur-md transition-all duration-300 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
              >
                <Eye className="size-4 text-primary transition-transform group-hover:scale-110" />
                <span>View Resume</span>
                <ArrowUpRight className="size-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => {
                  sound.pop();
                  window.dispatchEvent(new CustomEvent("open_message_modal"));
                }}
                className="group relative inline-flex items-center gap-2.5 rounded-xl border border-primary/50 bg-gradient-to-r from-primary/15 via-card to-accent/15 px-5 py-3 text-sm font-bold text-foreground backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.22)] transition-all duration-300 hover:border-primary hover:bg-primary/25 hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:-translate-y-0.5 active:scale-95"
              >
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                <MessageSquare className="size-4 text-primary transition-transform group-hover:scale-110" />
                <span>Message Farhad</span>
              </button>
            </Magnetic>
          </div>

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
                className="glass grid size-10 place-items-center rounded-xl text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary hover:border-primary/40"
              >
                <I className="size-4" />
              </a>
            ))}
            <span className="mono ml-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary/70" /> {profile.location}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[280px] pb-10 sm:max-w-sm sm:pb-0 lg:max-w-md"
        >
          <div className="relative aspect-square">
            <div className="absolute inset-0">
              <Hero3D />
            </div>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="relative size-44 overflow-hidden rounded-full border-2 border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.35)] ring-4 ring-primary/20 sm:size-56">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={`Portrait of ${profileConfig.name || profile.name}`}
                  className="size-full object-cover object-top"
                  width={853}
                  height={1600}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pro Metrics Bento Grid */}
      <div className="relative mx-auto mt-16 grid w-full max-w-6xl grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 text-center backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card/90 hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.2)] hover:-translate-y-1"
          >
            <div className="absolute top-0 inset-x-4 h-[2px] bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-300 group-hover:via-primary" />
            <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="mono mt-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
