import { githubStats, languageBars, profile } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { Icon } from "./Icon";
import { GithubIcon } from "./BrandIcons";

const accent: Record<string, string> = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  lime: "var(--lime)",
  amber: "var(--amber)",
  pink: "var(--pink)",
};

const terminalLines = [
  { p: "farhad@garuda", c: "~/dev", cmd: "git log --oneline --since='1 week'" },
  { out: "feat(arthub): stripe subscription tiers + admin analytics" },
  { out: "fix(drivefleet): jwt cookie refresh on protected routes" },
  { out: "perf(portfolio): lazy-load r3f scene, -38% initial JS" },
  { p: "farhad@garuda", c: "~/dev", cmd: "npm run build && vercel --prod" },
  { ok: "✓ build succeeded · deployed in 14.2s" },
];

export function GithubDash() {
  return (
    <Section id="github">
      <SectionHeading
        eyebrow="Developer Dashboard"
        title="Code & Contributions"
        desc="A live look at where the commits go — repositories, languages and coding rhythm."
      />

      <Reveal className="mb-5 flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/5 px-5 py-3.5">
        <Icon name="flame" className="size-5 shrink-0 text-amber" />
        <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">
          <span className="font-semibold text-amber">
            {githubStats.find((s) => s.label === "Longest Streak")?.value ?? "38 days"} streak
          </span>{" "}
          — daily commits across active repos. Still going.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="grid gap-4">
          <Reveal className="grid grid-cols-2 gap-4">
            {githubStats.map((s) => (
              <div key={s.label} className="panel p-4">
                <Icon name={s.icon} className="mb-2 size-4 text-primary" />
                <p className="text-xl font-bold text-gradient">{s.value}</p>
                <p className="mono mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.08} className="panel p-5">
            <h3 className="mono mb-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Language Breakdown
            </h3>
            <div className="space-y-3">
              {languageBars.map((l) => (
                <div key={l.name}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-foreground">{l.name}</span>
                    <span className="mono text-muted-foreground">{l.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${l.pct}%`, background: accent[l.accent] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12} className="panel p-5">
            <h3 className="mono mb-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Contribution Activity
            </h3>
            <Heatmap />
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="mono mt-4 inline-flex items-center gap-2 text-[11px] text-primary hover:underline"
            >
              <GithubIcon className="size-3.5" /> github.com/{profile.githubUser}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-destructive/80" />
            <span className="size-2.5 rounded-full" style={{ background: "var(--amber)" }} />
            <span className="size-2.5 rounded-full" style={{ background: "var(--lime)" }} />
            <span className="mono ml-2 text-[11px] text-muted-foreground">zsh — farhad@garuda</span>
          </div>
          <div className="mono space-y-2 p-5 text-[12px] leading-relaxed">
            {terminalLines.map((l, i) => (
              <p key={i} className="animate-fade-in" style={{ animationDelay: `${i * 90}ms` }}>
                {l.cmd && (
                  <>
                    <span className="text-lime">{l.p}</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-cyan">{l.c}</span>
                    <span className="text-muted-foreground">$ </span>
                    <span className="text-foreground">{l.cmd}</span>
                  </>
                )}
                {l.out && <span className="text-muted-foreground">{l.out}</span>}
                {l.ok && <span className="text-lime">{l.ok}</span>}
              </p>
            ))}
            <p className="mono text-[12px]">
              <span className="text-lime">farhad@garuda</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-cyan">~/dev</span>
              <span className="text-muted-foreground">$ </span>
              <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-primary align-middle" />
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Deterministic pseudo-random contribution grid (no hydration mismatch). */
function Heatmap() {
  const weeks = 26;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const n = Math.abs(v);
    return n > 0.8 ? 4 : n > 0.62 ? 3 : n > 0.42 ? 2 : n > 0.22 ? 1 : 0;
  });

  return (
     <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1">
      {cells.map((lvl, i) => (
        <span
          key={i}
          title={`${lvl} contributions`}
          className="size-2 shrink-0 rounded-[3px] sm:size-2.5"
          style={{
            background:
              lvl === 0
                ? "var(--muted)"
                : `color-mix(in oklab, var(--cyan) ${lvl * 24}%, var(--muted))`,
          }}
        />
      ))}
    </div>
  );
}
