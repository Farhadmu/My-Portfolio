import { useDynamicServices } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { CheckCircle2, ArrowRight } from "lucide-react";

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
            <TiltCard key={s.title} max={4} className="h-full">
              <article className="panel group flex h-full flex-col justify-between rounded-lg border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_#0f172a] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_#0f172a]">
                <div>
                  {/* Top Row: Icon & Index */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-lg border-2 border-slate-900 bg-amber-100 text-slate-900 shadow-[2px_2px_0px_#0f172a]">
                      <Icon name={s.icon} className="size-5" />
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
                    {s.body}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-4 space-y-1.5 border-t border-dashed border-slate-300 pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate-800">
                      Deliverables &amp; Focus
                    </p>
                    {deliverables.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
                        <CheckCircle2 className="size-3 text-emerald-700 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-5 border-t-2 border-slate-900 pt-3">
                  <a
                    href="#contact"
                    className="font-mono inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all hover:translate-x-1"
                  >
                    Discuss project or hire <ArrowRight className="size-3" />
                  </a>
                </div>
              </article>
            </TiltCard>
          );
        })}
      </div>
    </Section>
  );
}
