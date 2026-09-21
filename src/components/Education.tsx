import { GraduationCap, Award, BookOpen, CheckCircle2, Sparkles, Building2, Calendar, Compass } from "lucide-react";
import { useDynamicEducation } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Education() {
  const { education } = useDynamicEducation();

  return (
    <Section id="education">
      <SectionHeading
        eyebrow="ACADEMIC RIGOR & TRAINING"
        title="Education & Engineering Pedigree"
        desc="Formal computer science degree, rigorous systems coursework, and advanced software engineering bootcamps connected in chronological order."
      />

      {/* Degree Highlight Banner */}
      <Reveal className="mb-12 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-secondary/30 p-6 sm:p-7 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Current Academic Focus
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              B.Sc. in Computer Science &amp; Engineering
            </h3>
            <p className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              Bangladesh Army International University of Science and Technology (BAIUST)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:max-w-xs justify-start sm:justify-end">
            {["Data Structures", "Algorithms", "OS & Networks", "DBMS", "Software Architecture"].map((c) => (
              <span
                key={c}
                className="mono rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-[10px] font-semibold text-foreground/90 shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Connected Timeline Spine Container */}
      <div className="relative mx-auto max-w-4xl">
        {/* Continuous Connected Vertical Spine Line */}
        <div
          aria-hidden
          className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 rounded-full z-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--cyan) 80%, transparent), color-mix(in oklab, var(--violet) 70%, transparent), color-mix(in oklab, var(--lime) 80%, transparent))",
            boxShadow: "0 0 12px rgba(6,182,212,0.35)",
          }}
        />

        <div className="space-y-8 sm:space-y-12">
          {education.map((e, i) => {
            const isActive = e.status === "active";
            const isEven = i % 2 === 0;

            return (
              <Reveal key={e.title + e.year} delay={i * 0.06} y={30}>
                <div
                  className={`relative flex items-center ${
                    isEven ? "sm:flex-row-reverse" : "sm:flex-row"
                  }`}
                >
                  {/* Timeline Glowing Milestone Node (Centered on desktop, Left on mobile) */}
                  <div
                    className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 grid size-8 sm:size-9 place-items-center rounded-full border-2 border-background bg-card shadow-lg"
                    style={{
                      borderColor: isActive ? "var(--lime)" : "var(--cyan)",
                      boxShadow: isActive
                        ? "0 0 16px rgba(132,204,22,0.6)"
                        : "0 0 14px rgba(6,182,212,0.5)",
                    }}
                  >
                    <span
                      className="size-3 sm:size-3.5 rounded-full"
                      style={{
                        background: isActive ? "var(--lime)" : "var(--cyan)",
                      }}
                    />
                    {isActive && (
                      <span
                        className="absolute size-full rounded-full animate-ping opacity-40"
                        style={{ background: "var(--lime)" }}
                      />
                    )}
                  </div>

                  {/* Horizontal Branch Connector Line (Desktop only) */}
                  <div
                    aria-hidden
                    className={`hidden sm:block absolute top-1/2 -translate-y-1/2 h-0.5 w-8 z-0 ${
                      isEven ? "right-1/2 mr-4.5 bg-gradient-to-l" : "left-1/2 ml-4.5 bg-gradient-to-r"
                    } from-primary/60 to-transparent`}
                  />

                  {/* Content Card (Takes half-width on desktop with margin from spine) */}
                  <div className="w-full pl-12 sm:pl-0 sm:w-[calc(50%-2rem)]">
                    <TiltCard max={6}>
                      <article
                        className={`panel group relative overflow-hidden rounded-2xl border p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                          isActive
                            ? "border-primary/50 bg-card/90 shadow-[0_4px_25px_rgba(6,182,212,0.12)]"
                            : "border-border/80 bg-card/75 hover:border-primary/40 hover:bg-card/95"
                        }`}
                      >
                        {/* Top Ambient Glow */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
                          style={{ background: isActive ? "var(--lime)" : "var(--cyan)" }}
                        />

                        {/* Top Meta Row */}
                        <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="mono inline-flex items-center gap-1 rounded-md border border-border bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold text-foreground">
                              <Calendar className="size-3 text-primary" />
                              {e.year}
                            </span>
                            <span className="mono rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              {e.kind}
                            </span>
                          </div>

                          <span
                            className={`mono flex items-center gap-1.5 text-[10px] font-semibold ${
                              isActive ? "text-emerald-400" : "text-muted-foreground"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                isActive ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"
                              }`}
                            />
                            {isActive ? "Currently Enrolled" : "Completed"}
                          </span>
                        </div>

                        {/* Title & Institution */}
                        <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-start gap-2">
                          <GraduationCap className="size-4 shrink-0 text-primary mt-1" />
                          <span>{e.title}</span>
                        </h4>
                        <p className="mt-1 text-xs font-semibold text-primary/90 pl-6">
                          {e.org}
                        </p>

                        {/* Description */}
                        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground pl-6">
                          {e.body}
                        </p>

                        {/* Special Honors Box */}
                        {e.highlight && (
                          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                            <Award className="size-4 shrink-0 mt-0.5 text-amber-400" />
                            <span className="font-medium leading-relaxed">{e.highlight}</span>
                          </div>
                        )}

                        {/* Coursework Tags */}
                        {e.tags && e.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/40 pt-3">
                            {e.tags.map((t) => (
                              <span
                                key={t}
                                className="mono rounded-md border border-border/50 bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    </TiltCard>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
