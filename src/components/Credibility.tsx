import { useState, useEffect } from "react";
import { ExternalLink, Quote, Award, Trophy, BadgeCheck, CheckCircle2, Star, Sparkles, Layers } from "lucide-react";
import {
  useDynamicProjects,
  useDynamicTestimonials,
  useDynamicCertificates,
} from "@/hooks/usePortfolioData";
import { getSpotlightConfig, type CaseStudySpotlightConfig } from "@/lib/supabase";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";

export function Credibility() {
  const { projects } = useDynamicProjects();
  const { testimonials } = useDynamicTestimonials();
  const { certificates } = useDynamicCertificates();
  const [spotlightConfig, setSpotlightConfig] = useState<CaseStudySpotlightConfig>(getSpotlightConfig());

  useEffect(() => {
    setSpotlightConfig(getSpotlightConfig());
    const handleUpdate = () => setSpotlightConfig(getSpotlightConfig());
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, []);

  const selectedProject =
    projects.find((p) => p.slug === spotlightConfig.slug) ??
    projects.find((p) => p.featured) ??
    projects[0];

  const spotlight = {
    title: spotlightConfig.title || selectedProject?.title || "FixItNow",
    tagline: spotlightConfig.tagline || selectedProject?.tagline || "Home Service Marketplace",
    category: spotlightConfig.category || selectedProject?.category || "Full Stack Architecture",
    image: spotlightConfig.image || selectedProject?.image || "",
    live: spotlightConfig.live !== undefined ? spotlightConfig.live : selectedProject?.live,
    problem:
      spotlightConfig.problem ||
      selectedProject?.challenges ||
      selectedProject?.description ||
      "Production-grade architectural problem solving.",
    approach:
      spotlightConfig.approach ||
      selectedProject?.description ||
      "Full-stack architecture connecting frontend, backend, and secure authentication.",
    deliverables:
      spotlightConfig.deliverables && spotlightConfig.deliverables.length > 0
        ? spotlightConfig.deliverables
        : selectedProject?.features && selectedProject.features.length > 0
        ? selectedProject.features
        : [
            "Role-based dashboards — dedicated Customer, Technician and Admin flows with JWT + middleware route protection",
            "Booking flow — service + date/time + address, with a visual status stepper",
            "Stripe Checkout payments — full redirect flow with dedicated success/cancel pages",
          ],
    stack:
      spotlightConfig.stack && spotlightConfig.stack.length > 0
        ? spotlightConfig.stack
        : selectedProject?.stack ?? selectedProject?.tech ?? ["Next.js", "TypeScript", "Tailwind CSS"],
  };

  return (
    <Section id="credibility">
      <SectionHeading
        eyebrow="ENGINEERING PROOF & ENDORSEMENTS"
        title="Production Credibility & Social Proof"
        desc="Real-world case study architecture, mentor and team recommendations, and verified certifications."
      />

      {/* Case Study Spotlight: Deep Architectural Breakdown */}
      <Reveal className="panel mb-12 grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/60 shadow-lg group">
          {spotlight.image ? (
            <img
              src={spotlight.image}
              alt={spotlight.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-[300px] max-h-[460px]"
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-secondary/50 p-8 text-center text-muted-foreground">
              <Layers className="size-12 opacity-40 mb-2" />
              <p className="text-xs">No Cover Image</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="mono rounded-lg border border-primary/40 bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              {spotlight.category}
            </span>
            {spotlight.live && (
              <a
                href={spotlight.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
              >
                Live Production ↗
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
              <p className="mono text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                Featured Architectural Case Study
              </p>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {spotlight.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
              {spotlight.tagline}
            </p>
          </div>

          <div className="space-y-3.5 border-y border-border/50 py-4 text-xs sm:text-sm leading-relaxed">
            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400">
                The Core Problem
              </p>
              <p className="mt-1 text-muted-foreground">
                {spotlight.problem}
              </p>
            </div>

            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Architectural Approach
              </p>
              <p className="mt-1 text-muted-foreground">
                {spotlight.approach}
              </p>
            </div>

            <div>
              <p className="mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Measurable Impact &amp; Deliverables
              </p>
              <ul className="mt-1.5 space-y-1.5 text-muted-foreground">
                {spotlight.deliverables.slice(0, 4).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {spotlight.stack.map((t) => (
              <span
                key={t}
                className="mono rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-foreground/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Testimonials & Verified Achievements Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Testimonials */}
        <Reveal>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="mono text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-2">
              <Quote className="size-3.5 text-primary" /> Verified Recommendations &amp; Feedback
            </h3>
            <span className="mono text-[10px] text-primary">Team &amp; Supervisors</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {testimonials.map((t) => {
              const rating = t.rating || 5;
              return (
                <TiltCard key={t.id || t.name} max={6} className="h-full">
                  <article className="panel flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/75 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/95 hover:shadow-lg">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rating)].map((_, idx) => (
                            <Star key={idx} className="size-3 fill-amber-400" />
                          ))}
                        </div>
                        <BadgeCheck className="size-4 text-primary" />
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 italic">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="mt-4 border-t border-border/40 pt-3 flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs grid place-items-center border border-primary/20">
                        {t.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{t.name}</p>
                        <p className="mono text-[10px] text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              );
            })}
          </div>
        </Reveal>

        {/* Certificates & Honors */}
        <Reveal delay={0.08}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="mono text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-2">
              <Trophy className="size-3.5 text-amber-400" /> Verified Certifications &amp; Honors
            </h3>
            <span className="mono text-[10px] text-amber-400">Awards &amp; Programs</span>
          </div>

          <div className="space-y-3">
            {certificates.map((c) => (
              <TiltCard key={c.id || c.title} max={4}>
                <div className="panel group flex items-center gap-3.5 rounded-2xl border border-border/80 bg-card/75 p-3.5 sm:p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/95 hover:shadow-md">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/40 shadow-sm">
                    <Icon name={c.icon || "award"} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {c.title}
                    </p>
                    <p className="mono truncate text-[11px] text-muted-foreground mt-0.5">
                      {c.issuer} · <span className="text-primary/90 font-semibold">{c.date}</span>
                    </p>
                  </div>
                  <BadgeCheck className="size-4 shrink-0 text-emerald-400/80" />
                </div>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

