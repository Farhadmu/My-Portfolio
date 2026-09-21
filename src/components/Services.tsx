import { useDynamicServices } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { CheckCircle2, ArrowRight, Sparkles, Terminal, Code2, Layers } from "lucide-react";

// Deliverable badges per category
const deliverablesMap: Record<string, string[]> = {
  "Web Development": ["Full-Stack Architecture", "Next.js 15 & React 19", "Clean REST / tRPC APIs", "Docker Deployment"],
  "Frontend Development": ["Low-Latency Rendering", "60fps Micro-interactions", "Accessible Semantic UI", "Responsive Design"],
  "Backend Development": ["Scalable API Contracts", "PostgreSQL / MongoDB Models", "JWT & Session Security", "Redis In-Memory Caching"],
  "Software Development": ["Strict TypeScript Typing", "Decoupled Clean Architecture", "Comprehensive Unit Tests", "Maintainable Codebase"],
  "UI/UX Implementation": ["Pixel-Accurate Figma Code", "Tailwind Design Systems", "Zero Layout Shifts", "Fluid Mobile Experience"],
  "Problem Solving": ["Algorithmic Optimization", "Low Latency & High Throughput", "Memory Profiling", "System Bottleneck Fixes"],
};

export function Services() {
  const { services } = useDynamicServices();

  return (
    <Section id="services">
      <SectionHeading
        eyebrow="ENGINEERING SOLUTIONS & VALUE"
        title="Software Engineering Capabilities"
        desc="From robust backend APIs and high-concurrency architectures to pixel-precise, low-latency web interfaces."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const deliverables = deliverablesMap[s.title] || [
            "Production-Grade Quality",
            "Clean Architecture",
            "Continuous Support",
            "Strict SLAs",
          ];

          return (
            <Reveal key={s.title} delay={i * 0.05}>
              <TiltCard max={7} className="h-full">
                <article className="panel group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/75 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/95 hover:shadow-xl">
                  {/* Subtle Accent Glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div>
                    {/* Top Row: Icon & Index */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-2xl border border-border/80 bg-secondary/60 text-primary shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary/10">
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span className="mono text-xs font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {s.body}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="mt-4 space-y-1.5 border-t border-border/40 pt-3">
                      <p className="mono text-[10px] uppercase tracking-wider font-semibold text-primary/80">
                        Deliverables &amp; Focus
                      </p>
                      {deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-[11px] text-foreground/80">
                          <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="mt-5 border-t border-border/40 pt-3">
                    <a
                      href="#contact"
                      className="mono inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-90 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      Discuss project or hire <ArrowRight className="size-3" />
                    </a>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
