import { useMemo, useState } from "react";
import { ExternalLink, ArrowUpRight, Search, X } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { GithubIcon } from "./BrandIcons";
import { track } from "./analytics";

// Curated set of chips — kept short so the row never wraps to a third line.
const FILTER_TAGS = [
  "React.js",
  "Next.js 14",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "MongoDB",
  "Firebase",
  "PostgreSQL",
];

export function Projects() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const featured = projects.find((p) => p.featured) ?? projects[0]!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      const matchesTag = !activeTag || p.tech.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  const isFiltering = query.trim() !== "" || activeTag !== null;
  // Featured card stays pinned up top only while browsing unfiltered.
  const rest = isFiltering ? filtered : filtered.filter((p) => p.slug !== featured.slug);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Portfolio"
        title="Projects"
        desc="Real products with real code — every link below is live and clickable."
      />

      {/* Search + tech filter */}
      <Reveal className="mb-8 space-y-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search projects or tech…"
            className="w-full rounded-xl border border-border bg-secondary/40 py-2.5 pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
                className={`mono rounded-full border px-3 py-1 text-[11px] transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {isFiltering && (
          <p className="mono text-[11px] text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"} match
          </p>
        )}
      </Reveal>

      {/* FEATURED — only when not actively filtering */}
      {!isFiltering && (
        <Reveal className="mb-10">
          <TiltCard max={5} scale={1.005}>
            <article className="panel overflow-hidden">
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                <div className="relative overflow-hidden">
                  <img
                    src={featured.image}
                    alt={`${featured.title} preview`}
                    loading="lazy"
                    className="h-64 w-full object-cover object-top transition-transform duration-700 group-hover:scale-105 lg:h-full"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 40%, color-mix(in oklab, var(--card) 85%, transparent))",
                    }}
                  />
                  <span className="mono absolute left-4 top-4 rounded-full border border-primary/40 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
                    featured build
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold sm:text-3xl">
                    <span className="text-gradient">{featured.title}</span>
                  </h3>
                  <p className="mono mt-1 text-xs text-muted-foreground">{featured.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {featured.description}
                  </p>

                  {featured.features && (
                    <ul className="mt-4 space-y-1.5">
                      {featured.features.map((f) => (
                        <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                          <span className="text-accent">▸</span>
                          {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {featured.stack.slice(0, 10).map((t) => (
                    <span
                      key={t}
                      className="mono rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <ProjectLinks project={featured} />
                </div>
              </div>
            </div>
          </article>
        </TiltCard>
      </Reveal>
      )}

      {rest.length === 0 ? (
        <p className="mono py-16 text-center text-sm text-muted-foreground">
          No projects match "{query || activeTag}". Try a different search or clear the filter.
        </p>
      ) : (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <TiltCard className="h-full">
              <article className="panel flex h-full flex-col overflow-hidden transition-colors duration-300 group-hover:border-primary/40">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.title} preview`}
                    loading="lazy"
                    className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, color-mix(in oklab, var(--card) 95%, transparent), transparent 60%)",
                    }}
                  />
                  <span className="mono absolute right-3 top-3 rounded-md bg-background/70 px-2 py-0.5 text-[10px] text-primary">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="mono rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="mono text-[11px] text-primary/80">{p.tagline}</p>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  {p.challenges && (
                    <p className="mt-2 max-h-0 overflow-hidden text-[11px] leading-relaxed text-muted-foreground/80 opacity-0 transition-all duration-400 group-hover:max-h-32 group-hover:opacity-100">
                      <span className="mono text-accent">// challenges: </span>
                      {p.challenges}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ProjectLinks project={p} compact />
                  </div>
                </div>
              </article>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      )}
    </Section>
  );
}

function ProjectLinks({
  project,
  compact = false,
}: {
  project: (typeof projects)[number];
  compact?: boolean;
}) {
  const size = compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-sm";
  return (
    <>
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("project_link_click", { project: project.slug, type: "live" })}
          className={`inline-flex items-center gap-1.5 rounded-xl font-medium text-primary-foreground ${size}`}
          style={{ background: "var(--gradient-brand)" }}
        >
          <ExternalLink className={compact ? "size-3" : "size-4"} /> Live Demo
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("project_link_click", { project: project.slug, type: "github" })}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary ${size}`}
        >
          <GithubIcon className={compact ? "size-3" : "size-4"} /> GitHub
        </a>
      )}
      {project.github2 && (
        <a
          href={project.github2.url}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-xl border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent ${size}`}
        >
          <ArrowUpRight className={compact ? "size-3" : "size-4"} /> {project.github2.label}
        </a>
      )}
    </>
  );
}
