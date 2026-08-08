import { GraduationCap, Award } from "lucide-react";
import { education } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Academic Background"
        title="Education & Training"
        desc="University coursework and intensive engineering bootcamps, in one timeline."
      />

      <div className="relative mx-auto max-w-3xl">
        <div
          aria-hidden
          className="absolute left-4 top-2 h-full w-px sm:left-1/2"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--cyan) 60%, transparent), color-mix(in oklab, var(--violet) 60%, transparent), transparent)",
          }}
        />

        <div className="space-y-8">
          {education.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.05} y={36}>
              <div
                className={`relative pl-12 sm:w-1/2 sm:pl-0 ${
                  i % 2 === 0 ? "sm:pr-10" : "sm:ml-auto sm:pl-10"
                }`}
              >
                <span
                  className={`absolute left-4 top-6 grid size-3 -translate-x-1/2 place-items-center rounded-full sm:left-auto ${
                    i % 2 === 0 ? "sm:-right-1.5 sm:translate-x-0" : "sm:-left-1.5"
                  }`}
                  style={{ background: e.status === "active" ? "var(--lime)" : "var(--cyan)" }}
                >
                  <span
                    className="absolute size-3 rounded-full opacity-50"
                    style={{
                      background: e.status === "active" ? "var(--lime)" : "var(--cyan)",
                      animation: "pulse-ring 2.4s ease-out infinite",
                    }}
                  />
                </span>

                <article className="panel p-5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2">
                    <span className="mono rounded-md border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                      {e.year}
                    </span>
                    <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {e.kind}
                    </span>
                  </div>
                  <h3 className="mt-3 flex items-start gap-2 text-sm font-semibold">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-accent" />
                    {e.title}
                  </h3>
                  <p className="mt-1 text-xs text-primary/80">{e.org}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.body}</p>

                  {e.highlight && (
                    <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber/30 bg-amber/5 p-3 text-xs text-amber">
                      <Award className="mt-0.5 size-3.5 shrink-0" />
                      {e.highlight}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="mono rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p
                    className={`mono mt-3 text-[10px] ${
                      e.status === "active" ? "text-lime" : "text-muted-foreground"
                    }`}
                  >
                    {e.status === "active" ? "● currently enrolled" : "✓ completed"}
                  </p>
                </article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
