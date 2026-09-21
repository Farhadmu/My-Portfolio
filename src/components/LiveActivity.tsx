import { ArrowUpRight, Rss, Zap, Play, Clock, Sparkles } from "lucide-react";
import { currentlyBuilding } from "@/data/portfolio";
import { useDynamicBlogs } from "@/hooks/usePortfolioData";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";
import { Link } from "@tanstack/react-router";

export function LiveActivity() {
  const { blogs } = useDynamicBlogs();
  const latestBlogs = blogs.slice(0, 3);

  return (
    <Section id="activity">
      <SectionHeading
        eyebrow="ENGINEERING RADAR & ROADMAP"
        title="Live Sprints & Tech Dispatches"
        desc="Real-time look at current engineering sprints, architectural experiments, and published publications."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Column: Active Engineering Sprints */}
        <Reveal>
          <div className="panel h-full rounded-3xl border border-border/80 bg-card/75 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-3">
                <p className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Active Engineering Sprints
                </p>
                <span className="mono rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Q3/Q4 2026
                </span>
              </div>

              <ul className="space-y-5">
                {currentlyBuilding.map((item, i) => (
                  <li key={item.title} className="relative pl-6">
                    <span
                      className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-primary bg-background shadow-sm"
                    />
                    {i !== currentlyBuilding.length - 1 && (
                      <span className="absolute left-[4.5px] top-4 h-[calc(100%+0.75rem)] w-px bg-border/80" />
                    )}
                    <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        <span className="mono text-[9px] font-semibold uppercase text-primary">
                          Sprint #{i + 1}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {item.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between text-xs text-muted-foreground mono">
              <span>Sprint Methodology: Agile &amp; Clean</span>
              <span className="text-emerald-400">● 100% On-Track</span>
            </div>
          </div>
        </Reveal>

        {/* Right Column: Latest Tech Dispatches & Articles */}
        <Reveal delay={0.08}>
          <div className="panel h-full rounded-3xl border border-border/80 bg-card/75 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-3">
                <p className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                  <Rss className="size-3.5 text-primary" /> Technical Dispatches &amp; Articles
                </p>
                <Link
                  to="/blog"
                  className="mono text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  All publications ↗
                </Link>
              </div>

              <div className="grid gap-3.5">
                {latestBlogs.map((post) => (
                  <TiltCard key={post.id || post.title} max={4}>
                    <Link
                      to="/blog"
                      hash={post.slug}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-secondary/30 p-4 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/60 hover:shadow-md"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="mono rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {post.category || "Full Stack"}
                          </span>
                          {post.videoUrl && (
                            <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400">
                              <Play className="size-2.5 fill-rose-400" /> Video
                            </span>
                          )}
                          <span className="text-[11px] text-muted-foreground">•</span>
                          <span className="mono text-[11px] text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowUpRight className="size-3.5" />
                      </div>
                    </Link>
                  </TiltCard>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Deep architectural breakdowns &amp; code solutions</span>
              <Link to="/blog" className="text-primary font-semibold hover:underline">
                Explore Blog Feed →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
