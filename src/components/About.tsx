import { profile, aboutCards, aboutFocus } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow="About Me"
        title="Who's Behind the Code?"
        desc="A CSE undergraduate who ships — curious about systems, obsessed with clean interfaces."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="panel overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-44">
              <img
                src={profile.photo}
                alt={profile.name}
                className="size-full object-cover"
                loading="lazy"
                width={256}
                height={352}
              />
              <span className="mono absolute bottom-1.5 left-1.5 rounded-md bg-background/80 px-2 py-0.5 text-[10px] text-primary">
                {profile.shortName}
              </span>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                I'm a <strong className="text-foreground">Computer Science &amp; Engineering student</strong> at{" "}
                <strong className="text-primary">BAIUST</strong>, building modern, performant and
                user-friendly web products while deepening my CS fundamentals.
              </p>
              <p>
                My journey started with a simple question — how do websites actually come to life?
                That curiosity became a craft: clean, functional interfaces backed by real APIs and
                real deployments.
              </p>
              <p>
                Outside of coding I enjoy competitive programming, exploring open-source tooling on
                my Garuda Linux setup, and thinking about how technology solves real problems.
              </p>
            </div>
          </div>

          <ul className="mt-6 grid gap-2">
            {aboutFocus.map((f) => (
              <li key={f} className="mono flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-primary">→</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {["⚽ Sports", "🎮 Gaming", "📚 Reading", "🧩 Problem Solving", "🐧 Linux"].map((h) => (
              <span
                key={h}
                className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {aboutCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <TiltCard className="h-full">
                <article className="panel h-full p-5 transition-colors duration-300 group-hover:border-primary/40">
                  <span className="mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
