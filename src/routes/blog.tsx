import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Heart,
  Share2,
  Clock,
  ArrowLeft,
  ArrowRight,
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
  Copy,
  ListOrdered,
  Eye,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { useDynamicBlogs, useProfileConfig } from "@/hooks/usePortfolioData";
import {
  reactToBlogPost,
  addCommentToBlogPost,
  sendDirectMessage,
  incrementBlogViews,
  clapForBlogPost,
  type BlogPost,
  type BlogComment,
} from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/Chrome";
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
  const [readScrollPercent, setReadScrollPercent] = useState(0);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

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

  // Sync state to/from URL search params (?search=...&category=...&post=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    const catParam = params.get("category");
    const postSlug = params.get("post");

    if (searchParam) setSearch(searchParam);
    if (catParam) setSelectedCategory(catParam);
    if (postSlug && blogs.length > 0) {
      const match = blogs.find((b) => b.slug === postSlug || b.id === postSlug);
      if (match) {
        setSelectedBlog(match);
        incrementBlogViews(match.id);
      }
    }
  }, [blogs.length]);

  const updateUrlParams = (newSearch: string, newCat: string, postSlug?: string) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCat && newCat !== "All") params.set("category", newCat);
    if (postSlug) params.set("post", postSlug);

    const queryStr = params.toString();
    const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  const handleOpenBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setReadScrollPercent(0);
    incrementBlogViews(blog.id);
    reload();
    updateUrlParams(search, selectedCategory, blog.slug);
  };

  const handleCloseBlog = () => {
    setSelectedBlog(null);
    updateUrlParams(search, selectedCategory);
  };

  // Per-post dynamic document title & meta description
  useEffect(() => {
    if (selectedBlog) {
      document.title = `${selectedBlog.metaTitle || selectedBlog.title} — ${profile.name}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", selectedBlog.metaDescription || selectedBlog.excerpt);
      }
    } else {
      document.title = `Tech Insights & Articles — ${profile.name}`;
    }
  }, [selectedBlog]);

  // Sync selected blog when data updates
  useEffect(() => {
    if (selectedBlog) {
      const refreshed = blogs.find((b) => b.id === selectedBlog.id);
      if (refreshed) setSelectedBlog(refreshed);
    }
  }, [blogs]);

  // Derive categories
  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  // Filter blogs (hide drafts and unreleased scheduled posts from non-admin visitors)
  const now = new Date().toISOString();
  const filteredBlogs = blogs.filter((blog) => {
    if (!isAdmin) {
      if (blog.status === "draft" || blog.published === false) return false;
      if (blog.status === "scheduled" && blog.publishAt && blog.publishAt > now) return false;
    }
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

  // Handle claps
  const handleClap = async (e: React.MouseEvent, blogId: string) => {
    e.stopPropagation();
    await clapForBlogPost(blogId);
    reload();
    toast.success("Clapped! 👏");
  };

  // Handle article share
  const handleShare = (e: React.MouseEvent, blog: BlogPost) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.origin : profile.siteUrl;
    const shareLink = `${url}/blog?post=${blog.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink);
      setCopiedId(blog.id);
      toast.success("Link copied! Share it on WhatsApp, LinkedIn, or Twitter.");
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

  // Computed values for active post reading modal
  const activeBlogIndex = selectedBlog ? blogs.findIndex((b) => b.id === selectedBlog.id) : -1;
  const prevBlogPost = activeBlogIndex > 0 ? blogs[activeBlogIndex - 1] : null;
  const nextBlogPost =
    activeBlogIndex >= 0 && activeBlogIndex < blogs.length - 1 ? blogs[activeBlogIndex + 1] : null;

  const relatedBlogPosts = useMemo(() => {
    if (!selectedBlog) return [];
    return blogs
      .filter(
        (b) =>
          b.id !== selectedBlog.id &&
          (b.category === selectedBlog.category ||
            b.tags.some((t) => selectedBlog.tags.includes(t)))
      )
      .slice(0, 2);
  }, [blogs, selectedBlog]);

  const blogHeadings = useMemo(() => {
    if (!selectedBlog) return [];
    return selectedBlog.content
      .split("\n\n")
      .filter((p) => p.startsWith("### "))
      .map((p, idx) => {
        const text = p.replace("### ", "").trim();
        const id = `toc-heading-${idx}`;
        return { id, text };
      });
  }, [selectedBlog]);

  const blogWordCount = selectedBlog
    ? selectedBlog.content.split(/\s+/).filter(Boolean).length
    : 0;
  const blogEstMinutes = Math.max(1, Math.ceil(blogWordCount / 180));

  const shareOrigin = typeof window !== "undefined" ? window.location.origin : profile.siteUrl;
  const activePostShareUrl = selectedBlog ? `${shareOrigin}/blog?post=${selectedBlog.slug}` : "";
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    (selectedBlog?.title || "") + " " + activePostShareUrl
  )}`;
  const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    activePostShareUrl
  )}`;
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    activePostShareUrl
  )}`;

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
        onClick={() => handleOpenBlog(blog)}
        className="group relative cursor-pointer rounded-2xl border-2 border-slate-900 bg-[#fffefb] p-5 sm:p-6 shadow-[3px_3px_0px_#0f172a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a]"
      >
        {/* Author Row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={blog.authorAvatar || profileConfig.avatar || profile.photo}
                alt={blog.authorName}
                className="size-10 rounded-full border-2 border-slate-900 object-cover shadow-[1px_1px_0px_#0f172a]"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {blog.authorName}
                </span>
                <span className="rounded border border-slate-900 bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-800">
                  Author
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3 text-slate-500" />
                  {blog.readTime}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {blog.videoUrl && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 shadow-[1px_1px_0px_#0f172a]">
                <Play className="size-3 fill-rose-800" />
                Video Demo
              </span>
            )}
            <span className="rounded-full border-2 border-slate-900 bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
              {blog.category}
            </span>
            {blog.views ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
                <Eye className="size-3" /> {blog.views}
              </span>
            ) : null}
            {isAdmin && blog.status && blog.status !== "published" && (
              <span className="rounded border border-amber-600 bg-amber-100 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-800 uppercase">
                {blog.status}
              </span>
            )}
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-primary sm:text-2xl">
            {blog.title}
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-700 transition-colors shrink-0 pt-1 group-hover:text-primary">
            {isVideo ? "Watch" : "Read"}{" "}
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Video Player or Cover Image */}
        {blog.videoUrl ? (
          <div
            className="mt-4 overflow-hidden rounded-xl border-2 border-slate-900 bg-black shadow-[2px_2px_0px_#0f172a]"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoPlayer url={blog.videoUrl} title={blog.title} />
          </div>
        ) : blog.coverImage ? (
          <div className="mt-4 overflow-hidden rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <img
              src={blog.coverImage}
              alt={blog.title}
              loading="lazy"
              className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:h-72"
            />
          </div>
        ) : null}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-slate-400 bg-white px-2 py-0.5 text-xs font-mono text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction counts counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-3">
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
            <span className="font-semibold">{totalReactions} reactions</span>
          </div>

          <span className="font-semibold text-slate-700 hover:text-primary transition-colors hover:underline">
            {commentsCount > 0 ? `${commentsCount} comments` : "Be the first to comment"}
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={(e) => handleReaction(e, blog.id, "like")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <ThumbsUp className="size-3.5 text-blue-600" />
              <span>Like</span>
            </button>
            <button
              onClick={(e) => handleReaction(e, blog.id, "love")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Heart className="size-3.5 text-rose-600" />
              <span>Love</span>
            </button>
            <button
              onClick={(e) => handleReaction(e, blog.id, "insightful")}
              className="hidden xs:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Lightbulb className="size-3.5 text-amber-600" />
              <span>Insightful</span>
            </button>
            <button
              onClick={(e) => handleClap(e, blog.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <span>👏</span>
              <span>{blog.claps || 0}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenBlog(blog);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <MessageSquare className="size-3.5" />
              <span>Comment</span>
            </button>
          </div>

          <button
            onClick={(e) => handleShare(e, blog)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
          >
            {copiedId === blog.id ? (
              <>
                <Check className="size-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
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
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6">
        {/* Top Back & Optional Admin Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a]"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Portfolio
          </Link>

          {isAdmin ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-amber-100 px-3.5 py-2 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <PlusCircle className="size-3.5" />
              Admin Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setIsMsgModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a] transition-all hover:bg-slate-100"
            >
              <Mail className="size-3.5 text-primary" /> Message Farhad
            </button>
          )}
        </div>

        {/* Tech Publication Creator Profile Header */}
        <div className="mb-10 overflow-hidden rounded-2xl border-2 border-slate-900 bg-[#fffefb] shadow-[4px_4px_0px_#0f172a]">
          {/* Notebook / Workshop Cover Banner */}
          <div className="group/cover relative h-40 w-full overflow-hidden border-b-2 border-slate-900 bg-slate-900 sm:h-52">
            <img
              src={profileConfig.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop"}
              alt="Engineering Cover Banner"
              className="h-full w-full object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover/cover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/40" />

            {/* Badges on cover */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] transition-all hover:bg-slate-100"
                  title="Customize Profile Avatar & Cover in Admin Dashboard"
                >
                  <Camera className="size-3.5" />
                  <span>Edit Banner & Profile</span>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-amber-100 px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
                <Sparkles className="size-3 text-amber-700" />
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
                  className="size-24 sm:size-32 rounded-xl border-4 border-white object-cover shadow-[3px_3px_0px_#0f172a] ring-2 ring-slate-900 transition-transform duration-300 group-hover/avatar:scale-105"
                />
                <span
                  title="Available for Software Engineering Roles"
                  className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-slate-900"
                />
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/75 opacity-0 transition-opacity group-hover/avatar:opacity-100 text-white"
                    title="Change Profile Picture in Admin"
                  >
                    <Camera className="size-5" />
                    <span className="text-[10px] font-bold mt-1">Change</span>
                  </Link>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsMsgModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] transition-all"
                >
                  <MessageSquare className="size-3.5" />
                  Message Farhad
                </button>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 transition-all"
                >
                  Connect on LinkedIn ↗
                </a>

                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 transition-all"
                >
                  Resume
                </a>
              </div>
            </div>

            {/* Name, Roles & Engineering Telemetry */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {profileConfig.name || profile.name}
                </h1>
                <BadgeCheck className="size-5 text-primary" />
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5">
                {profileConfig.subRole || "CSE @ BAIUST · Software Engineer & Systems Builder · Tech Writer"}
              </p>
              <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed">
                {profileConfig.bio ||
                  "Writing deep-dives into Next.js 15, React Server Components, distributed architectures, C++ algorithmic complexity, and real-world production engineering."}
              </p>

              {/* Author Telemetry Badges */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="rounded border-2 border-slate-900 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-[1px_1px_0px_#0f172a]">
                  {profileConfig.educationTag || "🎓 Computer Science @ BAIUST"}
                </span>
                <span className="rounded border-2 border-slate-900 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-900 shadow-[1px_1px_0px_#0f172a]">
                  {profileConfig.architectureTag || "⚡ Systems & Full-Stack Architecture"}
                </span>
                <span className="rounded border-2 border-slate-900 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900 shadow-[1px_1px_0px_#0f172a]">
                  {profileConfig.activeTag || "● Active Publications"}
                </span>
              </div>
            </div>

            {/* ONLY FOR LOGGED-IN ADMIN (Farhad) */}
            {isAdmin && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-900 bg-amber-50 p-3.5 sm:p-4">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-10 rounded-full border-2 border-slate-900 object-cover"
                />
                <Link
                  to="/admin"
                  className="flex-1 rounded-lg border-2 border-slate-900 bg-white px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all shadow-[2px_2px_0px_#0f172a]"
                >
                  <span className="font-bold text-primary">Admin Active:</span> What are you
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
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by keyword, topic, or tech tag..."
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                updateUrlParams(val, selectedCategory, selectedBlog?.slug);
              }}
              className="w-full rounded-xl border-2 border-slate-900 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-500 shadow-[2px_2px_0px_#0f172a] focus:outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  updateUrlParams("", selectedCategory, selectedBlog?.slug);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs with Counts */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => {
              const count = cat === "All" ? blogs.length : blogs.filter((b) => b.category === cat).length;
              const isSel = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    updateUrlParams(search, cat, selectedBlog?.slug);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 px-3 py-1.5 text-xs font-bold transition-all ${
                    isSel
                      ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_#0f172a]"
                      : "bg-white text-slate-800 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isSel ? "bg-black/20 text-white" : "bg-slate-100 text-slate-700"
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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-slate-900 bg-[#fffefb] p-2 sm:p-2.5 shadow-[3px_3px_0px_#0f172a]">
          <div className="flex items-center gap-2 text-xs text-slate-700 pl-1">
            <Layers className="size-4 text-primary" />
            <span className="font-bold text-slate-900">Content Layout:</span>
          </div>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-300">
            <button
              type="button"
              onClick={() => setFeedView("split")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                feedView === "split"
                  ? "border border-slate-900 bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Split View (Articles ⇄ Videos)</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-800">
                {filteredBlogs.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFeedView("articles")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                feedView === "articles"
                  ? "border border-slate-900 bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>Articles Only</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-800">
                {articlePosts.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFeedView("videos")}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                feedView === "videos"
                  ? "border border-slate-900 bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Video className="size-3.5" />
              <span>Videos Only</span>
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px] font-bold text-white">
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
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-blue-100 border-2 border-slate-900 text-blue-900 shadow-[1px_1px_0px_#0f172a]">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Articles &amp; Architecture Notes
                    </h2>
                    <p className="text-xs text-slate-600">
                      Technical writeups, design patterns &amp; production blueprints
                    </p>
                  </div>
                </div>
                <span className="rounded-full border-2 border-slate-900 bg-white px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800 shadow-[1px_1px_0px_#0f172a]">
                  {articlePosts.length} {articlePosts.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {articlePosts.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
                  <BookOpen className="mx-auto size-8 text-slate-400" />
                  <p className="mt-2 text-xs font-medium text-slate-600">No written articles match this filter.</p>
                </div>
              ) : (
                articlePosts.map((blog) => renderBlogCard(blog, false))
              )}
            </div>

            {/* Right Column: Video Walkthroughs & Demos */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-rose-100 border-2 border-slate-900 text-rose-800 shadow-[1px_1px_0px_#0f172a]">
                    <Video className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Video Walkthroughs &amp; Demos
                    </h2>
                    <p className="text-xs text-slate-600">
                      Code demonstrations and visual system breakdowns
                    </p>
                  </div>
                </div>
                <span className="rounded-full border-2 border-slate-900 bg-rose-50 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-800 shadow-[1px_1px_0px_#0f172a]">
                  {videoPosts.length} {videoPosts.length === 1 ? "video" : "videos"}
                </span>
              </div>

              {videoPosts.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
                  <Video className="mx-auto size-8 text-slate-400" />
                  <p className="mt-2 text-xs font-medium text-slate-600">No video breakdowns match this filter.</p>
                </div>
              ) : (
                videoPosts.map((blog) => renderBlogCard(blog, true))
              )}
            </div>
          </div>
        ) : feedView === "articles" ? (
          /* Articles Only Feed */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-slate-900">All Technical Articles</h2>
              </div>
              <span className="rounded-full border-2 border-slate-900 bg-white px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800 shadow-[1px_1px_0px_#0f172a]">
                {articlePosts.length} posts
              </span>
            </div>
            {articlePosts.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                <BookOpen className="mx-auto size-10 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">No written articles match this filter.</p>
              </div>
            ) : (
              articlePosts.map((blog) => renderBlogCard(blog, false))
            )}
          </div>
        ) : (
          /* Videos Only Feed */
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div className="flex items-center gap-2">
                <Video className="size-5 text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900">All Video Breakdowns</h2>
              </div>
              <span className="rounded-full border-2 border-slate-900 bg-rose-50 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-800 shadow-[1px_1px_0px_#0f172a]">
                {videoPosts.length} videos
              </span>
            </div>
            {videoPosts.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                <Video className="mx-auto size-10 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">No video breakdowns match this filter.</p>
              </div>
            ) : (
              videoPosts.map((blog) => renderBlogCard(blog, true))
            )}
          </div>
        )}

        {/* Read Article & Full Discussion Modal */}
        {selectedBlog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 animate-in fade-in"
            onClick={handleCloseBlog}
          >
            <div
              onScroll={(e) => {
                const el = e.currentTarget;
                const scrollable = el.scrollHeight - el.clientHeight;
                const pct = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0;
                setReadScrollPercent(Math.min(100, Math.max(0, pct)));
              }}
              className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-slate-900 bg-[#fffefb] dark:bg-[#141b24] p-6 shadow-[8px_8px_0px_#0f172a] sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky top reading progress indicator bar */}
              <div className="sticky top-0 -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 h-2 bg-slate-200 dark:bg-slate-800 z-40 overflow-hidden border-b border-slate-900">
                <div
                  className="h-full bg-primary transition-[width] duration-75"
                  style={{ width: `${readScrollPercent}%` }}
                />
              </div>

              {/* Top Details & Close Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="rounded border border-slate-900 dark:border-slate-600 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-200 px-2 py-0.5">
                    {selectedBlog.category}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {blogEstMinutes} min read ({blogWordCount} words)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="inline-flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                    <Eye className="size-3" /> {selectedBlog.views || 0} views
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCloseBlog}
                  className="rounded-lg border-2 border-slate-900 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[1px_1px_0px_#0f172a] transition-colors"
                  aria-label="Close article reader"
                >
                  <X className="size-4" />
                </button>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl leading-snug">
                {selectedBlog.title}
              </h2>

              <div className="mt-4 flex items-center gap-3 border-y border-slate-200 dark:border-slate-800 py-3">
                <img
                  src={selectedBlog.authorAvatar || profileConfig.avatar || profile.photo}
                  alt={selectedBlog.authorName}
                  className="size-11 rounded-full border-2 border-slate-900 dark:border-slate-700 object-cover shadow-[1px_1px_0px_#0f172a]"
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    {selectedBlog.authorName}
                    <BadgeCheck className="size-4 text-primary" />
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{selectedBlog.authorRole}</div>
                </div>
                <div className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
                  {new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Video Player or Cover Image */}
              {selectedBlog.videoUrl ? (
                <div className="mt-6 overflow-hidden rounded-xl border-2 border-slate-900 bg-black shadow-[3px_3px_0px_#0f172a]">
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
                  className="mt-6 w-full rounded-xl object-cover max-h-96 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]"
                  loading="eager"
                  decoding="async"
                />
              ) : null}

              {/* Sticky Table of Contents Navigation */}
              {blogHeadings.length > 0 && (
                <nav
                  aria-label="Table of Contents"
                  className="my-5 rounded-xl border-2 border-slate-900 bg-[#faf8f5] dark:bg-[#16202a] dark:border-slate-700 p-4 shadow-[2px_2px_0px_#0f172a]"
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <ListOrdered className="size-3.5 text-primary" />
                    <span>Table of Contents</span>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {blogHeadings.map((h, i) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary">
                            0{i + 1}.
                          </span>
                          <span className="underline decoration-slate-300 dark:decoration-slate-600 group-hover:decoration-primary">
                            {h.text}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Body Content with Code Copy and Headings */}
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
                {selectedBlog.content.split("\n\n").map((paragraph, idx) => {
                  if (paragraph.startsWith("### ")) {
                    const headingText = paragraph.replace("### ", "").trim();
                    const headingMatch = blogHeadings.find((h) => h.text === headingText);
                    return (
                      <h3
                        key={idx}
                        id={headingMatch?.id}
                        className="mt-8 mb-2 scroll-mt-14 text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100"
                      >
                        {headingText}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("```")) {
                    const code = paragraph.replace(/```[a-z]*\n?/g, "");
                    const isCopied = copiedSnippetIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="my-5 overflow-hidden rounded-xl border-2 border-slate-900 bg-slate-950 shadow-[3px_3px_0px_#0f172a]"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-[11px] font-mono text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-rose-500" />
                            <span className="size-2.5 rounded-full bg-amber-500" />
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                            <span className="ml-2 text-slate-400">snippet.tsx</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(code);
                                setCopiedSnippetIdx(idx);
                                toast.success("Code snippet copied!");
                                setTimeout(() => setCopiedSnippetIdx(null), 2000);
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
                          >
                            {isCopied ? (
                              <>
                                <Check className="size-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-4 text-xs font-mono text-emerald-400 leading-relaxed">
                          <code>{code}</code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                {selectedBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Reaction, Claps & Multi-platform Share Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 dark:border-slate-800 py-3">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleClap(e, selectedBlog.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-200 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[1px_1px_0px_#0f172a] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>👏 Clap</span>
                    <span className="font-mono">({selectedBlog.claps || 0})</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(e, selectedBlog.id, "like")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-900 transition-colors shadow-xs"
                  >
                    <ThumbsUp className="size-3.5 text-blue-600" />
                    <span>Like ({selectedBlog.reactions?.like || selectedBlog.likes || 0})</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(e, selectedBlog.id, "love")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-900 transition-colors shadow-xs"
                  >
                    <Heart className="size-3.5 text-rose-600" />
                    <span>Love ({selectedBlog.reactions?.love || 0})</span>
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleShare(e, selectedBlog)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-900 shadow-xs"
                  >
                    <Copy className="size-3.5" />
                    <span>Copy Link</span>
                  </button>
                  <a
                    href={whatsappShareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 shadow-xs"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={linkedinShareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-500/50 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 shadow-xs"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={facebookShareLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/50 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 shadow-xs"
                  >
                    Facebook
                  </a>
                </div>
              </div>

              {/* Previous & Next Post Navigation */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-slate-200 dark:border-slate-800 pt-5">
                {prevBlogPost ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBlog(prevBlogPost)}
                    className="group flex flex-col text-left rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-[2px_2px_0px_#0f172a] hover:-translate-x-0.5 transition-transform"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground font-bold flex items-center gap-1 mb-1">
                      <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                      PREVIOUS ARTICLE
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-primary">
                      {prevBlogPost.title}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {nextBlogPost && (
                  <button
                    type="button"
                    onClick={() => handleOpenBlog(nextBlogPost)}
                    className="group flex flex-col text-right rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-[2px_2px_0px_#0f172a] hover:translate-x-0.5 transition-transform"
                  >
                    <span className="font-mono text-[10px] text-muted-foreground font-bold flex items-center justify-end gap-1 mb-1">
                      NEXT ARTICLE
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-primary">
                      {nextBlogPost.title}
                    </span>
                  </button>
                )}
              </div>

              {/* Related Posts Section */}
              {relatedBlogPosts.length > 0 && (
                <div className="mt-8 space-y-3 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Related Articles in {selectedBlog.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedBlogPosts.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => handleOpenBlog(rel)}
                        className="cursor-pointer rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all group"
                      >
                        <span className="rounded bg-amber-100 dark:bg-amber-950/60 dark:text-amber-200 px-1.5 py-0.5 font-mono text-[9px] font-bold">
                          {rel.category}
                        </span>
                        <h5 className="mt-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-primary">
                          {rel.title}
                        </h5>
                        <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Comments Section */}
              <div className="mt-8 space-y-6 border-t border-slate-200 dark:border-slate-800 pt-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  Discussion ({selectedBlog.comments?.filter((c) => c.approved !== false || isAdmin).length || 0})
                </h3>

                {/* Comment Input Form */}
                <form
                  onSubmit={handleAddComment}
                  className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3 shadow-[2px_2px_0px_#0f172a]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full sm:w-1/2 rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-[#faf8f5] dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share your perspective or ask Farhad a question..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    className="w-full rounded-lg border-2 border-slate-900 dark:border-slate-700 bg-[#faf8f5] dark:bg-slate-900 px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Send className="size-3.5" />
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>

                {/* Existing Comments List (Only approved or if admin) */}
                <div className="space-y-3">
                  {(!selectedBlog.comments ||
                    selectedBlog.comments.filter((c) => c.approved !== false || isAdmin).length === 0) ? (
                    <p className="text-xs text-slate-500 py-2 text-center">
                      No comments yet. Be the first to start the discussion!
                    </p>
                  ) : (
                    selectedBlog.comments
                      .filter((c) => c.approved !== false || isAdmin)
                      .map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-[#faf8f5] dark:bg-slate-800/80 p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="size-6 rounded-full bg-primary/20 text-primary text-[10px] font-bold grid place-items-center">
                                {comment.name.slice(0, 1).toUpperCase()}
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {comment.name}
                              </span>
                              {isAdmin && comment.approved === false && (
                                <span className="rounded bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5">
                                  Unapproved (hidden from visitors)
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 animate-in fade-in"
            onClick={() => setIsMsgModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border-2 border-slate-900 bg-[#fffefb] p-6 shadow-[6px_6px_0px_#0f172a] sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsMsgModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg border-2 border-slate-900 bg-white p-1.5 text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_#0f172a]"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                <img
                  src={profileConfig.avatar || profile.photo}
                  alt={profileConfig.name || profile.name}
                  className="size-12 rounded-full border-2 border-slate-900 object-cover shadow-[1px_1px_0px_#0f172a]"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-1">
                    Message {profileConfig.name || profile.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Direct message straight to Farhad's dashboard
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendDirectMessage} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    required
                    className="w-full rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Your Email (for reply)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={msgEmail}
                    onChange={(e) => setMsgEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message, collaboration proposal, or project inquiry..."
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    required
                    className="w-full rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_#0f172a] hover:bg-primary/90 disabled:opacity-50 transition-all"
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
