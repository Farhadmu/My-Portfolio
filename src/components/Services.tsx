import { services } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What I Can Do"
        title="Services"
        desc="How I can help — from a single interface to a full product build."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <TiltCard max={8} className="h-full">
              <article className="panel h-full overflow-hidden p-6 transition-colors duration-300 group-hover:border-primary/40">
                <span
                  className="mb-4 grid size-12 place-items-center rounded-2xl border border-border transition-all duration-500 group-hover:rotate-[8deg] group-hover:shadow-[var(--glow-cyan)]"
                  style={{ background: "var(--gradient-soft, var(--secondary))" }}
                >
                  <Icon name={s.icon} className="size-5 text-primary" />
                </span>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
                <span
                  aria-hidden
                  className="mono mt-4 block text-[10px] uppercase tracking-[0.25em] text-primary/0 transition-colors duration-300 group-hover:text-primary/80"
                >
                  0{i + 1} — available
                </span>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
