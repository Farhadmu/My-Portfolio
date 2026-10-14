import { useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Cpu,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { useCaseStudies } from "@/hooks/usePortfolioData";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { sound } from "@/lib/sound";

export const Route = createFileRoute("/work/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Case Study: ${params.slug.toUpperCase()} — Md. Farhadul Islam` },
      {
        name: "description",
        content: `Detailed architecture case study, problem analysis, and results for ${params.slug}.`,
      },
    ],
  }),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { slug } = useParams({ from: "/work/$slug" });
  const { caseStudies } = useCaseStudies();
  const { t, isBn } = useI18n();

  const study = useMemo(() => {
    return (
      caseStudies.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) ||
      caseStudies[0]
    );
  }, [caseStudies, slug]);

  if (!study) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-5 text-center">
        <div>
          <h1 className="text-2xl font-bold">Case study not found</h1>
          <Link to="/" className="mt-4 inline-block underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/"
            onClick={() => sound.click()}
            className="inline-flex items-center gap-2 rounded-md border-2 border-slate-900 dark:border-slate-600 bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
          >
            <ArrowLeft className="size-3.5" />
            <span>{t.work.backToProjects}</span>
          </Link>
        </div>

        {/* Paper Document Container */}
        <article className="relative rounded-2xl border-3 border-slate-900 dark:border-slate-700 bg-card p-6 sm:p-12 shadow-[8px_8px_0px_#0f172a] dark:shadow-[8px_8px_0px_#000]">
          {/* Top Tape Sticker */}
          <div
            aria-hidden
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#fef08a] dark:bg-amber-300 border border-amber-400 rotate-[-1deg] shadow-sm z-20 flex items-center justify-center"
          >
            <span className="font-mono text-[11px] font-bold text-slate-900 tracking-wider">
              ✦ {t.work.caseStudyBadge} ✦
            </span>
          </div>

          {/* Header */}
          <header className="border-b-2 border-slate-900 dark:border-slate-700 pb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              {study.clientOrContext} · {study.timeline}
            </span>

            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl text-foreground font-display leading-tight">
              {study.title}
            </h1>

            <p className="mt-3 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {study.overview}
            </p>

            {/* Meta details bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  <strong className="text-foreground">Role:</strong> {study.role}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-emerald-600" />
                  <strong className="text-foreground">Timeline:</strong> {study.timeline}
                </span>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-2">
                {study.liveUrl && (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
                  >
                    <span>{t.work.liveDemo}</span>
                  </a>
                )}
                {study.githubUrl && (
                  <a
                    href={study.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-card px-3.5 py-1.5 text-xs font-bold text-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-secondary transition-all"
                  >
                    <GithubIcon className="size-3.5" />
                    <span>{t.work.githubRepo}</span>
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Section 1: Problem */}
          <section className="my-10">
            <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-lg mb-4">
              <AlertCircle className="size-5" />
              <h2 className="font-display font-extrabold text-2xl text-foreground">
                {t.work.problemHeading}
              </h2>
            </div>

            <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-rose-50/50 dark:bg-rose-950/20 p-5 shadow-xs">
              <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-normal">
                {study.problem}
              </div>
            </div>
          </section>

          {/* Section 2: Process & Wireframes */}
          <section className="my-10">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-4">
              <Cpu className="size-5" />
              <h2 className="font-display font-extrabold text-2xl text-foreground">
                {t.work.processHeading}
              </h2>
            </div>

            <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-secondary/50 p-5 shadow-xs">
              <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
                {study.process}
              </div>

              {/* Wireframe sketch illustration if provided */}
              {study.wireframeImage && (
                <div className="mt-5 rounded-lg border-2 border-slate-900 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-slate-900 px-3 py-1 text-[10px] font-mono text-slate-300 font-bold flex items-center justify-between">
                    <span>ARCHITECTURAL SKETCH &amp; BLUEPRINT</span>
                    <span>FIGMA / EXCALIDRAW</span>
                  </div>
                  <img
                    src={study.wireframeImage}
                    alt="Wireframe and process sketch"
                    className="w-full h-auto object-cover max-h-72"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Before & After Image Slider */}
          <section className="my-10">
            <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg mb-4">
              <Sparkles className="size-5" />
              <h2 className="font-display font-extrabold text-2xl text-foreground">
                {t.work.beforeAfterHeading}
              </h2>
            </div>

            <BeforeAfterSlider
              beforeImage={study.beforeImage}
              afterImage={study.afterImage}
              beforeLabel={t.work.beforeLabel}
              afterLabel={t.work.afterLabel}
            />
          </section>

          {/* Section 4: Result & Metrics */}
          <section className="my-10">
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">
              <BarChart3 className="size-5" />
              <h2 className="font-display font-extrabold text-2xl text-foreground">
                {t.work.resultHeading}
              </h2>
            </div>

            <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line mb-6 font-normal">
              {study.result}
            </div>

            {/* Impact Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {study.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-[#fef9c3] dark:bg-[#34301d] p-4 text-center shadow-[3px_3px_0px_#0f172a] dark:shadow-[3px_3px_0px_#000]"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-amber-100 font-display">
                    {m.value}
                  </div>
                  <div className="font-mono mt-1 text-[11px] font-bold uppercase text-slate-700 dark:text-amber-200">
                    {m.label}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500 dark:text-amber-300/80">
                    {m.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack Pills */}
          <div className="mt-10 pt-6 border-t-2 border-slate-900 dark:border-slate-700">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {t.work.stackHeading}
            </h3>
            <div className="flex flex-wrap gap-2">
              {study.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border-2 border-slate-900 dark:border-slate-700 bg-secondary px-3 py-1 text-xs font-mono font-bold text-foreground shadow-[1px_1px_0px_#0f172a]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
