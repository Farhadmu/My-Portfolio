import { useMemo, useState } from "react";
import { useDynamicSkills } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Icon } from "./Icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, X, Sparkles, Terminal, Code2, Database, Wrench, ShieldCheck, Layers } from "lucide-react";

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
  value?: number;
};

const DARK_LOGOS = new Set(["express", "jsonwebtokens", "vercel", "github", "nextdotjs", "apachekafka", "c", "leetcode"]);

const logoSrc = (slug: string) =>
  `https://cdn.simpleicons.org/${slug}${DARK_LOGOS.has(slug) ? "/e8e8f0" : ""}`;

function SkillLogo({ item, className = "" }: { item: Item; className?: string }) {
  return (
    <span
      className={`relative inline-grid place-items-center rounded-xl border border-border/80 bg-secondary/50 p-2 shadow-inner transition-transform group-hover:scale-105 ${className}`}
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
  const { skillGroups } = useDynamicSkills();
  const [active, setActive] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Item | null>(null);

  const allSkills: Item[] = useMemo(
    () =>
      skillGroups.flatMap((g) =>
        g.skills.map((s) => ({
          name: s.name,
          level: s.level,
          note: s.note,
          logo: s.logo,
          category: g.category,
          color: accentVar[g.accent] ?? "var(--cyan)",
          icon: g.icon,
          value: s.value,
        }))
      ),
    [skillGroups]
  );

  const filters = useMemo(
    () => [
      { category: "All", icon: "sparkles", count: allSkills.length },
      ...skillGroups.map((g) => ({
        category: g.category,
        icon: g.icon,
        count: g.skills.length,
      })),
    ],
    [skillGroups, allSkills.length]
  );

  // Filter by category and search
  const filteredSkills = useMemo(() => {
    return allSkills.filter((s) => {
      const matchCat = active === "All" || s.category === active;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.note.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allSkills, active, search]);

  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="TECHNICAL ARSENAL & TOOLCHAIN"
        title="Skills & Systems Mastery"
        desc="Production-tested technologies across systems, scalable backends, low-latency frontends, databases, and DevOps."
      />

      {/* Interactive Controls Bar: Category Pills + Search */}
      <Reveal className="mb-8 space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const isSelected = active === f.category;
            return (
              <button
                key={f.category}
                onClick={() => setActive(f.category)}
                aria-pressed={isSelected}
                className={`mono inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium transition-all sm:px-3.5 sm:text-xs ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-cyan)]"
                    : "border-border/80 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon name={f.icon} className="size-3.5 shrink-0" />
                <span className="truncate">{f.category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-semibold ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search & Count */}
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tech, framework, or tool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-secondary/40 py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          <span className="mono shrink-0 text-[11px] text-muted-foreground">
            {filteredSkills.length} of {allSkills.length} tools
          </span>
        </div>
      </Reveal>

      {/* Grid of Skill Cards */}
      <TooltipProvider delayDuration={150}>
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSkills.map((s, i) => (
            <Reveal key={`${s.category}-${s.name}`} delay={Math.min(i, 10) * 0.03}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className="block h-full w-full text-left"
                    aria-label={`${s.name} details`}
                  >
                    <TiltCard max={8} className="h-full">
                      <article className="panel relative h-full overflow-hidden border-border/80 bg-card/75 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/95 hover:shadow-lg">
                        {/* Ambient Neon Glow on Hover */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                          style={{ background: s.color }}
                        />

                        {/* Top row: Name & Logo */}
                        <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {s.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span
                                className="mono rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                                style={{
                                  backgroundColor: `color-mix(in oklab, ${s.color} 12%, transparent)`,
                                  color: s.color,
                                  border: `1px solid color-mix(in oklab, ${s.color} 30%, transparent)`,
                                }}
                              >
                                {s.level}
                              </span>
                            </div>
                          </div>
                          <SkillLogo
                            item={s}
                            className="size-11 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                          />
                        </div>

                        {/* Note / Context summary */}
                        <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {s.note}
                        </p>
                      </article>
                    </TiltCard>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-64 border border-border bg-popover p-3 text-xs text-popover-foreground shadow-xl">
                  <p className="font-bold text-foreground">{s.name}</p>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{s.note}</p>
                  <p className="mono mt-2 text-[10px] text-primary">Click for architectural context →</p>
                </TooltipContent>
              </Tooltip>
            </Reveal>
          ))}
        </div>
      </TooltipProvider>

      {/* Technical Inspection Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md border border-border/80 bg-card p-6 shadow-2xl rounded-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <SkillLogo item={selected} className="size-14" />
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-lg font-bold text-foreground">
                      {selected.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="mono rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: `color-mix(in oklab, ${selected.color} 15%, transparent)`,
                          color: selected.color,
                          border: `1px solid color-mix(in oklab, ${selected.color} 40%, transparent)`,
                        }}
                      >
                        {selected.level}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{selected.category}</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 rounded-xl border border-border/60 bg-secondary/40 p-4 space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Terminal className="size-3.5 text-primary" /> Engineering Application &amp; Notes
                </div>
                <DialogDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {selected.note}
                </DialogDescription>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.pop();
                    const skillName = selected.name;
                    setSelected(null);
                    window.dispatchEvent(
                      new CustomEvent("portfolio_filter_skill", { detail: { skill: skillName } })
                    );
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
                >
                  <Sparkles className="size-3.5" />
                  <span>View Projects ({selected.name}) →</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setSelected(null);
                  }}
                  className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
