import { useMemo, useState } from "react";
import { skillGroups } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const accentVar: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  pink: "var(--pink)",
};

type Item = {
  name: string;
  level: string;
  note: string;
  logo: string;
  category: string;
  color: string;
  icon: string;
};

const allSkills: Item[] = skillGroups.flatMap((g) =>
  g.skills.map((s) => ({
    name: s.name,
    level: s.level,
    note: s.note,
    logo: s.logo,
    category: g.category,
    color: accentVar[g.accent] ?? "var(--cyan)",
    icon: g.icon,
  })),
);

const DARK_LOGOS = new Set(["express", "jsonwebtokens", "vercel", "github", "nextdotjs", "apachekafka", "c", "leetcode"]);

const logoSrc = (slug: string) =>
  `https://cdn.simpleicons.org/${slug}${DARK_LOGOS.has(slug) ? "/e8e8f0" : ""}`;

function SkillLogo({ item, className = "" }: { item: Item; className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border bg-background/60 p-2 ${className}`}
      style={{ borderColor: item.color }}
    >
      <img
        src={logoSrc(item.logo)}
        alt={`${item.name} logo`}
        loading="lazy"
        className="size-full object-contain"
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
    </span>
  );
}

export function Skills() {
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Item | null>(null);

  const filters = useMemo(
    () => [{ category: "All", icon: "sparkles" }, ...skillGroups.map((g) => ({ category: g.category, icon: g.icon }))],
    [],
  );

  const items = active === "All" ? allSkills : allSkills.filter((s) => s.category === active);

  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Tech Stack"
        title="Skills & Expertise"
        desc="My technical toolkit — filter by stack, hover for a quick note, tap a card for details."
      />

      <Reveal className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.category}
            onClick={() => setActive(f.category)}
            aria-pressed={active === f.category}
            className={`mono inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] transition-all sm:px-3.5 sm:text-xs ${
              active === f.category
                ? "border-primary/50 text-primary shadow-[var(--glow-cyan)]"
                : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
            }`}
          >
            <Icon name={f.icon} className="size-3.5 shrink-0" />
            <span className="truncate">{f.category}</span>
          </button>
        ))}
      </Reveal>

      <TooltipProvider delayDuration={150}>
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((s, i) => (
            <Reveal key={`${s.category}-${s.name}`} delay={Math.min(i, 8) * 0.04}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className="block h-full w-full text-left"
                    aria-label={`${s.name} details`}
                  >
                    <TiltCard max={7} className="h-full">
                      <article className="panel h-full overflow-hidden p-4 sm:p-5">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                          style={{ background: s.color }}
                        />
                        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold">{s.name}</h3>
                            <p className="mono mt-0.5 truncate text-[10px] uppercase tracking-widest" style={{ color: s.color }}>
                              {s.level}
                            </p>
                          </div>
                          <SkillLogo
                            item={s}
                            className="size-11 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                          />
                        </div>
                      </article>
                    </TiltCard>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-56 border border-border bg-popover text-xs text-popover-foreground">
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 opacity-80">{s.note}</p>
                </TooltipContent>
              </Tooltip>
            </Reveal>
          ))}
        </div>
      </TooltipProvider>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <SkillLogo item={selected} className="size-12" />
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-base">{selected.name}</DialogTitle>
                    <p className="mono text-[10px] uppercase tracking-widest" style={{ color: selected.color }}>
                      {selected.level}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <DialogDescription className="text-sm leading-relaxed">{selected.note}</DialogDescription>
              <div className="mono flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                <span className="rounded-lg border border-border px-2.5 py-1 text-muted-foreground">
                  {selected.category}
                </span>
                <span className="rounded-lg border px-2.5 py-1" style={{ borderColor: selected.color, color: selected.color }}>
                  {selected.level}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
