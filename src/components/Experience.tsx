import { ExternalLink, Trophy } from "lucide-react";
import { experience } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { GithubIcon } from "./BrandIcons";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Beyond the Classroom"
        title="Experience & Activities"
        desc="Internships, hackathons and team challenges outside regular coursework."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {experience.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.08}>
            <TiltCard max={6} className="h-full">
              <article className="panel flex h-full flex-col overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklab, var(--card) 95%, transparent), transparent 65%)",
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="mono rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold">{e.title}</h3>
                  <p className="mono mt-1 text-[11px] text-primary/80">
                    {e.org} · {e.period}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{e.body}</p>

                  {e.highlight && (
                    <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/5 p-3 text-xs text-amber">
                      <Trophy className="mt-0.5 size-3.5 shrink-0" />
                      {e.highlight}
                    </p>
                  )}

                  <p className="mt-3 flex-1 text-[11px] leading-relaxed text-muted-foreground/80">
                    <span className="mono text-accent">// detail: </span>
                    {e.extra}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {e.live && (
                      <a
                        href={e.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-medium text-primary-foreground"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <ExternalLink className="size-3" /> Live Demo
                      </a>
                    )}
                    {e.github && (
                      <a
                        href={e.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <GithubIcon className="size-3" /> GitHub
                      </a>
                    )}
                    <span
                      className={`mono ml-auto text-[10px] ${
                        e.status === "active" ? "text-lime" : "text-muted-foreground"
                      }`}
                    >
                      {e.status === "active" ? "● in progress" : "✓ completed"}
                    </span>
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
