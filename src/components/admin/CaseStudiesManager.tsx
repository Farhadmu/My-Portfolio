import { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Save,
  ExternalLink,
  Layers,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import {
  getCaseStudies,
  saveCaseStudy,
  type CaseStudy,
  DEFAULT_CASE_STUDIES,
} from "@/lib/supabase";
import { toast } from "sonner";

export function CaseStudiesManager() {
  const [studies, setStudies] = useState<CaseStudy[]>(DEFAULT_CASE_STUDIES);
  const [selectedSlug, setSelectedSlug] = useState<string>("keenkeeper");
  const [form, setForm] = useState<CaseStudy>(DEFAULT_CASE_STUDIES[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCaseStudies().then((res) => {
      setStudies(res);
      if (res.length > 0) {
        setForm(res[0]);
        setSelectedSlug(res[0].slug);
      }
    });
  }, []);

  const handleSelect = (study: CaseStudy) => {
    setSelectedSlug(study.slug);
    setForm(study);
  };

  const handleAddNew = () => {
    const newSlug = `project-${Date.now().toString().slice(-4)}`;
    const newStudy: CaseStudy = {
      slug: newSlug,
      title: "New Case Study Title",
      clientOrContext: "Client / Context",
      role: "Lead Software Engineer",
      timeline: "2 Months",
      overview: "High-level overview of the product...",
      problem: "Key problem statement and bottlenecks...",
      process: "Step-by-step engineering and design decisions...",
      wireframeImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
      beforeImage: "/assets/keenkeeper.png",
      afterImage: "/assets/keenkeeper.png",
      result: "Measurable outcomes and production benchmarks...",
      metrics: [
        { label: "Performance", value: "98/100", detail: "Lighthouse" },
        { label: "Latency", value: "<40ms", detail: "Optimistic" },
      ],
      stack: ["React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://...",
      githubUrl: "https://github.com/...",
    };
    setStudies([newStudy, ...studies]);
    setSelectedSlug(newSlug);
    setForm(newStudy);
    toast.info("Created new case study draft. Fill in details and click Save.");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await saveCaseStudy(form);
      setStudies(updated);
      toast.success(`Case study '${form.title}' saved successfully!`);
    } catch {
      toast.error("Failed to save case study.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">In-Depth Case Study Editor (/work/$slug)</h3>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-mono font-bold">
              {studies.length} Case Studies
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage Problem &rarr; Process &rarr; Before/After Slider &rarr; Measurable Results case studies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            <span>New Case Study</span>
          </button>

          {selectedSlug && (
            <a
              href={`/work/${selectedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
            >
              <ExternalLink className="size-3.5" />
              <span>Preview /work/{selectedSlug}</span>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Column: Case Studies List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            All Case Studies
          </h4>
          <div className="space-y-2">
            {studies.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => handleSelect(item)}
                className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                  selectedSlug === item.slug
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border/60 bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="font-bold text-xs text-foreground truncate">{item.title}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>/work/{item.slug}</span>
                  <span className="font-semibold text-primary">{item.timeline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Case Study Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Core Identity &amp; Overview
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  URL Slug (e.g. keenkeeper)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().trim() })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-mono font-bold text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Context / Client
                </label>
                <input
                  type="text"
                  value={form.clientOrContext}
                  onChange={(e) => setForm({ ...form, clientOrContext: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Full Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Timeline
                </label>
                <input
                  type="text"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Overview / Summary
              </label>
              <textarea
                rows={2}
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Live URL
                </label>
                <input
                  type="text"
                  value={form.liveUrl || ""}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GitHub Repo URL
                </label>
                <input
                  type="text"
                  value={form.githubUrl || ""}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          {/* Section: Problem & Process */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">
              1. The Problem &amp; Friction Points (Markdown Supported)
            </h4>
            <textarea
              rows={4}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />

            <h4 className="text-xs font-bold uppercase tracking-wider text-primary pt-2">
              2. Architectural Process &amp; Technical Decisions (Markdown Supported)
            </h4>
            <textarea
              rows={5}
              value={form.process}
              onChange={(e) => setForm({ ...form, process: e.target.value })}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          {/* Section: Before & After Images */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <ImageIcon className="size-4" /> Before vs After Slider Images
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Wireframe / Blueprint Image URL
                </label>
                <input
                  type="text"
                  value={form.wireframeImage || ""}
                  onChange={(e) => setForm({ ...form, wireframeImage: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Before Image (Initial design)
                </label>
                <input
                  type="text"
                  value={form.beforeImage}
                  onChange={(e) => setForm({ ...form, beforeImage: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  After Image (Production)
                </label>
                <input
                  type="text"
                  value={form.afterImage}
                  onChange={(e) => setForm({ ...form, afterImage: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Result & Metrics */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <BarChart3 className="size-4" /> 3. Measurable Results &amp; Impact
            </h4>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Result Narrative (Markdown Supported)
              </label>
              <textarea
                rows={4}
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Tech Stack (Comma Separated)
              </label>
              <input
                type="text"
                value={form.stack.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                placeholder="React, TypeScript, Tailwind CSS, IndexedDB..."
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{saving ? "Saving Case Study..." : "Save Case Study"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
