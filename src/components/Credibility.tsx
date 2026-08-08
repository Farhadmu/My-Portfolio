import { ExternalLink, Quote } from "lucide-react";
import { certificates, projects, testimonials } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";

export function Credibility() {
  const spotlight = projects.find((p) => p.featured) ?? projects[0];
  if (!spotlight) return null;

  return (
    <Section id="credibility">
      <SectionHeading
        eyebrow="Credibility"
        title="Beyond the Code"
        desc="What people say, what's certified, and one project told as a case study."
      />

      {/* Case study spotlight */}
      <Reveal className="panel mb-10 grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={spotlight.image}
            alt={spotlight.title}
            className="size-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="mono mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">
            Case Study Spotlight
          </p>
          <h3 className="text-2xl font-bold tracking-tight">{spotlight.title}</h3>
          <p className="mono mt-1 text-xs text-muted-foreground">{spotlight.tagline}</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-accent">Problem</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {spotlight.challenges ?? spotlight.description}
              </p>
            </div>
            <div>
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-accent">Approach</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {spotlight.description}
              </p>
            </div>
            <div>
              <p className="mono text-[10px] uppercase tracking-[0.2em] text-accent">Result</p>
              <ul className="mt-1 space-y-1 text-sm leading-relaxed text-muted-foreground">
                {(spotlight.features ?? []).slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {spotlight.live && (
            <a
              href={spotlight.live}
              target="_blank"
              rel="noreferrer"
              className="mono mt-6 inline-flex w-fit items-center gap-1.5 text-xs text-primary hover:underline"
            >
              View full case <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Testimonials */}
        <Reveal>
          <h3 className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Testimonials
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="panel flex h-full flex-col p-5">
                <Quote className="mb-3 size-5 text-primary/50" />
                <p className="flex-1 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="mono text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Certificates */}
        <Reveal delay={0.08}>
          <h3 className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Certificates &amp; Achievements
          </h3>
          <div className="space-y-3">
            {certificates.map((c) => (
              <TiltCard key={c.title} max={4}>
                <div className="panel flex items-center gap-4 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="mono truncate text-[11px] text-muted-foreground">
                      {c.issuer} · {c.date}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
