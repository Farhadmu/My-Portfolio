import { useState, useEffect } from "react";
import {
  X,
  Download,
  ExternalLink,
  Printer,
  ZoomIn,
  ZoomOut,
  Sparkles,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Trophy,
  Award,
  Layers,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { profile, stats, skillGroups, projects, education, experience } from "@/data/portfolio";
import { sound } from "@/lib/sound";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcademicResultsSpotlight() {
  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-4 sm:p-5 shadow-sm">
      <h3 className="mono text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2 mb-3">
        <Award className="size-4" /> Academic Results &amp; Verified Performance
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background/80 p-3">
          <span className="mono text-[10px] font-bold text-primary uppercase">Undergraduate B.Sc. in CSE</span>
          <h4 className="text-sm font-bold text-foreground mt-0.5">BAIUST (2026 — Present)</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Active computer science curriculum: Data Structures &amp; Algorithms, Object-Oriented Design, and Software Architecture.
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <span className="mono text-[10px] font-bold text-amber-400 uppercase">National Hackathon Distinction</span>
          <h4 className="text-sm font-bold text-foreground mt-0.5">6th Place · SUST CSE Carnival '26</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Advanced through prelims (700+ teams) into the final top 15 and earned 6th place nationwide in competitive software engineering.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/80 p-3">
          <span className="mono text-[10px] font-bold text-cyan-400 uppercase">Higher Secondary Certificate (HSC)</span>
          <h4 className="text-sm font-bold text-foreground mt-0.5">Ispahani Public School and College</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Science Group — strong analytical foundation in Mathematics, Physics, and problem-solving fundamentals.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background/80 p-3">
          <span className="mono text-[10px] font-bold text-emerald-400 uppercase">Secondary School Certificate (SSC)</span>
          <h4 className="text-sm font-bold text-foreground mt-0.5">Comilla Cantonment Boys High School</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Science Group — disciplined academic environment with consistent performance in science and mathematics.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<"formatted" | "pdf">("formatted");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.pop();
    window.print();
  };

  const handleDownload = () => {
    sound.success();
    // Open Farhad's live updated Google Drive resume document for direct viewing & download
    window.open(profile.resume, "_blank");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.click();
          onClose();
        }
      }}
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-secondary/50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/20 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Md. Farhadul Islam — Resume Preview
              </h2>
              <p className="mono text-[10px] text-muted-foreground">
                CSE Undergraduate · Frontend & Full-Stack Developer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center rounded-lg border border-border/70 bg-card/60 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setActiveTab("formatted");
                }}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  activeTab === "formatted"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Interactive View
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  setActiveTab("pdf");
                }}
                className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                  activeTab === "pdf"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PDF View
              </button>
            </div>

            {/* Zoom Controls (Interactive Mode) */}
            {activeTab === "formatted" && (
              <div className="hidden sm:flex items-center gap-1 border-l border-border/60 pl-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setZoom((z) => Math.max(80, z - 10));
                  }}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-4" />
                </button>
                <span className="mono text-[11px] font-semibold text-muted-foreground w-10 text-center">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setZoom((z) => Math.min(130, z + 10));
                  }}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="size-4" />
                </button>
              </div>
            )}

            {/* Download & External Buttons */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.pop()}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/80 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all"
              title="Open Google Drive"
            >
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Print Resume"
            >
              <Printer className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-950/70">
          {activeTab === "pdf" ? (
            <div className="flex flex-col space-y-5 max-w-4xl mx-auto w-full">
              {/* Academic Results & Verified Performance Spotlight */}
              <AcademicResultsSpotlight />

              {/* Updated Live Resume Iframe Embed */}
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-zinc-900 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/40 bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" /> Live Google Drive Resume Preview
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open Full Screen <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
                <iframe
                  src="https://drive.google.com/file/d/1yXszuLE-KaRa-pYCgbIsyGJhnJt7N93s/preview"
                  className="w-full h-[700px] bg-zinc-900"
                  title="Live Updated Resume PDF"
                  allow="autoplay"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  Open in Google Drive
                  <ExternalLink className="size-3" />
                </a>
                <span className="text-muted-foreground text-xs">•</span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-xs font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <Download className="size-3" /> Download Live Updated Resume
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease",
              }}
              className="mx-auto max-w-3xl rounded-xl border border-border/80 bg-card p-6 sm:p-10 shadow-xl space-y-7"
            >
              {/* Header */}
              <div className="border-b border-border/60 pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                      {profile.name}
                    </h1>
                    <p className="mt-1 text-sm sm:text-base font-semibold text-primary">
                      {profile.role} · {profile.subRole}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                      {profile.intro}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground mono">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-primary" /> {profile.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="size-3.5 text-primary" /> {profile.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary" /> {profile.phone}
                    </p>
                  </div>
                </div>

                {/* Quick Metrics Bar */}
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 pt-4 border-t border-border/40">
                  {stats.map((s, idx) => (
                    <div key={`${s.label}-${idx}`} className="rounded-lg bg-secondary/40 p-2 text-center">
                      <p className="text-base font-extrabold text-foreground">{s.value}</p>
                      <p className="mono text-[10px] uppercase text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Academic Standing & Results Spotlight */}
              <AcademicResultsSpotlight />


              {/* Education */}
              <div>
                <h3 className="mono text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2 mb-3">
                  <GraduationCap className="size-4" /> Academic Background
                </h3>
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div
                      key={`${edu.degree}-${idx}`}
                      className="rounded-xl border border-border/50 bg-secondary/20 p-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-foreground">{edu.degree}</h4>
                        <span className="mono text-xs font-semibold text-primary">{edu.period}</span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">
                        {edu.school} · {edu.score}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {edu.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="mono text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2 mb-3">
                  <Layers className="size-4" /> Technical Competencies
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {skillGroups.map((group, gIdx) => (
                    <div
                      key={`${group.category}-${gIdx}`}
                      className="rounded-xl border border-border/50 bg-secondary/20 p-3"
                    >
                      <p className="mono text-[11px] font-bold text-foreground mb-1.5 uppercase">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill, sIdx) => (
                          <span
                            key={`${skill.name}-${sIdx}`}
                            className="rounded-md border border-border/60 bg-background/80 px-2 py-0.5 text-[11px] text-muted-foreground font-medium"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlighted Projects */}
              <div>
                <h3 className="mono text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2 mb-3">
                  <FolderGit2 className="size-4" /> Production & Architectural Projects
                </h3>
                <div className="space-y-3">
                  {projects.slice(0, 4).map((p, pIdx) => (
                    <div
                      key={`${p.title}-${pIdx}`}
                      className="rounded-xl border border-border/50 bg-secondary/20 p-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            {p.tagline}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.live && (
                            <a
                              href={p.live}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline font-semibold"
                            >
                              Live App ↗
                            </a>
                          )}
                          {p.github && (
                            <a
                              href={p.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-muted-foreground hover:text-foreground font-semibold"
                            >
                              GitHub ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.tech.map((t) => (
                          <span
                            key={t}
                            className="mono rounded bg-secondary/80 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Competitive Programming */}
              <div>
                <h3 className="mono text-xs uppercase tracking-wider font-bold text-primary flex items-center gap-2 mb-3">
                  <Trophy className="size-4" /> Honors, Hackathons & Competitive Coding
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs font-bold text-amber-300">
                      6th Position — SUST CSE Carnival '26
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Nationwide competitive programming and software engineering hackathon at Shahjalal University of Science & Technology.
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                    <p className="text-xs font-bold text-primary">
                      Top 300 Selection — Enterprise Java/JS Track
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Rigorous selection program by Programming Hero focusing on clean software development and data structures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
