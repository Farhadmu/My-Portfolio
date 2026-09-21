import { useState, useMemo } from "react";
import {
  ExternalLink,
  Trophy,
  Calendar,
  Sparkles,
  CheckCircle,
  Briefcase,
  Layers,
  Info,
  X,
} from "lucide-react";
import { useDynamicExperience } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { GithubIcon } from "./BrandIcons";

export function Experience() {
  const { experience } = useDynamicExperience();
  const [activeTag, setActiveTag] = useState<string>("All");
  const [selectedExp, setSelectedExp] = useState<any | null>(null);

  // Derive unique tags
  const tags = useMemo(() => {
    const set = new Set<string>();
    experience.forEach((e) => {
      e.tags?.forEach((t: string) => set.add(t));
    });
    return ["All", ...Array.from(set)];
  }, [experience]);

  // Filter experience items
  const filtered = useMemo(() => {
    if (activeTag === "All") return experience;
    return experience.filter((e) => e.tags?.includes(activeTag));
  }, [experience, activeTag]);

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Beyond the Classroom"
        title="Hackathons & Experience"
        desc="24-hour onsite hackathons, competitive engineering sprints, and remote internships."
      />

      {/* Filter Tabs */}
      <Reveal className="mb-8 flex flex-wrap justify-center gap-2">
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`mono inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "border border-primary/50 bg-primary/15 text-primary shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "border border-border/70 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span>{tag}</span>
            </button>
          );
        })}
      </Reveal>

      {/* Grid of Pro Cards */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {filtered.map((e, i) => (
          <Reveal key={e.title + i} delay={i * 0.08} className="h-full">
            <TiltCard max={5} className="h-full">
              <article className="panel group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                {/* Image Header */}
                <div className="relative h-56 w-full overflow-hidden border-b border-border/40 bg-secondary/30">
                  {e.image ? (
                    <img
                      src={e.image}
                      alt={e.title}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full bg-gradient-to-br from-primary/10 via-secondary to-background grid place-items-center">
                      <Briefcase className="size-10 text-primary/40" />
                    </div>
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent"
                  />

                  {/* Top Status & Tags */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`mono rounded-lg border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md ${
                        e.status === "active"
                          ? "border-lime/40 bg-lime/15 text-lime"
                          : "border-primary/40 bg-primary/15 text-primary"
                      }`}
                    >
                      {e.status === "active" ? "● Active" : "✓ Completed"}
                    </span>

                    <span className="mono rounded-lg border border-border/80 bg-background/85 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-md flex items-center gap-1">
                      <Calendar className="size-3" /> {e.period}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {e.title}
                    </h3>
                    <p className="mono text-xs font-medium text-primary/90 mt-0.5">
                      {e.org}
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex flex-1 flex-col p-5 justify-between">
                  <div>
                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {e.tags?.map((t: string) => (
                        <span
                          key={t}
                          className="mono rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {e.body}
                    </p>

                    {/* Highlight Box */}
                    {e.highlight && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/5 p-3 text-xs text-amber font-medium">
                        <Trophy className="mt-0.5 size-4 shrink-0 text-amber" />
                        <span>{e.highlight}</span>
                      </div>
                    )}

                    {/* Extra Detail */}
                    {e.extra && (
                      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/80 line-clamp-2">
                        <span className="mono text-primary">// details: </span>
                        {e.extra}
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex items-center gap-2">
                      {e.live && (
                        <a
                          href={e.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="size-3" /> Live Demo
                        </a>
                      )}
                      {e.github && (
                        <a
                          href={e.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <GithubIcon className="size-3" /> Repo
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedExp(e)}
                      className="mono inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Info className="size-3.5" /> Full Story
                    </button>
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* Experience Details Modal */}
      {selectedExp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedExp(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedExp(null)}
              className="absolute right-4 top-4 rounded-xl border border-border bg-secondary/80 p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <span>{selectedExp.org}</span>
              <span>•</span>
              <span>{selectedExp.period}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {selectedExp.title}
            </h2>

            {selectedExp.image && (
              <img
                src={selectedExp.image}
                alt={selectedExp.title}
                className="mt-4 aspect-video w-full rounded-2xl object-cover border border-border/50"
              />
            )}

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>{selectedExp.body}</p>
              {selectedExp.extra && <p className="text-foreground/90">{selectedExp.extra}</p>}
            </div>

            {selectedExp.highlight && (
              <div className="mt-4 rounded-xl border border-amber/40 bg-amber/10 p-3.5 text-xs text-amber font-semibold flex items-center gap-2">
                <Trophy className="size-4 shrink-0" />
                <span>{selectedExp.highlight}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-2">
                {selectedExp.live && (
                  <a
                    href={selectedExp.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <ExternalLink className="size-3.5" /> Open Project Link
                  </a>
                )}
                {selectedExp.github && (
                  <a
                    href={selectedExp.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                  >
                    <GithubIcon className="size-3.5" /> Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
