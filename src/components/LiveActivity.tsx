import { ArrowUpRight, Rss } from "lucide-react";
import { blogPosts, currentlyBuilding } from "@/data/portfolio";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function LiveActivity() {
  return (
    <Section id="activity">
      <SectionHeading
        eyebrow="Live Activity"
        title="What I'm Up To"
        desc="Currently building, and the latest from the blog."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="panel h-full p-6">
            <p className="mono mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-lime" />
              </span>
              Currently Building
            </p>
            <ul className="space-y-5">
              {currentlyBuilding.map((item, i) => (
                <li key={item.title} className="relative pl-6">
                  <span
                    className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-primary"
                    style={{ background: "var(--background)" }}
                  />
                  {i !== currentlyBuilding.length - 1 && (
                    <span className="absolute left-[4.5px] top-4 h-[calc(100%+0.75rem)] w-px bg-border" />
                  )}
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel h-full p-6">
            <p className="mono mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Rss className="size-3.5 text-primary" /> From the Blog
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {blogPosts.map((post) => (
                <TiltCard key={post.title} max={6}>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="mono mb-2 text-[10px] text-muted-foreground">{post.date}</span>
                    <p className="text-sm font-semibold leading-snug text-foreground">{post.title}</p>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mono mt-3 inline-flex items-center gap-1 text-[11px] text-primary opacity-80 transition-opacity group-hover:opacity-100">
                      Read on the blog <ArrowUpRight className="size-3" />
                    </span>
                  </a>
                </TiltCard>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
