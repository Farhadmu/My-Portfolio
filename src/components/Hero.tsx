import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { profile, stats } from "@/data/portfolio";
import { Hero3D } from "./three/Hero3D";
import { Magnetic } from "./Magnetic";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { track } from "./analytics";

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden px-5 pb-16 pt-32">
      <div aria-hidden className="grid-bg absolute inset-0" />
      <div
        aria-hidden
        className="absolute -left-40 top-10 size-[34rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--cyan)" }}
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 size-[30rem] rounded-full opacity-20 blur-[130px]"
        style={{ background: "var(--violet)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mono mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-[11px] text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-lime" />
            </span>
            open_to_opportunities
          </p>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <span className="block text-muted-foreground text-lg font-normal sm:text-xl">
              Hello, I am
            </span>
            <span className="text-gradient">{profile.name}</span>
          </h1>

          <p className="mono mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            {profile.role}
            <span className="text-muted-foreground">//</span>
            <span className="text-accent">React &amp; Next.js</span>
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85">
            {profile.tagline}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                onClick={() => go("projects")}
                className="group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--glow-cyan)] transition-transform"
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
                className="inline-flex items-center gap-2 rounded-xl border border-primary/40 px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Download className="size-4" /> Download Resume
              </a>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => go("contact")}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
              >
                <Mail className="size-4" /> Contact Me
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
                className="glass grid size-10 place-items-center rounded-xl text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary"
              >
                <I className="size-4" />
              </a>
            ))}
            <span className="mono ml-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {profile.location}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-square">
            <div className="absolute inset-0">
              <Hero3D />
            </div>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="relative size-40 overflow-hidden rounded-full border border-primary/30 shadow-[var(--glow-violet)] sm:size-52">
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  className="size-full object-cover object-top"
                  width={853}
                  height={1600}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-14 grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
            className="glass rounded-2xl px-4 py-4 text-center"
          >
            <div className="text-xl font-bold text-gradient sm:text-2xl">{s.value}</div>
            <div className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
