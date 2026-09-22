import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  BookOpen,
  FolderGit2,
  Cpu,
  GraduationCap,
  Briefcase,
  Layers,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Eye,
  AlertCircle,
  MessageSquare,
  Mail,
  Send,
  Award,
  Trophy,
  Star,
  Quote,
  CheckCircle2,
  Upload,
  Video,
  X,
  MessageSquareHeart,
  Copy,
  CornerDownRight,
  Camera,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import {
  getBlogs,
  saveBlog,
  deleteBlog,
  getProjects,
  saveProject,
  deleteProject,
  getSkillGroups,
  saveSkillGroups,
  getExperiences,
  saveExperience,
  getEducations,
  saveEducation,
  getAdminPasscode,
  setAdminPasscode,
  getSpotlightSlug,
  setSpotlightSlug,
  getSpotlightConfig,
  saveSpotlightConfig,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getCertificates,
  saveCertificate,
  deleteCertificate,
  resetPortfolioData,
  isSupabaseConfigured,
  getDirectMessages,
  markMessageRead,
  markMessageReplied,
  deleteDirectMessage,
  getGuestbookEntries,
  deleteGuestbookEntry,
  getProfileConfig,
  saveProfileConfig,
  saveProfileConfigAsync,
  resetProfileConfig,
  DEFAULT_PROFILE_CONFIG,
  type UserProfileConfig,
  type GuestbookEntry,
  type BlogPost,
  type DynamicProject,
  type DirectMessage,
  type DynamicTestimonial,
  type DynamicCertificate,
  type CaseStudySpotlightConfig,
} from "@/lib/supabase";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: `Admin CMS — ${profile.name}` }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "blogs" | "profile" | "messages" | "guestbook" | "projects" | "credibility" | "skills" | "experience" | "education" | "settings"
  >("blogs");
  const [unreadCount, setUnreadCount] = useState(0);

  // Check session storage & unread messages
  useEffect(() => {
    if (sessionStorage.getItem("farhad_admin_authed") === "true") {
      setIsAuthenticated(true);
    }

    const checkMessages = () => {
      getDirectMessages().then((msgs) => {
        setUnreadCount(msgs.filter((m) => !m.read).length);
      });
    };
    checkMessages();
    window.addEventListener("portfolio_data_changed", checkMessages);
    return () => window.removeEventListener("portfolio_data_changed", checkMessages);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getAdminPasscode();
    if (passcodeInput.trim() === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("farhad_admin_authed", "true");
      toast.success("Welcome back, Farhad! Admin access granted.");
    } else {
      toast.error("Incorrect passcode. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("farhad_admin_authed");
    toast.info("Logged out of Admin panel.");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl sm:p-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Lock className="size-6" />
          </div>
          <h1 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Admin Access Portal
          </h1>
          <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
            Enter your secret passcode to manage your blogs, projects, and portfolio sections.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Master Passcode
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back to portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6">
        {/* Admin Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <ShieldCheck className="size-3.5" /> Admin Mode
              </span>
              {isSupabaseConfigured ? (
                <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                  ⚡ Supabase Connected
                </span>
              ) : (
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                  📁 Local Persistent Storage
                </span>
              )}
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Content Management System
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Manage your live blog posts and dynamic portfolio sections without touching code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
            >
              <Eye className="size-3.5" /> View Live Blog
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-border/40 pb-2">
          {[
            { id: "blogs", label: "Blogs (Feed)", icon: BookOpen },
            { id: "profile", label: "Profile & Cover (Blog)", icon: Camera },
            {
              id: "messages",
              label: `Messages ${unreadCount > 0 ? `(${unreadCount})` : ""}`,
              icon: MessageSquare,
            },
            { id: "guestbook", label: "Guestbook Wall", icon: MessageSquareHeart },
            { id: "projects", label: "Projects", icon: FolderGit2 },
            { id: "credibility", label: "Credibility & Proof", icon: Award },
            { id: "skills", label: "Skills", icon: Cpu },
            { id: "experience", label: "Experience", icon: Briefcase },
            { id: "education", label: "Education", icon: GraduationCap },
            { id: "settings", label: "Settings & DB", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border/50 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === "blogs" && <BlogsManager />}
        {activeTab === "profile" && <ProfileManager />}
        {activeTab === "messages" && <MessagesManager />}
        {activeTab === "guestbook" && <GuestbookManager />}
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "credibility" && <CredibilityManager />}
        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "education" && <EducationManager />}
        {activeTab === "settings" && <SettingsManager onGoToProfile={() => setActiveTab("profile")} />}
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   1. BLOGS MANAGER (LinkedIn / Facebook Style Composer)
   ========================================================= */
function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Full Stack");
  const [tags, setTags] = useState("React, Next.js, WebDev");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploadName, setImageUploadName] = useState("");
  const [videoUploadName, setVideoUploadName] = useState("");

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image file size exceeds 15MB limit.");
      return;
    }
    setImageUploadName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverImage(event.target.result as string);
        toast.success(`Image "${file.name}" uploaded successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 80 * 1024 * 1024) {
      toast.warning("Video file is >80MB. For large files, YouTube or Vimeo URL is recommended.");
    }
    setVideoUploadName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setVideoUrl(event.target.result as string);
        toast.success(`Video "${file.name}" attached successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadData = () => {
    getBlogs().then(setBlogs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both a title and content for your post.");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await saveBlog({
      id: editingId || undefined,
      title,
      category,
      tags: tagArray,
      excerpt: excerpt.trim() || content.slice(0, 140) + "...",
      content,
      coverImage: coverImage.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      authorName: profile.name,
      authorRole: profile.subRole,
      authorAvatar: profile.photo,
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 180))} min read`,
    });

    toast.success(editingId ? "Blog updated successfully!" : "Post published to Tech Blog! 🎉");
    resetForm();
    loadData();
  };

  const handleEdit = (b: BlogPost) => {
    setEditingId(b.id);
    setTitle(b.title);
    setCategory(b.category);
    setTags(b.tags.join(", "));
    setExcerpt(b.excerpt);
    setContent(b.content);
    setCoverImage(b.coverImage || "");
    setVideoUrl(b.videoUrl || "");
    setIsEditing(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id);
      toast.success("Blog deleted.");
      loadData();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Full Stack");
    setTags("React, Next.js, WebDev");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setVideoUrl("");
    setImageUploadName("");
    setVideoUploadName("");
    setIsEditing(false);
    setPreviewMode(false);
  };

  return (
    <div className="space-y-8">
      {/* LinkedIn / Facebook Style Composer Box */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={profile.photo}
              alt={profile.name}
              className="size-11 rounded-full border border-primary/40 object-cover"
            />
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEditing ? "Edit Article" : "Create a Tech Blog Post"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Publish instantly to your portfolio's public /blog feed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80"
            >
              {previewMode ? "Edit Mode" : "Preview"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {previewMode ? (
          <div className="rounded-xl border border-border/60 bg-secondary/20 p-6">
            <span className="text-xs font-semibold text-primary">{category}</span>
            <h1 className="mt-1 text-2xl font-bold">{title || "Untitled Post"}</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              By {profile.name} • Just now
            </p>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="my-4 h-64 w-full rounded-xl object-cover"
              />
            )}
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {content || "No content written yet."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Post Title
              </label>
              <input
                type="text"
                placeholder="e.g. How I architected role-based auth in Next.js 14"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Performance">Performance</option>
                  <option value="Competitive Programming">Competitive Programming</option>
                  <option value="Career & Thoughts">Career & Thoughts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, TypeScript, Tailwind"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Cover Image: Dual Input (URL or Direct Upload) */}
            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ImageIcon className="size-4 text-primary" /> Cover Image (URL or Direct File Upload)
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage("");
                      setImageUploadName("");
                    }}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <X className="size-3" /> Remove Image
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Paste image URL (https://images.unsplash.com/...)"
                  value={coverImage.startsWith("data:") ? `[Direct File: ${imageUploadName || "Uploaded Image"}]` : coverImage}
                  onChange={(e) => {
                    if (!coverImage.startsWith("data:")) {
                      setCoverImage(e.target.value);
                    }
                  }}
                  className="flex-1 rounded-xl border border-border bg-secondary/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />

                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-all shrink-0">
                  <Upload className="size-3.5" />
                  <span>Upload Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {coverImage && (
                <div className="relative max-w-sm rounded-xl overflow-hidden border border-border/70 shadow-md">
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="h-32 w-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                    Cover Image Ready
                  </div>
                </div>
              )}
            </div>

            {/* Video Breakdown: Dual Input (YouTube/Vimeo URL or Direct Video Upload) */}
            <div className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Video className="size-4 text-rose-400" /> Video Breakdown (URL or Direct Video File)
                </label>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("");
                      setVideoUploadName("");
                    }}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <X className="size-3" /> Remove Video
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  placeholder="Paste YouTube, Vimeo or MP4 URL (https://www.youtube.com/watch?v=...)"
                  value={videoUrl.startsWith("data:") ? `[Direct File: ${videoUploadName || "Uploaded Video"}]` : videoUrl}
                  onChange={(e) => {
                    if (!videoUrl.startsWith("data:")) {
                      setVideoUrl(e.target.value);
                    }
                  }}
                  className="flex-1 rounded-xl border border-border bg-secondary/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />

                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all shrink-0">
                  <Upload className="size-3.5" />
                  <span>Upload Video File</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {videoUrl && (
                <div className="relative max-w-sm rounded-xl overflow-hidden border border-border/70 bg-black/90 p-2 shadow-md">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 pb-1">
                    <span className="flex items-center gap-1">
                      <FileVideo className="size-3 text-rose-400" /> Video Attached
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Ready to publish</span>
                  </div>
                  {videoUrl.startsWith("data:") || videoUrl.endsWith(".mp4") ? (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full max-h-40 rounded-lg bg-black"
                    />
                  ) : (
                    <div className="p-3 text-center text-xs text-muted-foreground bg-secondary/40 rounded-lg">
                      External Video Link: {videoUrl.slice(0, 45)}...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Short Excerpt / Summary
              </label>
              <textarea
                rows={2}
                placeholder="A 1-2 sentence hook for the preview card..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Post Content (Markdown & Code snippets supported)
              </label>
              <textarea
                rows={8}
                placeholder="Write your article here... You can use ### for headers and ```code``` for code blocks."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full font-mono text-sm leading-relaxed rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Discard Changes
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
              >
                <Sparkles className="size-4" />
                {isEditing ? "Update Post" : "Publish Post Now"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Published Blogs Table */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
        <h3 className="text-base font-bold mb-4">Published Articles ({blogs.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="border-b border-border text-foreground">
              <tr>
                <th className="py-2.5 font-semibold">Title</th>
                <th className="py-2.5 font-semibold">Category</th>
                <th className="py-2.5 font-semibold">Date</th>
                <th className="py-2.5 font-semibold">Likes</th>
                <th className="py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-secondary/30">
                  <td className="py-3 font-medium text-foreground max-w-xs truncate">
                    {b.title}
                  </td>
                  <td className="py-3">{b.category}</td>
                  <td className="py-3">
                    {new Date(b.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3">{b.likes || 0}</td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="rounded p-1 text-muted-foreground hover:text-primary"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="rounded p-1 text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MESSAGES MANAGER (Messenger Style Inbox with Email Reply)
   ========================================================= */
function MessagesManager() {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<DirectMessage | null>(null);

  // Email Reply Composer State
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [copiedReply, setCopiedReply] = useState(false);

  const load = () => {
    getDirectMessages().then((data) => {
      setMessages(data);
      if (data.length > 0 && !selectedMsg) {
        initReply(data[0]);
      }
    });
  };

  useEffect(() => {
    load();
  }, []);

  const initReply = (msg: DirectMessage) => {
    setSelectedMsg(msg);
    const subject = `Re: ${msg.topic ? `[${msg.topic}] ` : ""}Inquiry — Md. Farhadul Islam`;
    const defaultBody = `Hi ${msg.name},\n\nThank you for reaching out through my portfolio regarding ${msg.topic || "your inquiry"}!\n\nI have reviewed your message and would love to discuss next steps with you. When would be a convenient time for a quick 15-minute call or Google Meet?\n\nAlternatively, feel free to share any additional specifications, repo links, or requirements here.\n\nLooking forward to collaborating!\n\nBest regards,\nMd. Farhadul Islam\nFull-Stack Software Engineer\nPhone / WhatsApp: +880 1945-321285\nPortfolio: ${profile.siteUrl}`;
    setReplySubject(subject);
    setReplyBody(defaultBody);
  };

  const handleSelect = async (msg: DirectMessage) => {
    initReply(msg);
    if (!msg.read) {
      await markMessageRead(msg.id);
      load();
    }
  };

  const applyTemplate = (templateType: "call" | "contract" | "details") => {
    if (!selectedMsg) return;
    if (templateType === "call") {
      setReplySubject(`Re: Scheduling a Quick Call — ${selectedMsg.name} & Md. Farhadul Islam`);
      setReplyBody(
        `Hi ${selectedMsg.name},\n\nThank you for getting in touch! I'd be glad to discuss your requirements in detail.\n\nWould you be available for a brief 15-to-20 minute Google Meet or phone call sometime this week? Please let me know your preferred timezone and availability.\n\nBest regards,\nMd. Farhadul Islam\n${profile.phone}`
      );
    } else if (templateType === "contract") {
      setReplySubject(`Re: ${selectedMsg.topic || "Contract"} Collaboration — Proposal & Timeline`);
      setReplyBody(
        `Hi ${selectedMsg.name},\n\nThank you for reaching out regarding ${selectedMsg.topic || "your project"}.\n\nI am currently taking on new contract engineering engagements. Based on your brief, I can deliver production-grade architecture, responsive UIs, and robust backends.\n\nCould you share a bit more on your target timeline, tech stack preferences, and scope? Once reviewed, I can provide a comprehensive roadmap.\n\nBest regards,\nMd. Farhadul Islam\n${profile.phone}`
      );
    } else {
      setReplySubject(`Re: Requesting Project Specifications — Md. Farhadul Islam`);
      setReplyBody(
        `Hi ${selectedMsg.name},\n\nThanks for your inquiry! To make sure I give you the most accurate timeline and proposal, could you share:\n1. Key features or wireframes\n2. Desired tech stack\n3. Target launch milestone\n\nI look forward to reviewing these details with you.\n\nBest regards,\nMd. Farhadul Islam`
      );
    }
    toast.success("Reply template loaded!");
  };

  const handleSendViaGmail = async () => {
    if (!selectedMsg) return;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      selectedMsg.email
    )}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
    window.open(gmailUrl, "_blank");
    await markMessageReplied(selectedMsg.id);
    load();
    toast.success("Gmail compose opened & marked as replied! ✨");
  };

  const handleSendViaDefaultApp = async () => {
    if (!selectedMsg) return;
    const mailtoUrl = `mailto:${selectedMsg.email}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;
    window.location.href = mailtoUrl;
    await markMessageReplied(selectedMsg.id);
    load();
    toast.success("Default email client opened & marked as replied!");
  };

  const handleCopyReply = () => {
    if (!selectedMsg) return;
    const textToCopy = `To: ${selectedMsg.email}\nSubject: ${replySubject}\n\n${replyBody}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedReply(true);
      toast.success("Reply draft & recipient copied to clipboard!");
      setTimeout(() => setCopiedReply(false), 2500);
    }
  };

  const handleToggleReplied = async () => {
    if (!selectedMsg) return;
    if (selectedMsg.replied) {
      // unmark replied
      const updated = messages.map((m) =>
        m.id === selectedMsg.id ? { ...m, replied: false } : m
      );
      localStorage.setItem("farhad_portfolio_messages", JSON.stringify(updated));
      setSelectedMsg({ ...selectedMsg, replied: false });
      load();
      toast.info("Marked as pending reply.");
    } else {
      await markMessageReplied(selectedMsg.id);
      setSelectedMsg({ ...selectedMsg, replied: true });
      load();
      toast.success("Marked as replied! ✓");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this message?")) {
      await deleteDirectMessage(id);
      setSelectedMsg(null);
      load();
      toast.success("Message deleted.");
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xl">
      <div className="p-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" /> Visitor Messages &amp; Inquiries
          </h2>
          <p className="text-xs text-muted-foreground">
            Messages sent by visitors directly from your home screen and blog, with 1-click email response.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {messages.length} Total Messages
          </span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {messages.filter((m) => m.replied).length} Replied
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="p-12 text-center">
          <Mail className="mx-auto size-12 text-muted-foreground/40" />
          <h3 className="mt-3 text-sm font-semibold">No messages yet</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            When visitors send a message through your home screen or contact form, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[330px_1fr] min-h-[580px]">
          {/* Messages list (Left side like Messenger) */}
          <div className="border-r border-border/60 divide-y divide-border/40 max-h-[680px] overflow-y-auto bg-card/50">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className={`w-full text-left p-3.5 transition-all flex items-start gap-3 ${
                  selectedMsg?.id === m.id
                    ? "bg-secondary/90 border-l-2 border-primary"
                    : "hover:bg-secondary/40"
                } ${!m.read ? "bg-primary/5" : ""}`}
              >
                <div className="size-9 rounded-full bg-primary/20 text-primary font-bold text-xs grid place-items-center shrink-0 border border-primary/30">
                  {m.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-foreground truncate">{m.name}</span>
                    <div className="flex items-center gap-1.5">
                      {m.replied && (
                        <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1 py-0.2 text-[9px] font-bold text-emerald-400">
                          Replied ✓
                        </span>
                      )}
                      {!m.read && (
                        <span className="size-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  </div>
                  {m.topic && (
                    <span className="mt-0.5 inline-block rounded border border-primary/30 bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                      {m.topic}
                    </span>
                  )}
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{m.message}</p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1 block font-mono">
                    {new Date(m.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Message content & Email Reply Composer (Right side) */}
          <div className="p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[680px]">
            {selectedMsg ? (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">{selectedMsg.name}</h3>
                      {selectedMsg.topic && (
                        <span className="rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-xs font-semibold text-primary">
                          {selectedMsg.topic}
                        </span>
                      )}
                      {selectedMsg.replied ? (
                        <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="size-3" /> Replied
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-400">
                          Awaiting Reply
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={`mailto:${selectedMsg.email}`}
                        className="text-xs text-primary hover:underline font-mono inline-flex items-center gap-1"
                      >
                        <Mail className="size-3.5" /> {selectedMsg.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(selectedMsg.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Received Visitor Message Card */}
                <div>
                  <span className="mono mb-1.5 block text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    Received Message Brief:
                  </span>
                  <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 sm:p-5 text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans shadow-xs">
                    {selectedMsg.message}
                  </div>
                </div>

                {/* Interactive Email Reply Composer */}
                <div className="rounded-2xl border border-primary/30 bg-card p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="grid size-7 place-items-center rounded-lg bg-primary/15 border border-primary/30 text-primary">
                        <CornerDownRight className="size-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Reply via Email to {selectedMsg.name}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          Draft your response and dispatch with 1-click via Gmail Web or your email client.
                        </p>
                      </div>
                    </div>

                    {/* Quick Template Pills */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyTemplate("call")}
                        className="rounded-md border border-border/60 bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        📞 Schedule Call
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate("contract")}
                        className="rounded-md border border-border/60 bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        💼 Discuss Project
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate("details")}
                        className="rounded-md border border-border/60 bg-secondary/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        📋 Request Details
                      </button>
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="mono mb-1 block text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div>
                    <label className="mono mb-1 block text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      Reply Message
                    </label>
                    <textarea
                      rows={7}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-xs leading-relaxed text-foreground outline-none focus:border-primary/60 font-sans"
                    />
                  </div>

                  {/* Dispatch Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Primary Gmail Web 1-Click Button */}
                      <button
                        type="button"
                        onClick={handleSendViaGmail}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-red-700 transition-all hover:scale-[1.02]"
                      >
                        <Send className="size-3.5" />
                        <span>Send with Gmail Web (1-Click)</span>
                        <ExternalLink className="size-3 opacity-75" />
                      </button>

                      {/* Default Mail Client Button */}
                      <button
                        type="button"
                        onClick={handleSendViaDefaultApp}
                        className="inline-flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-3.5 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Mail className="size-3.5" />
                        <span>Default Mail App</span>
                      </button>

                      {/* Copy to Clipboard */}
                      <button
                        type="button"
                        onClick={handleCopyReply}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/60 px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {copiedReply ? (
                          <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleReplied}
                      className={`text-xs font-medium underline underline-offset-4 transition-colors ${
                        selectedMsg.replied
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-emerald-400 hover:text-emerald-300"
                      }`}
                    >
                      {selectedMsg.replied ? "Unmark Replied" : "Mark as Replied"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-muted-foreground text-xs">
                <Mail className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                Select a message on the left to read and send an email reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   GUESTBOOK MANAGER (Community Moderation)
   ========================================================= */
function GuestbookManager() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);

  const load = () => {
    getGuestbookEntries().then(setEntries);
  };

  useEffect(() => {
    load();
    window.addEventListener("portfolio_data_changed", load);
    return () => window.removeEventListener("portfolio_data_changed", load);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guestbook message?")) return;
    const updated = await deleteGuestbookEntry(id);
    setEntries(updated);
    toast.success("Guestbook entry removed.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Visitor & Recruiter Endorsements ({entries.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Review and moderate messages left by visitors, colleagues, and recruiters.
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center text-muted-foreground">
          <MessageSquareHeart className="mx-auto size-8 mb-2 opacity-50" />
          <p className="text-sm">No guestbook entries found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="grid size-8 place-items-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: entry.avatarColor || "#06b6d4" }}
                    >
                      {entry.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{entry.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{entry.role}</p>
                    </div>
                  </div>
                  <span className="mono text-[10px] text-muted-foreground">{entry.createdAt}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{entry.message}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/30 flex justify-end">
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-medium"
                >
                  <Trash2 className="size-3.5" /> Delete Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   2. PROJECTS MANAGER
   ========================================================= */
function ProjectsManager() {
  const [projects, setProjects] = useState<DynamicProject[]>([]);
  const [spotlightSlug, setSpotlightSlugState] = useState<string>(getSpotlightSlug());
  const [isAdding, setIsAdding] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Full Stack");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [challenges, setChallenges] = useState("");
  const [features, setFeatures] = useState("");
  const [tech, setTech] = useState("React, Next.js, Tailwind");
  const [live, setLive] = useState("");
  const [github, setGithub] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const load = () => {
    getProjects().then(setProjects);
    setSpotlightSlugState(getSpotlightSlug());
  };

  useEffect(() => {
    load();
  }, []);

  const handleSetSpotlight = (slug: string) => {
    setSpotlightSlug(slug);
    setSpotlightSlugState(slug);
    toast.success("Home page Case Study Spotlight updated!");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const slug =
      editingSlug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const techArr = tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const featArr = features
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const finalCategory =
      category === "Custom" && customCategory.trim()
        ? customCategory.trim()
        : category;

    await saveProject({
      slug,
      title,
      tagline,
      category: finalCategory,
      description,
      challenges: challenges.trim() || undefined,
      features: featArr.length > 0 ? featArr : undefined,
      image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600",
      tech: techArr,
      stack: techArr,
      live: live || undefined,
      github: github || undefined,
      featured,
    });

    if (featured) {
      handleSetSpotlight(slug);
    }

    toast.success(editingSlug ? "Project updated successfully!" : "Project added successfully!");
    resetForm();
    load();
  };

  const handleEdit = (p: DynamicProject) => {
    setEditingSlug(p.slug);
    setTitle(p.title);
    setTagline(p.tagline || "");
    const stdCats = ["Full Stack", "Frontend", "Backend", "Software"];
    if (stdCats.includes(p.category || "")) {
      setCategory(p.category || "Full Stack");
      setCustomCategory("");
    } else {
      setCategory("Custom");
      setCustomCategory(p.category || "");
    }
    setDescription(p.description);
    setChallenges(p.challenges || "");
    setFeatures(p.features ? p.features.join(", ") : "");
    setTech(p.tech.join(", "));
    setLive(p.live || "");
    setGithub(p.github || "");
    setImage(p.image || "");
    setFeatured(Boolean(p.featured));
    setIsAdding(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Delete this project?")) {
      await deleteProject(slug);
      toast.success("Project removed.");
      load();
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingSlug(null);
    setTitle("");
    setTagline("");
    setCategory("Full Stack");
    setCustomCategory("");
    setDescription("");
    setChallenges("");
    setFeatures("");
    setLive("");
    setGithub("");
    setImage("");
    setFeatured(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Manage Projects ({projects.length})</h2>
          <p className="text-xs text-muted-foreground">
            Add projects, categorize them (Frontend, Backend, Full Stack, etc.), and manage links.
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
        >
          {isAdding ? "Close Form" : <><Plus className="size-4" /> Add Project</>}
        </button>
      </div>

      {/* Featured Case Study Spotlight Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card to-secondary/30 p-4 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Featured Case Study Spotlight</h3>
            <p className="text-xs text-muted-foreground">
              Select which big project appears in the "Production Credibility &amp; Social Proof" section on the home page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium hidden sm:inline">Active Spotlight:</label>
          <select
            value={spotlightSlug}
            onChange={(e) => handleSetSpotlight(e.target.value)}
            className="rounded-xl border border-primary/40 bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          >
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                ⭐ {p.title} ({p.category || "Full Stack"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <h3 className="font-bold text-sm">
              {editingSlug ? `Edit Project: ${title}` : "Add New Project"}
            </h3>
            {editingSlug && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-semibold">
                Editing Mode
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Project Title (e.g. ArtHub)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tagline (e.g. Online Art Marketplace)"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Software">Software / Core CS</option>
                <option value="Custom">+ Custom Project Type...</option>
              </select>
            </div>
          </div>

          {category === "Custom" && (
            <div>
              <label className="block text-xs font-medium text-primary mb-1">
                Enter Custom Project Category Name:
              </label>
              <input
                type="text"
                placeholder="e.g. AI Systems, Mobile App, DevOps"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                className="w-full rounded-xl border border-primary/50 bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <textarea
            rows={2}
            placeholder="Detailed description of what you built and problems solved..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                The Core Problem (for Case Study spotlight)
              </label>
              <textarea
                rows={2}
                placeholder="What challenge did this project solve?"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Key Deliverables / Results (comma separated)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. 99.9% Uptime, Sub-100ms Latency, Full CRUD"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Tech Stack (comma separated)"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
            <input
              type="url"
              placeholder="Live URL"
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
            <input
              type="url"
              placeholder="GitHub Repo URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="url"
              placeholder="Screenshot / Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-4 rounded"
              />
              Featured Project
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              {editingSlug ? "Update Project" : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="rounded-2xl border border-border/60 bg-card p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">{p.title}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground font-medium">
                    {p.category || "Full Stack"}
                  </span>
                  {p.featured && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      ★
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.tech.slice(0, 3).map((t) => (
                  <span key={t} className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
              <div className="flex items-center gap-2 text-xs">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Live ↗
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:underline">
                    Code ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleSetSpotlight(p.slug)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                    p.slug === spotlightSlug
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                  title="Set this project as the big Case Study on the home page"
                >
                  {p.slug === spotlightSlug ? "⭐ Active Case Study" : "Set Case Study"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Edit project"
                >
                  <Edit className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.slug)}
                  className="text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   2.5. CREDIBILITY & SOCIAL PROOF MANAGER
   ========================================================= */
function CredibilityManager() {
  const [activeSubTab, setActiveSubTab] = useState<"case-study" | "testimonials" | "certificates">("case-study");
  const [projects, setProjects] = useState<DynamicProject[]>([]);
  const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>([]);
  const [certificates, setCertificates] = useState<DynamicCertificate[]>([]);

  // Case study state
  const [spotlightConfig, setSpotlightConfigState] = useState<CaseStudySpotlightConfig>(getSpotlightConfig());
  const [spotlightSlug, setSpotlightSlugLocal] = useState<string>(getSpotlightSlug());
  const [csTitle, setCsTitle] = useState("");
  const [csTagline, setCsTagline] = useState("");
  const [csCategory, setCsCategory] = useState("Full Stack Architecture");
  const [csProblem, setCsProblem] = useState("");
  const [csApproach, setCsApproach] = useState("");
  const [csDeliverables, setCsDeliverables] = useState("");
  const [csStack, setCsStack] = useState("");
  const [csImage, setCsImage] = useState("");
  const [csLive, setCsLive] = useState("");

  // Testimonial form state
  const [isEditingTesti, setIsEditingTesti] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState<string | null>(null);
  const [testiName, setTestiName] = useState("");
  const [testiRole, setTestiRole] = useState("");
  const [testiQuote, setTestiQuote] = useState("");
  const [testiRating, setTestiRating] = useState(5);

  // Certificate form state
  const [isEditingCert, setIsEditingCert] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certIcon, setCertIcon] = useState("award");

  const loadAll = () => {
    getProjects().then(setProjects);
    getTestimonials().then(setTestimonials);
    getCertificates().then(setCertificates);
    const cfg = getSpotlightConfig();
    setSpotlightConfigState(cfg);
    setSpotlightSlugLocal(cfg.slug || "fixitnow");
    setCsTitle(cfg.title || "");
    setCsTagline(cfg.tagline || "");
    setCsCategory(cfg.category || "Full Stack Architecture");
    setCsProblem(cfg.problem || "");
    setCsApproach(cfg.approach || "");
    setCsDeliverables((cfg.deliverables || []).join("\n"));
    setCsStack((cfg.stack || []).join(", "));
    setCsImage(cfg.image || "");
    setCsLive(cfg.live || "");
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Sync fields when selected project changes
  const handleSelectProject = (slug: string) => {
    setSpotlightSlugLocal(slug);
    const p = projects.find((proj) => proj.slug === slug);
    if (p) {
      setCsTitle(p.title);
      setCsTagline(p.tagline);
      setCsCategory(p.category || "Full Stack Architecture");
      setCsProblem(p.challenges || p.description || "");
      setCsApproach(p.description || "");
      setCsDeliverables((p.features || []).join("\n"));
      setCsStack((p.stack || p.tech || []).join(", "));
      setCsImage(p.image || "");
      setCsLive(p.live || "");
      toast.info(`Populated fields from "${p.title}". Review and save.`);
    }
  };

  const handleSaveCaseStudy = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverablesList = csDeliverables
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);
    const stackList = csStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedConfig: CaseStudySpotlightConfig = {
      slug: spotlightSlug,
      title: csTitle.trim(),
      tagline: csTagline.trim(),
      category: csCategory.trim(),
      problem: csProblem.trim(),
      approach: csApproach.trim(),
      deliverables: deliverablesList,
      stack: stackList,
      image: csImage.trim(),
      live: csLive.trim(),
    };

    saveSpotlightConfig(updatedConfig);
    setSpotlightSlug(spotlightSlug);
    setSpotlightConfigState(updatedConfig);
    toast.success("Case Study Spotlight updated successfully on Home Page!");
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiName.trim() || !testiQuote.trim()) {
      toast.error("Please provide both Name and Quote.");
      return;
    }

    const item: DynamicTestimonial = {
      id: editingTestiId || `testi-${Date.now()}`,
      name: testiName.trim(),
      role: testiRole.trim() || "Peer Review",
      quote: testiQuote.trim(),
      rating: testiRating,
    };

    const updated = await saveTestimonial(item);
    setTestimonials(updated);
    toast.success(editingTestiId ? "Recommendation updated!" : "Recommendation added!");
    handleResetTestiForm();
  };

  const handleEditTesti = (t: DynamicTestimonial) => {
    setEditingTestiId(t.id || null);
    setTestiName(t.name);
    setTestiRole(t.role);
    setTestiQuote(t.quote);
    setTestiRating(t.rating || 5);
    setIsEditingTesti(true);
  };

  const handleDeleteTesti = async (id: string) => {
    if (confirm("Delete this recommendation?")) {
      const updated = await deleteTestimonial(id);
      setTestimonials(updated);
      toast.success("Recommendation deleted.");
    }
  };

  const handleResetTestiForm = () => {
    setIsEditingTesti(false);
    setEditingTestiId(null);
    setTestiName("");
    setTestiRole("");
    setTestiQuote("");
    setTestiRating(5);
  };

  // Certificate Handlers
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) {
      toast.error("Please provide Title and Issuer.");
      return;
    }

    const item: DynamicCertificate = {
      id: editingCertId || `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate.trim() || "2026",
      icon: certIcon,
    };

    const updated = await saveCertificate(item);
    setCertificates(updated);
    toast.success(editingCertId ? "Certificate updated!" : "Certificate added!");
    handleResetCertForm();
  };

  const handleEditCert = (c: DynamicCertificate) => {
    setEditingCertId(c.id || null);
    setCertTitle(c.title);
    setCertIssuer(c.issuer);
    setCertDate(c.date);
    setCertIcon(c.icon || "award");
    setIsEditingCert(true);
  };

  const handleDeleteCert = async (id: string) => {
    if (confirm("Delete this certification / award?")) {
      const updated = await deleteCertificate(id);
      setCertificates(updated);
      toast.success("Certificate deleted.");
    }
  };

  const handleResetCertForm = () => {
    setIsEditingCert(false);
    setEditingCertId(null);
    setCertTitle("");
    setCertIssuer("");
    setCertDate("");
    setCertIcon("award");
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="size-5 text-primary" /> Production Credibility & Social Proof Manager
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full dynamic control over your big Case Study Spotlight, Testimonials, and Verified Honors.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto bg-secondary/40 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => setActiveSubTab("case-study")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "case-study"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🎯 Case Study Spotlight
          </button>
          <button
            onClick={() => setActiveSubTab("testimonials")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "testimonials"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💬 Recommendations ({testimonials.length})
          </button>
          <button
            onClick={() => setActiveSubTab("certificates")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "certificates"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🏆 Certifications ({certificates.length})
          </button>
        </div>
      </div>

      {/* =========================================================
          SUB-TAB 1: CASE STUDY SPOTLIGHT
          ========================================================= */}
      {activeSubTab === "case-study" && (
        <form onSubmit={handleSaveCaseStudy} className="space-y-6 rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Featured Architectural Case Study
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Feature any project as the headline case study, or customize its narrative directly below.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Load from Project:
              </label>
              <select
                value={spotlightSlug}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="rounded-xl border border-primary/40 bg-secondary/80 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({p.category || "Project"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Case Study Project Title *
              </label>
              <input
                type="text"
                value={csTitle}
                onChange={(e) => setCsTitle(e.target.value)}
                placeholder="e.g. FixItNow"
                required
                className="w-full rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={csTagline}
                onChange={(e) => setCsTagline(e.target.value)}
                placeholder="e.g. Home Service Marketplace"
                className="w-full rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Category Badge
              </label>
              <input
                type="text"
                value={csCategory}
                onChange={(e) => setCsCategory(e.target.value)}
                placeholder="e.g. Full Stack Architecture"
                className="w-full rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                The Core Problem & Technical Challenge *
              </label>
              <textarea
                rows={4}
                value={csProblem}
                onChange={(e) => setCsProblem(e.target.value)}
                placeholder="Describe the main architectural challenge, concurrency hurdles, or session auth problem..."
                required
                className="w-full rounded-xl border border-border bg-secondary/50 p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                Architectural Approach & Solution *
              </label>
              <textarea
                rows={4}
                value={csApproach}
                onChange={(e) => setCsApproach(e.target.value)}
                placeholder="Describe the system design, tech stack synergy, database choice, or Edge middleware..."
                required
                className="w-full rounded-xl border border-border bg-secondary/50 p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
              Measurable Impact & Deliverables (One per line)
            </label>
            <textarea
              rows={3}
              value={csDeliverables}
              onChange={(e) => setCsDeliverables(e.target.value)}
              placeholder="Role-based dashboards — dedicated Customer, Technician and Admin flows&#10;Booking flow — service + date/time + address with status stepper&#10;Stripe Checkout payments — full redirect flow with success/cancel pages"
              className="w-full rounded-xl border border-border bg-secondary/50 p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Tech Stack Tags (comma-separated)
              </label>
              <input
                type="text"
                value={csStack}
                onChange={(e) => setCsStack(e.target.value)}
                placeholder="Next.js 14, TypeScript, Tailwind CSS, Stripe Checkout"
                className="w-full rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Cover Image (URL or Upload)
                </label>
                {csImage && (
                  <button
                    type="button"
                    onClick={() => setCsImage("")}
                    className="text-[10px] text-rose-400 hover:underline flex items-center gap-0.5"
                  >
                    <X className="size-2.5" /> Clear
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={csImage.startsWith("data:") ? "[Uploaded Image File]" : csImage}
                  onChange={(e) => {
                    if (!csImage.startsWith("data:")) {
                      setCsImage(e.target.value);
                    }
                  }}
                  placeholder="https://... or upload"
                  className="flex-1 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-2.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 shrink-0">
                  <Upload className="size-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = (ev) => {
                        if (ev.target?.result) {
                          setCsImage(ev.target.result as string);
                          toast.success("Case study image loaded!");
                        }
                      };
                      r.readAsDataURL(f);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Live Production URL
              </label>
              <input
                type="url"
                value={csLive}
                onChange={(e) => setCsLive(e.target.value)}
                placeholder="https://fixitnow.vercel.app"
                className="w-full rounded-xl border border-border bg-secondary/50 px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
            >
              <Save className="size-4" /> Save Case Study Spotlight
            </button>
          </div>
        </form>
      )}

      {/* =========================================================
          SUB-TAB 2: RECOMMENDATIONS & FEEDBACK (TESTIMONIALS)
          ========================================================= */}
      {activeSubTab === "testimonials" && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Quote className="size-4 text-primary" /> Verified Recommendations & Team Feedback
            </h3>
            {!isEditingTesti && (
              <button
                onClick={() => {
                  handleResetTestiForm();
                  setIsEditingTesti(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Plus className="size-3.5" /> Add Recommendation
              </button>
            )}
          </div>

          {/* Form */}
          {isEditingTesti && (
            <form onSubmit={handleSaveTestimonial} className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4 animate-in fade-in">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider">
                {editingTestiId ? "Edit Recommendation" : "New Recommendation"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Name / Team *
                  </label>
                  <input
                    type="text"
                    value={testiName}
                    onChange={(e) => setTestiName(e.target.value)}
                    placeholder="e.g. Team Zero_Bug_zone or John Doe"
                    required
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Role / Context
                  </label>
                  <input
                    type="text"
                    value={testiRole}
                    onChange={(e) => setTestiRole(e.target.value)}
                    placeholder="e.g. SUST CSE Carnival 2026 or Mentor Feedback"
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={testiRating}
                    onChange={(e) => setTestiRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Recommendation Quote / Endorsement *
                </label>
                <textarea
                  rows={3}
                  value={testiQuote}
                  onChange={(e) => setTestiQuote(e.target.value)}
                  placeholder="What did they say about your work ethic, architectural skill, or deliverables?"
                  required
                  className="w-full rounded-xl border border-border bg-secondary/60 p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetTestiForm}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="size-3.5" /> Save Recommendation
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id || t.name} className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="size-3 fill-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditTesti(t)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        title="Edit recommendation"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTesti(t.id || t.name)}
                        className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                        title="Delete recommendation"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-4 border-t border-border/40 pt-3 flex items-center gap-2.5">
                  <div className="size-7 rounded-full bg-primary/10 text-primary font-bold text-xs grid place-items-center border border-primary/20">
                    {t.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: CERTIFICATIONS & HONORS
          ========================================================= */}
      {activeSubTab === "certificates" && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Trophy className="size-4 text-amber-400" /> Verified Certifications & Honors
            </h3>
            {!isEditingCert && (
              <button
                onClick={() => {
                  handleResetCertForm();
                  setIsEditingCert(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm"
              >
                <Plus className="size-3.5" /> Add Certificate
              </button>
            )}
          </div>

          {/* Form */}
          {isEditingCert && (
            <form onSubmit={handleSaveCertificate} className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-4 animate-in fade-in">
              <h4 className="font-semibold text-xs text-primary uppercase tracking-wider">
                {editingCertId ? "Edit Certificate / Award" : "New Certificate / Award"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Certificate / Award Title *
                  </label>
                  <input
                    type="text"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    placeholder="e.g. AI-Complete Web Development — Level 1"
                    required
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Issuer / Program *
                  </label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. Programming Hero, Batch 13"
                    required
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    placeholder="e.g. 2026 or 2025"
                    className="w-full rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Icon Category
                </label>
                <select
                  value={certIcon}
                  onChange={(e) => setCertIcon(e.target.value)}
                  className="rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="award">🏅 Award / Completion Badge</option>
                  <option value="trophy">🏆 Competition Trophy / Hackathon</option>
                  <option value="badge">🛡️ Verified Certification</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetCertForm}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="size-3.5" /> Save Certificate
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((c) => (
              <div key={c.id || c.title} className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary border border-border">
                    {c.icon === "trophy" ? <Trophy className="size-5 text-amber-400" /> : <Award className="size-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-foreground truncate">
                      {c.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {c.issuer} · <span className="text-primary font-semibold">{c.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    onClick={() => handleEditCert(c)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                    title="Edit certificate"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCert(c.id || c.title)}
                    className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                    title="Delete certificate"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   3. SKILLS MANAGER
   ========================================================= */
function SkillsManager() {
  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillValue, setNewSkillValue] = useState(80);
  const [selectedCategory, setSelectedCategory] = useState("");

  const load = () => {
    getSkillGroups().then((groups) => {
      setSkillGroups(groups);
      if (groups.length > 0) setSelectedCategory(groups[0].category);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const updated = skillGroups.map((grp) => {
      if (grp.category === selectedCategory) {
        return {
          ...grp,
          skills: [
            ...grp.skills,
            {
              name: newSkillName.trim(),
              level: newSkillValue >= 80 ? "Advanced" : newSkillValue >= 60 ? "Intermediate" : "Learning",
              value: Number(newSkillValue),
              note: "Added via Admin CMS",
              logo: newSkillName.toLowerCase().replace(/[^a-z]/g, ""),
            },
          ],
        };
      }
      return grp;
    });

    await saveSkillGroups(updated);
    setSkillGroups(updated);
    setNewSkillName("");
    toast.success(`Added ${newSkillName} to ${selectedCategory}`);
  };

  const handleDeleteSkill = async (catName: string, skillName: string) => {
    const updated = skillGroups.map((grp) => {
      if (grp.category === catName) {
        return {
          ...grp,
          skills: grp.skills.filter((s: any) => s.name !== skillName),
        };
      }
      return grp;
    });

    await saveSkillGroups(updated);
    setSkillGroups(updated);
    toast.success(`Removed ${skillName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Skills Inventory</h2>
          <p className="text-xs text-muted-foreground">
            Manage your proficiencies across languages, frameworks, databases and tools.
          </p>
        </div>
      </div>

      {/* Add Skill Form */}
      <form
        onSubmit={handleAddSkill}
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/80 bg-card p-4"
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
        >
          {skillGroups.map((g) => (
            <option key={g.category} value={g.category}>
              {g.category}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Skill Name (e.g. Rust, GraphQL)"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          required
          className="flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
        />

        <div className="flex items-center gap-2 text-xs">
          <span>Proficiency: {newSkillValue}%</span>
          <input
            type="range"
            min={20}
            max={100}
            value={newSkillValue}
            onChange={(e) => setNewSkillValue(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Add Skill
        </button>
      </form>

      {/* Skills Categories Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((grp) => (
          <div key={grp.category} className="rounded-2xl border border-border/60 bg-card p-4">
            <h3 className="font-bold text-sm text-foreground mb-3 flex items-center justify-between">
              <span>{grp.category}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {grp.skills.length} skills
              </span>
            </h3>

            <div className="space-y-2">
              {grp.skills.map((s: any) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-1.5 text-xs"
                >
                  <div>
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      ({s.level} · {s.value}%)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(grp.category, s.name)}
                    className="text-muted-foreground hover:text-rose-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   4. EXPERIENCE MANAGER
   ========================================================= */
function ExperienceManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [period, setPeriod] = useState("");
  const [status, setStatus] = useState<"active" | "completed">("completed");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("Hackathon, Team Project");
  const [body, setBody] = useState("");
  const [highlight, setHighlight] = useState("");
  const [extra, setExtra] = useState("");
  const [live, setLive] = useState("");
  const [github, setGithub] = useState("");

  const load = () => {
    getExperiences().then(setExperiences);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !org) return;

    const tagArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem = {
      title,
      org,
      period,
      status,
      image: image.trim() || undefined,
      tags: tagArr,
      body,
      highlight: highlight.trim() || undefined,
      extra: extra.trim() || undefined,
      live: live.trim() || undefined,
      github: github.trim() || undefined,
    };

    let updated: any[];
    if (editingIndex !== null) {
      updated = experiences.map((exp, idx) => (idx === editingIndex ? newItem : exp));
      toast.success("Experience updated!");
    } else {
      updated = [newItem, ...experiences];
      toast.success("Experience added!");
    }

    await saveExperience(updated);
    setExperiences(updated);
    resetForm();
  };

  const handleEdit = (exp: any, idx: number) => {
    setEditingIndex(idx);
    setTitle(exp.title || "");
    setOrg(exp.org || "");
    setPeriod(exp.period || "");
    setStatus(exp.status || "completed");
    setImage(exp.image || "");
    setTags(Array.isArray(exp.tags) ? exp.tags.join(", ") : "");
    setBody(exp.body || "");
    setHighlight(exp.highlight || "");
    setExtra(exp.extra || "");
    setLive(exp.live || "");
    setGithub(exp.github || "");
    setIsAdding(true);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleDelete = async (idx: number) => {
    if (confirm("Delete this experience entry?")) {
      const updated = experiences.filter((_, i) => i !== idx);
      await saveExperience(updated);
      setExperiences(updated);
      toast.success("Experience removed.");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setTitle("");
    setOrg("");
    setPeriod("");
    setStatus("completed");
    setImage("");
    setTags("Hackathon, Team Project");
    setBody("");
    setHighlight("");
    setExtra("");
    setLive("");
    setGithub("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Hackathons & Experience ({experiences.length})</h2>
          <p className="text-xs text-muted-foreground">
            Manage your competitive achievements, hackathons, and internship milestones.
          </p>
        </div>
        <button
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isAdding ? "Close Form" : <><Plus className="size-4 inline mr-1" /> Add Experience</>}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <h3 className="font-bold text-sm">
              {editingIndex !== null ? `Edit: ${title}` : "Add Experience / Hackathon"}
            </h3>
            {editingIndex !== null && (
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-semibold">
                Editing Item
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Title (e.g. SUST CSE Carnival 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Organization (e.g. Team Zero_Bug_zone · bKash)"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Period (e.g. Jul 11–12, 2026)"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="completed">Completed (✓)</option>
              <option value="active">Active (●)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. Hackathon, 24-Hour Onsite)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="url"
              placeholder="Image / Banner URL (Optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Key Highlight (e.g. 6th place out of 700+ teams — prelims → top 50 → final 15)"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />

          <textarea
            rows={2}
            placeholder="Main story / summary of achievements and challenges..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />

          <textarea
            rows={2}
            placeholder="Extra details: what product did you build, stack, metrics..."
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              placeholder="Live Demo Project Link (Optional)"
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="url"
              placeholder="GitHub Repository URL (Optional)"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              {editingIndex !== null ? "Update Experience" : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/60 bg-card p-4 flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-foreground">{exp.title}</h4>
                <span className="rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                  {exp.status === "active" ? "● Active" : "✓ Completed"}
                </span>
              </div>
              <p className="text-xs text-primary font-medium">{exp.org} • {exp.period}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.body}</p>
              {exp.highlight && (
                <div className="mt-1 text-xs font-medium text-amber-400">
                  ★ {exp.highlight}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(exp, idx)}
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                title="Edit entry"
              >
                <Edit className="size-4" />
              </button>
              <button
                onClick={() => handleDelete(idx)}
                className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                title="Delete entry"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   5. EDUCATION MANAGER
   ========================================================= */
function EducationManager() {
  const [education, setEducation] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [org, setOrg] = useState("");
  const [body, setBody] = useState("");

  const load = () => {
    getEducations().then(setEducation);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !org) return;

    const newItem = {
      year,
      title,
      org,
      body,
      tags: ["Education"],
      status: "active" as const,
      kind: "Academic" as const,
    };

    const updated = [newItem, ...education];
    await saveEducation(updated);
    setEducation(updated);
    setIsAdding(false);
    setTitle("");
    setOrg("");
    setYear("");
    setBody("");
    toast.success("Education item added!");
  };

  const handleDelete = async (idx: number) => {
    if (confirm("Delete this education entry?")) {
      const updated = education.filter((_, i) => i !== idx);
      await saveEducation(updated);
      setEducation(updated);
      toast.success("Education removed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Education & Training</h2>
          <p className="text-xs text-muted-foreground">
            Manage academic degrees, certifications, and bootcamp milestones.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4 inline mr-1" /> Add Degree / Course
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-border/80 bg-card p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Year (e.g. 2026 — Present)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
            <input
              type="text"
              placeholder="Degree / Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
            <input
              type="text"
              placeholder="Institution (e.g. BAIUST)"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              required
              className="rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Focus areas, coursework, or special accomplishments..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {education.map((edu, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/60 bg-card p-4 flex items-start justify-between gap-4"
          >
            <div>
              <span className="text-xs font-mono text-primary">{edu.year}</span>
              <h4 className="font-bold text-sm text-foreground mt-0.5">{edu.title}</h4>
              <p className="text-xs text-muted-foreground">{edu.org}</p>
              <p className="text-xs text-muted-foreground mt-1">{edu.body}</p>
            </div>
            <button
              onClick={() => handleDelete(idx)}
              className="text-muted-foreground hover:text-rose-500"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   6. PROFILE & BLOG COVER MANAGER
   ========================================================= */
const COVER_PRESETS = [
  {
    name: "VS Code & Dark Syntax",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
    desc: "Clean Next.js / TypeScript code editor",
  },
  {
    name: "Dual Monitor SWE Setup",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1920&auto=format&fit=crop",
    desc: "Modern engineer workstation & code display",
  },
  {
    name: "Cyber Matrix & Deep Violet",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
    desc: "Vibrant violet & cyan cyber mesh",
  },
  {
    name: "Quantum Circuit & Neon Glow",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1920&auto=format&fit=crop",
    desc: "Glowing hardware traces & architecture",
  },
  {
    name: "Terminal & Shell CLI",
    url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1920&auto=format&fit=crop",
    desc: "Dark developer command-line interface",
  },
  {
    name: "Cloud Server Infrastructure",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1920&auto=format&fit=crop",
    desc: "High-density cloud server racks & datacenter",
  },
  {
    name: "Silicone Chip & Architecture",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop",
    desc: "Integrated circuit architecture & die",
  },
  {
    name: "Minimalist SWE Workstation",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop",
    desc: "Sleek retro-futuristic dark work desk",
  },
  {
    name: "Full-Stack Code Lines",
    url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop",
    desc: "Highlighted source code architecture",
  },
  {
    name: "Cyber Systems Data Grid",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop",
    desc: "Futuristic digital grid & telemetry",
  },
];

// Client-side image resizer/compressor to safely store in localStorage without exceeding quotas
function compressImage(file: File, maxWidth: number, maxHeight: number, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function ProfileManager() {
  const [profileConfig, setConfig] = useState(getProfileConfig);
  const [avatar, setAvatar] = useState(() => getProfileConfig().avatar || profile.photo);
  const [coverImage, setCoverImage] = useState(() => getProfileConfig().coverImage);
  const [name, setName] = useState(() => getProfileConfig().name || profile.name);
  const [subRole, setSubRole] = useState(() => getProfileConfig().subRole || "");
  const [bio, setBio] = useState(() => getProfileConfig().bio || "");
  const [educationTag, setEducationTag] = useState(() => getProfileConfig().educationTag || "");
  const [architectureTag, setArchitectureTag] = useState(() => getProfileConfig().architectureTag || "");
  const [activeTag, setActiveTag] = useState(() => getProfileConfig().activeTag || "");
  const [avatarUploadName, setAvatarUploadName] = useState("");
  const [coverUploadName, setCoverUploadName] = useState("");
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if another tab or component updates profile config, and sync on mount
  useEffect(() => {
    const sync = () => {
      const fresh = getProfileConfig();
      setConfig(fresh);
      setAvatar(fresh.avatar || profile.photo);
      setCoverImage(fresh.coverImage);
      setName(fresh.name || profile.name);
      setSubRole(fresh.subRole || "");
      setBio(fresh.bio || "");
      setEducationTag(fresh.educationTag || "");
      setArchitectureTag(fresh.architectureTag || "");
      setActiveTag(fresh.activeTag || "");
    };
    sync();
    window.addEventListener("portfolio_data_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("portfolio_data_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingImg(true);
    try {
      setAvatarUploadName(file.name);
      // Automatically compress avatar to 400x400 JPEG (~30KB)
      const compressed = await compressImage(file, 400, 400, 0.88);
      setAvatar(compressed);
      toast.success(`Photo "${file.name}" optimized & loaded as avatar!`);
    } catch {
      toast.error("Failed to process photo.");
    } finally {
      setIsProcessingImg(false);
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingImg(true);
    try {
      setCoverUploadName(file.name);
      // Automatically compress cover banner to 1440x700 JPEG (~85KB)
      const compressed = await compressImage(file, 1440, 700, 0.84);
      setCoverImage(compressed);
      toast.success(`Cover banner "${file.name}" optimized & loaded!`);
    } catch {
      toast.error("Failed to process cover banner.");
    } finally {
      setIsProcessingImg(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveProfileConfigAsync({
        avatar,
        coverImage,
        name,
        subRole,
        bio,
        educationTag,
        architectureTag,
        activeTag,
      });
      setConfig(saved);
      setAvatar(saved.avatar);
      setCoverImage(saved.coverImage);
      setName(saved.name);
      setSubRole(saved.subRole);
      setBio(saved.bio);
      setEducationTag(saved.educationTag);
      setArchitectureTag(saved.architectureTag);
      setActiveTag(saved.activeTag);
      toast.success("Profile & Cover settings saved successfully! All pages & Navbar are updated.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save: " + (err?.message || "Storage error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset profile branding and cover banner back to original defaults?")) {
      const def = resetProfileConfig();
      setConfig(def);
      setAvatar(def.avatar);
      setCoverImage(def.coverImage);
      setName(def.name);
      setSubRole(def.subRole);
      setBio(def.bio);
      setEducationTag(def.educationTag);
      setArchitectureTag(def.architectureTag);
      setActiveTag(def.activeTag);
      setAvatarUploadName("");
      setCoverUploadName("");
      toast.info("Reset to default profile branding.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
            <Camera className="size-6 text-primary" /> Profile &amp; Blog Cover Customizer
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Change your profile photo, upload or choose high-tech cover banners for your blog header, and customize your author bio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 shadow-xs"
          >
            <Eye className="size-3.5" /> View Live Blog ↗
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isProcessingImg}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? <RefreshCw className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW BANNER CARD */}
      <div className="rounded-3xl border border-border/80 bg-card/60 p-5 backdrop-blur-md shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="mono text-xs font-semibold text-primary flex items-center gap-1.5">
            <Sparkles className="size-3.5" /> Live Preview of Blog Author Banner
          </span>
          <span className="text-[11px] text-muted-foreground">Updates in real-time as you edit below</span>
        </div>

        {/* Scaled Preview Box */}
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg">
          <div className="relative h-36 sm:h-48 w-full overflow-hidden">
            <img
              src={coverImage || DEFAULT_PROFILE_CONFIG.coverImage}
              alt="Cover preview"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-black/40" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:18px_18px] opacity-70" />
            <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] mono text-white/90 backdrop-blur-md">
              <Sparkles className="size-3 text-cyan-400" />
              <span>Engineering Publication</span>
            </div>
          </div>

          <div className="px-5 pb-5 pt-0">
            <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-3">
              <div className="relative">
                <img
                  src={avatar || profile.photo}
                  alt={name}
                  className="size-20 sm:size-24 rounded-2xl border-4 border-card object-cover shadow-2xl ring-2 ring-primary/40"
                />
                <span className="absolute bottom-1 right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-card ring-2 ring-emerald-400/50" />
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  Message Farhad
                </span>
                <span className="rounded-xl border border-border bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground">
                  Connect on LinkedIn ↗
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">{name || profile.name}</h3>
                <CheckCircle2 className="size-4 text-primary" />
              </div>
              <p className="text-xs text-foreground/90 font-medium mt-0.5">{subRole}</p>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-2xl line-clamp-2">{bio}</p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="mono rounded-md border border-border/80 bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-foreground/90">
                  {educationTag}
                </span>
                <span className="mono rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {architectureTag}
                </span>
                <span className="mono rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  {activeTag}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. COVER BANNER CONTROLS */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" /> Blog &amp; Profile Cover Banner
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload a custom banner image from your device or choose from curated engineering presets.
              </p>
            </div>
            {coverImage !== DEFAULT_PROFILE_CONFIG.coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage(DEFAULT_PROFILE_CONFIG.coverImage)}
                className="text-xs text-primary hover:underline"
              >
                Reset to Default Cover
              </button>
            )}
          </div>

          {/* Upload file + URL input */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* File Upload Box */}
            <div className="rounded-xl border border-dashed border-border/80 bg-secondary/30 p-4 text-center hover:border-primary/50 transition-colors">
              <Upload className="mx-auto size-6 text-muted-foreground mb-2" />
              <label className="cursor-pointer text-xs font-semibold text-primary hover:underline">
                Upload Cover from Computer
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-muted-foreground mt-1">
                {coverUploadName ? `Selected: ${coverUploadName}` : "Supports PNG, JPG, WEBP (Max 15MB)"}
              </p>
            </div>

            {/* Direct Image URL */}
            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="text-xs font-medium text-foreground">Or Direct Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <span className="text-[10px] text-muted-foreground">You can paste any web image URL here</span>
            </div>
          </div>

          {/* Curated Presets */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">
              1-Click Engineering Cover Presets:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {COVER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setCoverImage(preset.url);
                    toast.success(`Applied preset: ${preset.name}`);
                  }}
                  className={`group relative overflow-hidden rounded-xl border p-1 text-left transition-all ${
                    coverImage === preset.url
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60 hover:border-primary/50"
                  }`}
                >
                  <div className="relative h-16 w-full overflow-hidden rounded-lg">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {coverImage === preset.url && (
                      <span className="absolute top-1 right-1 flex items-center gap-0.5 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-sm">
                        <Check className="size-2.5" /> Active
                      </span>
                    )}
                  </div>
                  <div className="p-1.5">
                    <div className="text-[11px] font-semibold text-foreground line-clamp-1">
                      {preset.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground line-clamp-1">{preset.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. PROFILE PICTURE / AVATAR CONTROLS */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Camera className="size-4 text-primary" /> Profile Picture / Avatar
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your profile photo from your device or provide a direct image link.
              </p>
            </div>
            {avatar !== profile.photo && (
              <button
                type="button"
                onClick={() => setAvatar(profile.photo)}
                className="text-xs text-primary hover:underline"
              >
                Use Default Farhad Photo
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar Round Preview */}
            <div className="relative shrink-0">
              <img
                src={avatar || profile.photo}
                alt="Avatar preview"
                className="size-24 rounded-2xl border-2 border-primary/40 object-cover shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1 ring-2 ring-card text-white">
                <Check className="size-3" />
              </span>
            </div>

            <div className="flex-1 w-full space-y-3">
              {/* File Upload Box */}
              <div className="rounded-xl border border-dashed border-border/80 bg-secondary/30 p-3.5 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto size-5 text-muted-foreground mb-1.5" />
                <label className="cursor-pointer text-xs font-semibold text-primary hover:underline">
                  Upload Photo from Computer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {avatarUploadName ? `Selected: ${avatarUploadName}` : "Supports PNG, JPG, WEBP, GIF (Max 10MB)"}
                </p>
              </div>

              {/* Direct URL */}
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Or Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. AUTHOR IDENTITY & BIO DETAILS */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> Author Profile &amp; Bio Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Sub-role / Headline</label>
              <input
                type="text"
                value={subRole}
                onChange={(e) => setSubRole(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">Author Bio / Publication Synopsis</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Education Tag</label>
              <input
                type="text"
                value={educationTag}
                onChange={(e) => setEducationTag(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Architecture Tag</label>
              <input
                type="text"
                value={architectureTag}
                onChange={(e) => setArchitectureTag(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Activity Tag</label>
              <input
                type="text"
                value={activeTag}
                onChange={(e) => setActiveTag(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save / Reset Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-border/80 bg-secondary/50 px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Reset All Profile Defaults
          </button>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSaving || isProcessingImg}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Saving & Syncing All Pages..." : "Save Profile & Cover Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   7. SETTINGS & DB SYNC MANAGER
   ========================================================= */
function SettingsManager({ onGoToProfile }: { onGoToProfile?: () => void }) {
  const [newPasscode, setNewPasscode] = useState("");
  const currentPasscode = getAdminPasscode();

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) return;
    setAdminPasscode(newPasscode.trim());
    toast.success("Master passcode updated successfully!");
    setNewPasscode("");
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure? This will reset all sections back to default values from portfolio.ts."
      )
    ) {
      resetPortfolioData();
      toast.success("All portfolio sections reset to defaults.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Profile & Blog Cover Banner Card */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Camera className="size-4 text-primary" /> Profile Picture &amp; Blog Cover Banner
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Customize your profile avatar photo, blog header cover image, and author headline with live preview.
          </p>
        </div>
        {onGoToProfile && (
          <button
            type="button"
            onClick={onGoToProfile}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
          >
            <Camera className="size-3.5" /> Open Profile &amp; Cover Settings →
          </button>
        )}
      </div>
      {/* Cloud Database Status */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
          <Sparkles className="size-4 text-primary" /> Supabase Cloud Database Status
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Connect your free Supabase project so your published blogs and projects sync live to
          everyone in the world without requiring code redeployment.
        </p>

        <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">Current Storage Provider:</span>
            {isSupabaseConfigured ? (
              <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">
                Connected to Supabase
              </span>
            ) : (
              <span className="rounded-md bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-400">
                Browser Persistent Cache (Offline Mode)
              </span>
            )}
          </div>

          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            To link Supabase, create a project at{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              supabase.com
            </a>
            , execute the provided SQL script in the SQL editor, and put your{" "}
            <code className="rounded bg-secondary px-1 text-foreground">VITE_SUPABASE_URL</code> and{" "}
            <code className="rounded bg-secondary px-1 text-foreground">VITE_SUPABASE_ANON_KEY</code>{" "}
            into your <code className="text-foreground">.env</code> file.
          </p>
        </div>
      </div>

      {/* Change Passcode */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground">Change Admin Passcode</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Current passcode is:{" "}
          <span className="font-mono font-bold text-primary">{currentPasscode}</span>
        </p>

        <form onSubmit={handleUpdatePasscode} className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Enter new master passcode..."
            value={newPasscode}
            onChange={(e) => setNewPasscode(e.target.value)}
            required
            className="flex-1 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Update Passcode
          </button>
        </form>
      </div>

      {/* Reset & Sync */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <h3 className="text-base font-bold text-rose-500">Restore Initial Data</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Reset all dynamic sections back to the original initial content from portfolio.ts.
        </p>
        <button
          onClick={handleResetData}
          className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
        >
          Reset to Factory Defaults
        </button>
      </div>
    </div>
  );
}
