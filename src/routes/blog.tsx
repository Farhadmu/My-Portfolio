import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Heart,
  Share2,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  BookOpen,
  Check,
  PlusCircle,
  Tag,
  Filter,
  X,
  MessageSquare,
  Send,
  Mail,
  ThumbsUp,
  Lightbulb,
  Award,
  Smile,
  BadgeCheck,
  User,
  ShieldAlert,
  Play,
  Video,
  ArrowUpRight,
  Layers,
  Camera,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { useDynamicBlogs, useProfileConfig } from "@/hooks/usePortfolioData";
import {
  reactToBlogPost,
  addCommentToBlogPost,
  sendDirectMessage,
  type BlogPost,
  type BlogComment,
} from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorGlow, ScrollProgress } from "@/components/Chrome";
import { toast } from "sonner";

// Helper function to detect & format video embeds (YouTube, Vimeo, MP4 direct)
function parseVideoEmbed(url: string) {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();

  // YouTube match: regular watch, shortlink, embed, shorts
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube" as const,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`,
    };
  }

  // Vimeo match
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo" as const,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Direct MP4 / WebM / video stream
  if (
    cleanUrl.match(/\.(mp4|webm|ogg)($|\?)/i) ||
    cleanUrl.startsWith("blob:") ||
    cleanUrl.startsWith("data:video")
  ) {
    return {
      type: "direct" as const,
      embedUrl: cleanUrl,
    };
  }

  // Generic iframe link
  return {
    type: "iframe" as const,
    embedUrl: cleanUrl,
  };
}

function VideoPlayer({
  url,
  title,
  className = "",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const parsed = parseVideoEmbed(url);
  if (!parsed) return null;

  if (parsed.type === "direct") {
    return (
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black/90 border border-border/60 shadow-lg ${className}`}
      >
        <video
          src={parsed.embedUrl}
          controls
          playsInline
          className="h-full w-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black/90 border border-border/60 shadow-lg ${className}`}
    >
      <iframe
        src={parsed.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: `Tech Insights & Articles — ${profile.name}` },
      {
        name: "description",
        content: `Read technical articles, system design deep-dives, and development notes by ${profile.name}.`,
      },
      { property: "og:title", content: `Tech Insights & Articles — ${profile.name}` },
      { property: "og:type", content: "blog" },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { blogs, loading, reload } = useDynamicBlogs();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedView, setFeedView] = useState<"split" | "articles" | "videos">("split");

  // Auth / Guest state
  const [isAdmin, setIsAdmin] = useState(false);

  // Direct Message Modal state
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Comment input state (for post reader modal)
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reaction popover or fast reaction tracking
  const [userReactions, setUserReactions] = useState<Record<string, string>>({});

  // Dynamic Profile & Cover configuration (hydrates on mount & auto-syncs)
  const profileConfig = useProfileConfig();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(sessionStorage.getItem("farhad_admin_authed") === "true");
    }
  }, []);

  // Sync selected blog when data updates
  useEffect(() => {
    if (selectedBlog) {
      const refreshed = blogs.find((b) => b.id === selectedBlog.id);
      if (refreshed) setSelectedBlog(refreshed);
    }
  }, [blogs]);

  // Derive categories
  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCat = selectedCategory === "All" || blog.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt.toLowerCase().includes(q) ||
      blog.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const videoPosts = filteredBlogs.filter((b) => Boolean(b.videoUrl && b.videoUrl.trim()));
  const articlePosts = filteredBlogs.filter((b) => !b.videoUrl || !b.videoUrl.trim());

  // Handle reaction (Like, Love, Insightful, Celebrate)
  const handleReaction = async (
    e: React.MouseEvent,
    blogId: string,
    type: "like" | "love" | "insightful" | "celebrate"
  ) => {
    e.stopPropagation();
    if (userReactions[blogId]) {
      toast.info("You already reacted to this article! ❤️");
      return;
    }
    setUserReactions((prev) => ({ ...prev, [blogId]: type }));
    await reactToBlogPost(blogId, type);
    reload();

    const labels = {
      like: "Liked! 👍",
      love: "Loved it! ❤️",
      insightful: "Marked as Insightful! 💡",
      celebrate: "Celebrated! 👏",
    };
    toast.success(labels[type] || "Thanks for reacting!");
  };

  // Handle article share
  const handleShare = (e: React.MouseEvent, blog: BlogPost) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : profile.siteUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${url}#${blog.slug}`);
      setCopiedId(blog.id);
      toast.success("Link copied! Share it on LinkedIn, Twitter, or with friends.");
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Submit Direct Message
  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName.trim() || !msgEmail.trim() || !msgBody.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSendingMsg(true);
    try {
      await sendDirectMessage({
        name: msgName,
        email: msgEmail,
        message: msgBody,
      });
      toast.success("Message sent! Farhad will review it and reply via email.");
      setIsMsgModalOpen(false);
      setMsgName("");
      setMsgEmail("");
      setMsgBody("");
    } catch (err) {
      toast.error("Could not send message. Please try again.");
    } finally {
      setSendingMsg(false);
    }
  };

  // Submit Comment on post
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      await addCommentToBlogPost(selectedBlog.id, {
        name: commentName.trim() || "Visitor",
        text: commentText.trim(),
      });
      toast.success("Comment added! Thanks for sharing your thought.");
      setCommentText("");
      reload();
    } catch (err) {
      toast.error("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderBlogCard = (blog: BlogPost, isVideoCard: boolean = false) => {
    const totalReactions =
      (blog.reactions?.like || 0) +
      (blog.reactions?.love || 0) +
      (blog.reactions?.insightful || 0) +
      (blog.reactions?.celebrate || 0) ||
      blog.likes ||
      0;
    const commentsCount = blog.comments?.length || 0;
    const isVideo = Boolean(blog.videoUrl && blog.videoUrl.trim());

    return (
      <article
        key={blog.id}
        id={blog.slug}
        onClick={() => setSelectedBlog(blog)}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-card/60 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:bg-card/90 ${
          isVideo
            ? "border-rose-500/25 hover:border-rose-500/60 hover:shadow-[0_20px_45px_-10px_rgba(244,63,94,0.18)]"
            : "border-border/70 hover:border-primary/60 hover:shadow-[0_20px_45px_-10px_rgba(6,182,212,0.18)]"
        }`}
      >
        {/* Subtle top ambient indicator on hover */}
        <div
          className={`absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-transparent to-transparent transition-all duration-300 ${
            isVideo ? "group-hover:via-rose-500" : "group-hover:via-primary"
          }`}
        />

        {/* Author Row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={blog.authorAvatar || profileConfig.avatar || profile.photo}
                alt={blog.authorName}
                className={`size-10 rounded-full border object-cover ring-2 transition-transform duration-300 group-hover:scale-105 ${
                  isVideo ? "border-rose-500/40 ring-rose-500/20" : "border-primary/40 ring-primary/20"
                }`}
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-semibold text-foreground transition-colors ${
                    isVideo ? "group-hover:text-rose-400" : "group-hover:text-primary"
                  }`}
                >
                  {blog.authorName}
                </span>
                <span
                  className={`rounded-md border px-1.5 py-0.2 text-[9px] font-semibold ${
                    isVideo
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                      : "bg-primary/15 border-primary/30 text-primary"
                  }`}
                >
                  Author
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className={`size-3 ${isVideo ? "text-rose-400/80" : "text-primary/70"}`} />
                  {blog.readTime}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {blog.videoUrl && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                <Play className="size-3 fill-rose-400" />
                Video Breakdown
              </span>
            )}
            <span className="rounded-full border border-border/70 bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors group-hover:border-primary/40">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="flex items-start justify-between gap-4">
          <h2
            className={`text-xl font-bold tracking-tight text-foreground transition-colors duration-200 sm:text-2xl ${
              isVideo ? "group-hover:text-rose-400" : "group-hover:text-primary"
            }`}
          >
            {blog.title}
          </h2>
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors shrink-0 pt-1 ${
              isVideo ? "group-hover:text-rose-400" : "group-hover:text-primary"
            }`}
          >
            {isVideo ? "Watch" : "Read"}{" "}
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Video Player or Cover Image */}
        {blog.videoUrl ? (
          <div
            className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-black/90 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoPlayer url={blog.videoUrl} title={blog.title} />
          </div>
        ) : blog.coverImage ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
            <img
              src={blog.coverImage}
              alt={blog.title}
              loading="lazy"
              className="h-56 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:h-72"
            />
          </div>
        ) : null}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-md border border-border/40 bg-secondary/70 px-2 py-0.5 text-xs text-muted-foreground transition-colors ${
                  isVideo ? "group-hover:border-rose-500/30" : "group-hover:border-primary/30"
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction counts counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex -space-x-1">
              <span className="grid size-4 place-items-center rounded-full bg-blue-500 text-[9px] text-white shadow-sm">
                👍
              </span>
              <span className="grid size-4 place-items-center rounded-full bg-rose-500 text-[9px] text-white shadow-sm">
                ❤️
              </span>
              <span className="grid size-4 place-items-center rounded-full bg-amber-500 text-[9px] text-white shadow-sm">
                💡
              </span>
            </span>
            <span className="font-medium">{totalReactions} reactions</span>
          </div>

          <span
            className={`transition-colors hover:underline ${
              isVideo ? "hover:text-rose-400" : "hover:text-primary"
            }`}
          >
            {commentsCount > 0 ? `${commentsCount} comments` : "Be the first to comment"}
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={(e) => handleReaction(e, blog.id, "like")}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-blue-400 transition-colors"
            >
              <ThumbsUp className="size-3.5" />
              <span>Like</span>
            </button>
            <button
              onClick={(e) => handleReaction(e, blog.id, "love")}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-rose-400 transition-colors"
            >
              <Heart className="size-3.5" />
              <span>Love</span>
            </button>
            <button
              onClick={(e) => handleReaction(e, blog.id, "insightful")}
              className="hidden xs:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-amber-400 transition-colors"
            >
              <Lightbulb className="size-3.5" />
              <span>Insightful</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlog(blog);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <MessageSquare className="size-3.5" />
              <span>Comment</span>
            </button>
          </div>

          <button
            onClick={(e) => handleShare(e, blog)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {copiedId === blog.id ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <ScrollProgress />
      <CursorGlow />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6">
        {/* Top Back & Optional Admin Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-3.5 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Portfolio
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
            >
              <PlusCircle className="size-3.5" />
              Admin Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setIsMsgModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-all"
            >
              <Mail className="size-3.5" /> Message Farhad
            </button>
          )}
        </div>

        {/* Tech Publication Creator Profile Header */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md shadow-2xl transition-all">
          {/* Aesthetic Cyber Engineering Cover Banner */}
          <div className="group/cover relative h-40 w-full overflow-hidden sm:h-56">
            <img
              src={profileConfig.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop"}
              alt="Engineering Cover Banner"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/cover:scale-105"
            />
            {/* Ambient gradients, tech grid texture, and subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/35 to-black/50" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />
            <div className="absolute -right-12 -top-12 size-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 size-56 rounded-full bg-violet-500/25 blur-3xl" />

            {/* Badges on cover */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-black/60 px-3 py-1.5 text-xs mono font-semibold text-primary backdrop-blur-md transition-all hover:bg-primary/20 hover:border-primary shadow-lg"
                  title="Customize Profile Avatar & Cover in Admin Dashboard"
                >
                  <Camera className="size-3.5" />
                  <span>Edit Banner & Profile</span>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 text-[11px] mono text-white/90 backdrop-blur-md shadow-lg">
                <Sparkles className="size-3 text-cyan-400" />
                <span>Engineering Publication</span>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="relative px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-20 mb-4">
              <div className="group/avatar relative inline-block">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-24 sm:size-32 rounded-2xl border-4 border-card object-cover shadow-2xl ring-2 ring-primary/40 transition-transform duration-300 group-hover/avatar:scale-105"
                />
                <span
                  title="Available for Software Engineering Roles"
                  className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-card ring-2 ring-emerald-400/50 animate-pulse"
                />
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/65 opacity-0 transition-opacity backdrop-blur-xs group-hover/avatar:opacity-100 text-white"
                    title="Change Profile Picture in Admin"
                  >
                    <Camera className="size-5 text-cyan-300" />
                    <span className="text-[10px] font-semibold mt-1">Change</span>
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsMsgModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 hover:bg-primary/90 transition-all"
                >
                  <MessageSquare className="size-3.5" />
                  Message Farhad
                </button>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/70 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-all shadow-sm"
                >
                  Connect on LinkedIn ↗
                </a>

                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/70 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-sm"
                >
                  Resume
                </a>
              </div>
            </div>

            {/* Name, Roles & Engineering Telemetry */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {profileConfig.name || profile.name}
                </h1>
                <BadgeCheck className="size-5 text-primary fill-primary/20" />
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium mt-0.5">
                {profileConfig.subRole || "CSE @ BAIUST · Software Engineer & Systems Builder · Tech Writer"}
              </p>
              <p className="text-xs text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {profileConfig.bio ||
                  "Writing deep-dives into Next.js 15, React Server Components, distributed architectures, C++ algorithmic complexity, and real-world production engineering."}
              </p>

              {/* Author Telemetry Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="mono rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold text-foreground/90">
                  {profileConfig.educationTag || "🎓 Computer Science @ BAIUST"}
                </span>
                <span className="mono rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {profileConfig.architectureTag || "⚡ Systems & Full-Stack Architecture"}
                </span>
                <span className="mono rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                  {profileConfig.activeTag || "● Active Publications"}
                </span>
              </div>
            </div>

            {/* ONLY FOR LOGGED-IN ADMIN (Farhad) */}
            {isAdmin && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-3.5 sm:p-4 backdrop-blur-md shadow-inner">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-10 rounded-full border border-primary/40 object-cover"
                />
                <Link
                  to="/admin"
                  className="flex-1 rounded-xl border border-primary/30 bg-background/90 px-4 py-2.5 text-left text-xs sm:text-sm text-foreground hover:border-primary transition-all shadow-sm"
                >
                  <span className="font-semibold text-primary">Admin Active:</span> What are you
                  building or learning today, Farhad? Click to publish a post or customize your profile...
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by keyword, topic, or tech tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-secondary/40 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs with Counts */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const count = cat === "All" ? blogs.length : blogs.filter((b) => b.category === cat).length;
              const isSel = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`mono inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSel
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                      : "border border-border/60 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isSel ? "bg-black/25 text-white" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout / Format View Switcher */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/40 p-2 sm:p-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
            <Layers className="size-4 text-primary" />
            <span className="font-semibold text-foreground">Content Layout:</span>
          </div>
          <div className="inline-flex rounded-xl bg-secondary/60 p-1 border border-border/60">
            <button
              type="button"
              onClick={() => setFeedView("split")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                feedView === "split"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Split View (Articles ⇄ Videos)</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-bold">
                {filteredBlogs.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFeedView("articles")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                feedView === "articles"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Articles Only</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-bold">
                {articlePosts.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFeedView("videos")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                feedView === "videos"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <Video className="size-3.5" />
              <span>Videos Only</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-bold">
                {videoPosts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Articles & Videos Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-muted-foreground">Loading publications feed...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <BookOpen className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="mt-3 text-base font-semibold">No posts found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms or category filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        ) : feedView === "split" ? (
          /* Dual Column Split View: Articles (7 cols) & Videos (5 cols) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Articles & Architecture Notes */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-xs">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Articles &amp; Architecture Notes
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Technical writeups, design patterns &amp; production blueprints
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
                  {articlePosts.length} {articlePosts.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {articlePosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
                  <BookOpen className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-2 text-xs text-muted-foreground">No written articles match this filter.</p>
                </div>
              ) : (
                articlePosts.map((blog) => renderBlogCard(blog, false))
              )}
            </div>

            {/* Right Column: Video Walkthroughs & Demos */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-xs">
                    <Video className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Video Walkthroughs &amp; Demos
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Code demonstrations and visual system breakdowns
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-rose-400">
                  {videoPosts.length} {videoPosts.length === 1 ? "video" : "videos"}
                </span>
              </div>

              {videoPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
                  <Video className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-2 text-xs text-muted-foreground">No video breakdowns match this filter.</p>
                </div>
              ) : (
                videoPosts.map((blog) => renderBlogCard(blog, true))
              )}
            </div>
          </div>
        ) : feedView === "articles" ? (
          /* Articles Only Feed */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">All Technical Articles</h2>
              </div>
              <span className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
                {articlePosts.length} posts
              </span>
            </div>
            {articlePosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
                <BookOpen className="mx-auto size-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">No written articles match this filter.</p>
              </div>
            ) : (
              articlePosts.map((blog) => renderBlogCard(blog, false))
            )}
          </div>
        ) : (
          /* Videos Only Feed */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Video className="size-5 text-rose-400" />
                <h2 className="text-lg font-bold text-foreground">All Video Breakdowns</h2>
              </div>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-rose-400">
                {videoPosts.length} videos
              </span>
            </div>
            {videoPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
                <Video className="mx-auto size-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">No video breakdowns match this filter.</p>
              </div>
            ) : (
              videoPosts.map((blog) => renderBlogCard(blog, true))
            )}
          </div>
        )}

        {/* Read Article & Full Discussion Modal */}
        {selectedBlog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in"
            onClick={() => setSelectedBlog(null)}
          >
            <div
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky top reading indicator bar */}
              <div className="sticky top-0 -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 h-1 bg-gradient-to-r from-primary via-cyan-400 to-emerald-400 z-30 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute right-4 top-4 rounded-xl border border-border bg-secondary/80 p-2 text-muted-foreground hover:text-foreground transition-colors z-30"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3 pt-2">
                <span className="rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5">{selectedBlog.category}</span>
                <span>•</span>
                <span>{selectedBlog.readTime}</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl leading-snug">
                {selectedBlog.title}
              </h2>

              <div className="mt-4 flex items-center gap-3 border-y border-border/50 py-3">
                <img
                  src={selectedBlog.authorAvatar || profileConfig.avatar || profile.photo}
                  alt={selectedBlog.authorName}
                  className="size-11 rounded-full border border-primary/30 object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    {selectedBlog.authorName}
                    <BadgeCheck className="size-4 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">{selectedBlog.authorRole}</div>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Video Player or Cover Image */}
              {selectedBlog.videoUrl ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-border/80 shadow-2xl">
                  <VideoPlayer
                    url={selectedBlog.videoUrl}
                    title={selectedBlog.title}
                    className="aspect-video w-full"
                  />
                </div>
              ) : selectedBlog.coverImage ? (
                <img
                  src={selectedBlog.coverImage}
                  alt={selectedBlog.title}
                  className="mt-6 w-full rounded-2xl object-cover max-h-96 shadow-md border border-border/50"
                />
              ) : null}

              {/* Body Content */}
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground sm:text-base">
                {selectedBlog.content.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="mt-6 text-lg font-bold text-foreground">
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("```")) {
                    const code = paragraph.replace(/```[a-z]*\n?/g, "");
                    return (
                      <div key={idx} className="my-5 overflow-hidden rounded-xl border border-border/80 bg-zinc-950 shadow-xl">
                        <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900/90 px-4 py-2 text-[11px] font-mono text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-rose-500/80" />
                            <span className="size-2.5 rounded-full bg-amber-500/80" />
                            <span className="size-2.5 rounded-full bg-emerald-500/80" />
                            <span className="ml-2 text-zinc-500">terminal.tsx</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Code Snippet</span>
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs font-mono text-emerald-400">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 border-t border-border/50 pt-4">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Reaction Bar inside modal */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/50 py-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={(e) => handleReaction(e, selectedBlog.id, "like")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:bg-secondary hover:text-blue-400 transition-colors"
                  >
                    <ThumbsUp className="size-3.5" />
                    <span>Like ({selectedBlog.reactions?.like || selectedBlog.likes || 0})</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(e, selectedBlog.id, "love")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:bg-secondary hover:text-rose-400 transition-colors"
                  >
                    <Heart className="size-3.5" />
                    <span>Love ({selectedBlog.reactions?.love || 0})</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(e, selectedBlog.id, "insightful")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:bg-secondary hover:text-amber-400 transition-colors"
                  >
                    <Lightbulb className="size-3.5" />
                    <span>Insightful ({selectedBlog.reactions?.insightful || 0})</span>
                  </button>
                </div>

                <button
                  onClick={(e) => handleShare(e, selectedBlog)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
                >
                  <Share2 className="size-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Interactive Comments Section */}
              <div className="mt-8 space-y-6">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  Discussion ({selectedBlog.comments?.length || 0})
                </h3>

                {/* Comment Input Form */}
                <form
                  onSubmit={handleAddComment}
                  className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full sm:w-1/2 rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your perspective or ask Farhad a question..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Send className="size-3.5" />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>

                {/* Existing Comments List */}
                <div className="space-y-3">
                  {!selectedBlog.comments || selectedBlog.comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 text-center">
                      No comments yet. Be the first to start the discussion!
                    </p>
                  ) : (
                    selectedBlog.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-xl border border-border/50 bg-secondary/20 p-3.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/20 text-primary text-[10px] font-bold grid place-items-center">
                              {comment.name.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-foreground">
                              {comment.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Direct Message Modal (Visitor to Farhad) */}
        {isMsgModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
            onClick={() => setIsMsgModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsMsgModalOpen(false)}
                className="absolute right-4 top-4 rounded-xl border border-border bg-secondary/80 p-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-12 rounded-full border border-primary/30 object-cover"
                />
                <div>
                  <h3 className="font-bold text-base text-foreground flex items-center gap-1">
                    Message {profileConfig.name || profile.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Direct message straight to Farhad's dashboard
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendDirectMessage} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Your Email (for reply)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={msgEmail}
                    onChange={(e) => setMsgEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message, collaboration proposal, or project inquiry..."
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    <Send className="size-3.5" />
                    {sendingMsg ? "Sending Message..." : "Send to Farhad"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
