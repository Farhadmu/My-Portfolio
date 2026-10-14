import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  projects as defaultProjects,
  skillGroups as defaultSkillGroups,
  experience as defaultExperience,
  education as defaultEducation,
  services as defaultServices,
  testimonials as defaultTestimonials,
  certificates as defaultCertificates,
  blogPosts as defaultBlogPosts,
  aboutFocus,
  profile,
  type Project,
  type Level,
} from "@/data/portfolio";

export interface BlogComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  approved?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  videoUrl?: string;
  category: string;
  tags: string[];
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  readTime: string;
  likes: number;
  reactions?: {
    like: number;
    love: number;
    insightful: number;
    celebrate: number;
  };
  comments?: BlogComment[];
  featured?: boolean;
  published?: boolean;
  status?: "draft" | "published" | "scheduled";
  publishAt?: string;
  views?: number;
  claps?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  topic?: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
}

export type DynamicProject = Project & { id?: string };

export interface DynamicSkill {
  id?: string;
  category: string;
  name: string;
  level: Level;
  value: number;
  note: string;
  logo: string;
}

export interface DynamicExperience {
  id?: string;
  title: string;
  org: string;
  period: string;
  status: "active" | "completed";
  image?: string;
  tags: string[];
  body: string;
  highlight?: string;
  extra?: string;
  live?: string;
  github?: string;
}

export interface DynamicEducation {
  id?: string;
  year: string;
  title: string;
  org: string;
  body: string;
  tags: string[];
  highlight?: string;
  status: "active" | "done";
  kind: "Academic" | "Training";
}

export interface DynamicTestimonial {
  id?: string;
  name: string;
  role: string;
  quote: string;
  rating?: number;
}

export interface DynamicCertificate {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  icon?: string;
}

export interface CaseStudySpotlightConfig {
  slug: string;
  title?: string;
  tagline?: string;
  category?: string;
  problem?: string;
  approach?: string;
  deliverables?: string[];
  stack?: string[];
  image?: string;
  live?: string;
}

export interface UserProfileConfig {
  name: string;
  subRole: string;
  bio: string;
  avatar: string;
  coverImage: string;
  educationTag: string;
  architectureTag: string;
  activeTag: string;
}

export const DEFAULT_PROFILE_CONFIG: UserProfileConfig = {
  name: profile.name,
  subRole: "CSE @ BAIUST · Software Engineer & Systems Builder · Tech Writer",
  bio: "Writing deep-dives into Next.js 15, React Server Components, distributed architectures, C++ algorithmic complexity, and real-world production engineering.",
  avatar: profile.photo,
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
  educationTag: "🎓 Computer Science @ BAIUST",
  architectureTag: "⚡ Systems & Full-Stack Architecture",
  activeTag: "● Active Publications",
};

export type SectionBgStyle =
  | "bg-paper"
  | "bg-graph"
  | "bg-ruled"
  | "bg-dots"
  | "bg-hatch"
  | "bg-sticky"
  | "bg-blueprint"
  | "bg-dark-ink";

export interface SectionItemConfig {
  id: string;
  label: string;
  navLabel?: string;
  title?: string;
  desc?: string;
  eyebrow?: string;
  enabled: boolean;
  bgStyle: SectionBgStyle;
}

export interface HeroConfig {
  name: string;
  tagline: string;
  intro: string;
  badgeText: string;
  location: string;
  photoUrl?: string;
  resumeUrl?: string;
}

export interface AboutConfig {
  title: string;
  desc: string;
  bioHeading: string;
  bioText: string;
  focusPoints: string[];
}

export interface HomeSectionsConfig {
  sections: SectionItemConfig[];
  hero: HeroConfig;
  about: AboutConfig;
}

export interface AchievementItem {
  id: string;
  title: string;
  shortMessage: string;
  type: "Competition" | "Certificate" | "Award" | "Other";
  iconType?: "trophy" | "certificate" | "medal" | "star";
  stampText?: string;
  image?: string;
  date: string;
  issuer: string;
  details: string;
  link?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface AchievementSettings {
  enabled: boolean;
  durationSeconds: number;
  startDelaySeconds: number;
  soundEnabled?: boolean;
}

export const DEFAULT_HOME_SECTIONS_CONFIG: HomeSectionsConfig = {
  sections: [
    { id: "hero", label: "Hero Banner", navLabel: "Home", enabled: true, bgStyle: "bg-paper" },
    { id: "about", label: "About Me", navLabel: "About", title: "Who's Behind the Systems?", desc: "Software Engineer specializing in scalable full-stack architectures, low-latency interfaces, and algorithmic problem solving.", eyebrow: "ABOUT ME & PHILOSOPHY", enabled: true, bgStyle: "bg-graph" },
    { id: "skills", label: "Skills & Tech", navLabel: "Skills", title: "Technical Stack & Craft", desc: "Core languages, frameworks, databases and system utilities I deploy in production.", eyebrow: "SKILLS & ARSENAL", enabled: true, bgStyle: "bg-ruled" },
    { id: "projects", label: "Projects", navLabel: "Projects", title: "Shipped Software & Applications", desc: "Real-world web apps, market solutions and full-stack platforms with live deployments.", eyebrow: "FEATURED WORK", enabled: true, bgStyle: "bg-dots" },
    { id: "education", label: "Education", navLabel: "Education", title: "Academic & Professional Foundations", desc: "University degree, intensive technical bootcamps, and foundational milestones.", eyebrow: "EDUCATION & TRAINING", enabled: true, bgStyle: "bg-sticky" },
    { id: "experience", label: "Experience & Hackathons", navLabel: "Experience", title: "Hackathons, Internships & Milestones", desc: "High-pressure competitive hackathons and hands-on front-end AI engineering experience.", eyebrow: "TRACK RECORD", enabled: true, bgStyle: "bg-blueprint" },
    { id: "credibility", label: "Credibility & Proof", navLabel: "Credibility", title: "Verified Credentials & Recommendations", desc: "Case study breakdown, mentor recommendations and verified honors.", eyebrow: "PROOF OF WORK", enabled: true, bgStyle: "bg-paper" },
    { id: "github", label: "GitHub Dashboard", navLabel: "GitHub", title: "Open Source Activity & Metrics", desc: "Public repositories, commit streaks, contribution volume and language distribution.", eyebrow: "ACTIVITY & STATS", enabled: true, bgStyle: "bg-dark-ink" },
    { id: "activity", label: "Live Activity", navLabel: "Activity", title: "Currently Building & Recent Logs", desc: "What's in my active local pipeline and latest engineering writeups.", eyebrow: "DISPATCHES", enabled: true, bgStyle: "bg-dots" },
    { id: "services", label: "Services & Capabilities", navLabel: "Services", title: "Software Engineering Capabilities", desc: "From robust backend APIs and scalable architectures to clean, responsive user interfaces.", eyebrow: "WHAT I DO", enabled: true, bgStyle: "bg-hatch" },
    { id: "guestbook", label: "Guestbook Wall", navLabel: "Guestbook", title: "Visitor Guestbook Wall", desc: "Leave a digital trace, say hello, or share quick feedback.", eyebrow: "COMMUNITY", enabled: true, bgStyle: "bg-ruled" },
    { id: "contact", label: "Contact", navLabel: "Contact", title: "Let's Build Something Together", desc: "Have a project in mind, an internship opening, or just want to discuss software? Drop a line.", eyebrow: "GET IN TOUCH", enabled: true, bgStyle: "bg-paper" },
  ],
  hero: {
    name: profile.name,
    tagline: profile.tagline,
    intro: profile.intro,
    badgeText: "✦ AVAILABLE FOR HIRE & COLLABORATION",
    location: profile.location,
    photoUrl: profile.photo,
    resumeUrl: profile.resume,
  },
  about: {
    title: "Who's Behind the Systems?",
    desc: "Software Engineer specializing in scalable full-stack architectures, low-latency interfaces, and algorithmic problem solving.",
    bioHeading: "Hi, I'm Farhadul Islam",
    bioText: "CSE undergraduate at BAIUST building modern, performant and accessible web products. I turn ideas into shipped interfaces — clean code, real deployments, measurable results.",
    focusPoints: aboutFocus || [
      "Exploring Next.js & modern React patterns",
      "Practicing Competitive Programming with C++",
      "Strengthening Advanced JavaScript, React & DSA",
      "Goal: Become a Full Stack Developer",
      "Daily driving Garuda Linux as primary OS",
    ],
  },
};

export const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "ach-1",
    title: "SUST CSE Carnival 2026 — 6th Place",
    shortMessage: "6th place out of 700+ teams in 24-hr onsite national hackathon!",
    type: "Competition",
    iconType: "trophy",
    stampText: "6th PLACE!",
    image: "",
    date: "Jul 2026",
    issuer: "Shahjalal University of Science & Technology",
    details: "Cleared the preliminary round among 700+ registered teams to reach top 50, survived a 24-hour onsite hackathon to advance into final 15, and placed 6th overall with 'Super Agent Liquidity Risk Intelligence' presented by bKash.",
    link: "https://super-agent-liquidity-risk-intelligence-mdrk.onrender.com",
    enabled: true,
    sortOrder: 1,
  },
  {
    id: "ach-2",
    title: "AI-Complete Web Development — Level 1",
    shortMessage: "Ranked in Top 300 of 5000+ students · EJP & SCIC placement",
    type: "Certificate",
    iconType: "medal",
    stampText: "TOP 300",
    image: "",
    date: "2025",
    issuer: "Programming Hero, Batch 13",
    details: "Intensive full-stack bootcamp covering HTML, CSS, JavaScript, React, Node.js, MongoDB and Firebase. Ranked in the Top 300 out of 5000+ students, earning Elite Junior Program (EJP) placement.",
    link: "",
    enabled: true,
    sortOrder: 2,
  },
  {
    id: "ach-3",
    title: "AI-Driven Software Engineer Bootcamp — Level 2",
    shortMessage: "Advanced backend engineering, system design & DevOps",
    type: "Certificate",
    iconType: "certificate",
    stampText: "VERIFIED",
    image: "",
    date: "2026 (Running)",
    issuer: "Programming Hero, Batch 7",
    details: "Advanced backend-focused bootcamp covering system design, advanced Node.js, relational modeling with PostgreSQL, Docker containerization, and modern AI engineering.",
    link: "",
    enabled: true,
    sortOrder: 3,
  },
  {
    id: "ach-4",
    title: "SUST CSE Carnival 2026 — 6th Place Honor",
    shortMessage: "National hackathon award for fintech AI risk intelligence",
    type: "Award",
    iconType: "trophy",
    stampText: "FINALIST",
    image: "",
    date: "2026",
    issuer: "Shahjalal University of Science & Technology",
    details: "Official certificate of achievement from SUST CSE Department and bKash for placing 6th among 700+ registered teams in Bangladesh.",
    link: "",
    enabled: true,
    sortOrder: 4,
  },
  {
    id: "ach-5",
    title: "Front-End AI Engineering Internship",
    shortMessage: "Front-End AI-assisted web engineering & responsive UI systems",
    type: "Certificate",
    iconType: "star",
    stampText: "COMPLETED",
    image: "",
    date: "2026",
    issuer: "FlyRank AI",
    details: "Self-paced remote internship building responsive, mobile-optimized websites and ecommerce components with clean Tailwind execution and AI-assisted workflows.",
    link: "",
    enabled: true,
    sortOrder: 5,
  },
];

export const DEFAULT_ACHIEVEMENT_SETTINGS: AchievementSettings = {
  enabled: true,
  durationSeconds: 6,
  startDelaySeconds: 2.5,
  soundEnabled: false,
};

// Check for Supabase env credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial blog seed converted from default blogPosts
const initialBlogs: BlogPost[] = [
  {
    id: "blog-1",
    slug: "storing-jwts-in-cookies-for-nextjs-middleware-auth",
    title: "Storing JWTs in cookies for Next.js middleware auth",
    excerpt:
      "How I wired role-based route protection so both client components and middleware.ts can read the same session securely.",
    content: `When building **FixItNow**, a multi-role home service marketplace, one of the trickiest architectural hurdles was handling authentication across both client-side interactive components and server-side Edge Middleware.

### The Problem
If you store JWT tokens in \`localStorage\`, Next.js middleware running on the server Edge cannot access them during incoming requests. This makes instant server redirects and route guarding nearly impossible without layout flashes.

### The Solution: HTTP-Only Cookies
By setting the JWT in an \`HTTPOnly\`, \`SameSite=Lax\` cookie:
1. **Next.js Middleware** reads \`request.cookies.get('token')\` synchronously before rendering.
2. **Client Components** can verify login status via a lightweight lightweight session endpoint.
3. **Protection against XSS**: Malicious third-party scripts cannot dump your token from localStorage.

\`\`\`typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = decodeTokenRole(token);

  if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
\`\`\`

This pattern completely eliminated flashes of unauthorized content and kept our routing rock solid!`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
    category: "Full Stack",
    tags: ["Next.js", "JWT", "Security", "Middleware"],
    authorName: profile.name,
    authorRole: profile.subRole,
    authorAvatar: profile.photo,
    readTime: "4 min read",
    likes: 42,
    featured: true,
    published: true,
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "blog-2",
    slug: "a-booking-status-state-machine-that-drives-the-whole-ui",
    title: "A booking-status state machine that drives the whole UI",
    excerpt:
      "Using one status enum to power action buttons, progress steppers and dashboards across customer, technician and admin roles.",
    content: `State bugs often plague marketplace and delivery applications. A customer cancels an order, but the technician's screen still shows "Accept", or a payment succeeds but the UI fails to transition.

### Modeling with Finite State Machines (FSM)
Instead of scattered boolean flags like \`isAccepted\`, \`isPaid\`, \`isCompleted\`, we formalized the entire lifecycle into explicit transitions:

- \`REQUESTED\` ➔ \`ACCEPTED\` ➔ \`PAID\` ➔ \`IN_PROGRESS\` ➔ \`COMPLETED\`
- Cancellation allowed only from \`REQUESTED\` or \`ACCEPTED\`.

\`\`\`typescript
export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  REQUESTED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PAID", "CANCELLED"],
  PAID: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};
\`\`\`

### UI Benefits
1. The progress stepper simply maps over the enum index.
2. Buttons are disabled declaratively based on \`ALLOWED_TRANSITIONS[currentStatus]\`.
3. Zero illegal states possible.`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    category: "Architecture",
    tags: ["State Machine", "React", "TypeScript", "Clean Code"],
    authorName: profile.name,
    authorRole: profile.subRole,
    authorAvatar: profile.photo,
    readTime: "5 min read",
    likes: 38,
    featured: true,
    published: true,
    createdAt: "2026-07-28T14:30:00.000Z",
  },
  {
    id: "blog-3",
    slug: "lazy-loading-threejs-hero-without-layout-jump",
    title: "Lazy-loading a Three.js hero without a layout jump",
    excerpt:
      "Falling back to a pure-CSS glowing orb while the WebGL scene streams in on wide screens with 60fps performance.",
    content: `3D WebGL visuals look incredible on a developer portfolio, but bundled Three.js and heavy 3D assets can drag down Lighthouse performance and cause jarring layout shifts (CLS).

### The Dual-Layer Architecture
Here is how we solved this for Farhad's portfolio:
1. **The Placeholder**: A pure CSS radial-gradient mesh and blur backdrop renders on initial HTML load with 0ms delay.
2. **Dynamic Import**: Three.js Canvas is imported lazily only when the browser window is wider than 1024px and network idle.
3. **Crossfade**: Once WebGL renders the first frame, we fade the Three.js canvas in smoothly using CSS \`transition: opacity 0.7s ease\`.

This ensures 95+ Mobile performance score while delivering a jaw-dropping visual experience on desktop!`,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    category: "Performance",
    tags: ["Three.js", "WebGL", "Performance", "CSS"],
    authorName: profile.name,
    authorRole: profile.subRole,
    authorAvatar: profile.photo,
    readTime: "3 min read",
    likes: 56,
    featured: false,
    published: true,
    createdAt: "2026-06-20T09:15:00.000Z",
  },
];

// Local Storage Keys
const STORAGE_KEYS = {
  BLOGS: "farhad_portfolio_blogs",
  PROJECTS: "farhad_portfolio_projects",
  SKILLS: "farhad_portfolio_skills",
  EXPERIENCE: "farhad_portfolio_experience",
  EDUCATION: "farhad_portfolio_education",
  SERVICES: "farhad_portfolio_services",
  MESSAGES: "farhad_portfolio_messages",
  PASSCODE: "farhad_admin_passcode",
  SPOTLIGHT: "farhad_portfolio_spotlight_project",
  SPOTLIGHT_CONFIG: "farhad_portfolio_spotlight_config",
  TESTIMONIALS: "farhad_portfolio_testimonials",
  CERTIFICATES: "farhad_portfolio_certificates",
  PROFILE_CONFIG: "farhad_portfolio_profile_config",
  HOME_SECTIONS: "farhad_portfolio_home_sections",
  ACHIEVEMENTS: "farhad_portfolio_achievements",
  ACHIEVEMENT_SETTINGS: "farhad_portfolio_achievement_settings",
};

// Dispatch helper to trigger reactivity across all subscribed components
export const triggerDataUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_data_changed"));
  }
};

// In-memory cache fallback in case of storage quota restrictions
let memoryProfileCache: UserProfileConfig | null = null;

// Helper to downscale large base64 data URLs to prevent browser localStorage quota exceeded errors
export const ensureCompactImage = async (
  src: string,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.85
): Promise<string> => {
  if (!src || !src.startsWith("data:image/")) return src;
  if (typeof window === "undefined" || typeof document === "undefined") return src;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
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
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    } catch {
      resolve(src);
    }
  });
};

// Profile & Cover Customization Management
export const getProfileConfig = (): UserProfileConfig => {
  if (typeof window === "undefined") return DEFAULT_PROFILE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...DEFAULT_PROFILE_CONFIG, ...parsed };
      memoryProfileCache = merged;
      return merged;
    }
  } catch (e) {
    console.error("Failed to parse profile config from localStorage:", e);
  }
  return memoryProfileCache || DEFAULT_PROFILE_CONFIG;
};

export const saveProfileConfigAsync = async (config: Partial<UserProfileConfig>): Promise<UserProfileConfig> => {
  if (typeof window !== "undefined") {
    let finalAvatar = config.avatar;
    let finalCover = config.coverImage;

    // Automatically optimize base64 images to avoid browser quota overflow (~25KB avatar, ~80KB cover)
    if (finalAvatar && finalAvatar.startsWith("data:image/")) {
      finalAvatar = await ensureCompactImage(finalAvatar, 360, 360, 0.85);
    }
    if (finalCover && finalCover.startsWith("data:image/")) {
      finalCover = await ensureCompactImage(finalCover, 1440, 700, 0.82);
    }

    const current = getProfileConfig();
    const merged: UserProfileConfig = {
      ...current,
      ...config,
      ...(finalAvatar !== undefined ? { avatar: finalAvatar } : {}),
      ...(finalCover !== undefined ? { coverImage: finalCover } : {}),
    };

    memoryProfileCache = merged;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_CONFIG, JSON.stringify(merged));
    } catch (err) {
      console.warn("Retrying storage write with ultra-compression:", err);
      try {
        if (merged.avatar?.startsWith("data:image/")) {
          merged.avatar = await ensureCompactImage(merged.avatar, 200, 200, 0.7);
        }
        if (merged.coverImage?.startsWith("data:image/")) {
          merged.coverImage = await ensureCompactImage(merged.coverImage, 900, 450, 0.7);
        }
        localStorage.setItem(STORAGE_KEYS.PROFILE_CONFIG, JSON.stringify(merged));
      } catch (innerErr) {
        console.error("Failed to write to localStorage even after compression:", innerErr);
      }
    }

    triggerDataUpdate();
    return merged;
  }
  return { ...DEFAULT_PROFILE_CONFIG, ...config };
};

export const saveProfileConfig = (config: Partial<UserProfileConfig>): UserProfileConfig => {
  if (typeof window !== "undefined") {
    const current = getProfileConfig();
    const merged: UserProfileConfig = { ...current, ...config };
    memoryProfileCache = merged;
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_CONFIG, JSON.stringify(merged));
    } catch (err) {
      console.warn("Storage quota warning when saving profile config:", err);
    }
    triggerDataUpdate();
    return merged;
  }
  return { ...DEFAULT_PROFILE_CONFIG, ...config };
};

export const resetProfileConfig = (): UserProfileConfig => {
  memoryProfileCache = DEFAULT_PROFILE_CONFIG;
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.PROFILE_CONFIG);
    triggerDataUpdate();
  }
  return DEFAULT_PROFILE_CONFIG;
};

// Case Study Spotlight Project Management
export const getSpotlightSlug = (): string => {
  if (typeof window === "undefined") return "fixitnow";
  return localStorage.getItem(STORAGE_KEYS.SPOTLIGHT) || "fixitnow";
};

export const getSpotlightConfig = (): CaseStudySpotlightConfig => {
  if (typeof window === "undefined") return { slug: "fixitnow" };
  const raw = localStorage.getItem(STORAGE_KEYS.SPOTLIGHT_CONFIG);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  return { slug: getSpotlightSlug() };
};

export const saveSpotlightConfig = (config: CaseStudySpotlightConfig): CaseStudySpotlightConfig => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SPOTLIGHT_CONFIG, JSON.stringify(config));
    if (config.slug) {
      localStorage.setItem(STORAGE_KEYS.SPOTLIGHT, config.slug);
    }
    triggerDataUpdate();
  }
  return config;
};

export const setSpotlightSlug = (slug: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SPOTLIGHT, slug);
    const curr = getSpotlightConfig();
    saveSpotlightConfig({ ...curr, slug });
    triggerDataUpdate();
  }
};

// Passcode management (Default: farhad2026)
export const getAdminPasscode = (): string => {
  if (typeof window === "undefined") return "farhad2026";
  return localStorage.getItem(STORAGE_KEYS.PASSCODE) || "farhad2026";
};

export const setAdminPasscode = (newPasscode: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PASSCODE, newPasscode);
  }
};

// ==========================================
// 1. BLOGS API
// ==========================================
export const getBlogs = async (): Promise<BlogPost[]> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          coverImage: b.cover_image,
          videoUrl: b.video_url,
          category: b.category,
          tags: b.tags || [],
          authorName: b.author_name || profile.name,
          authorRole: b.author_role || profile.subRole,
          authorAvatar: b.author_avatar || profile.photo,
          readTime: b.read_time || "3 min read",
          likes: b.likes || 0,
          reactions: b.reactions,
          comments: b.comments || [],
          featured: b.featured,
          published: b.published ?? true,
          createdAt: b.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch blogs failed, falling back to local:", e);
    }
  }

  // Fallback to local storage
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOGS);
    if (raw) {
      try {
        const parsed: BlogPost[] = JSON.parse(raw);
        if (parsed.length > 0 && parsed[0].id === "blog-1" && !parsed[0].videoUrl) {
          parsed[0].videoUrl = "https://www.youtube.com/watch?v=wm5gMKuwSYk";
          localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Initialize with defaults if empty
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(initialBlogs));
  }
  return initialBlogs;
};

export const saveBlog = async (
  blog: Omit<BlogPost, "id" | "createdAt" | "likes"> & { id?: string; likes?: number }
): Promise<BlogPost> => {
  const currentBlogs = await getBlogs();
  const id = blog.id || `blog-${Date.now()}`;
  const now = new Date().toISOString();
  const existing = currentBlogs.find((b) => b.id === id);

  const fullBlog: BlogPost = {
    id,
    slug:
      blog.slug ||
      blog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage,
    videoUrl: blog.videoUrl,
    category: blog.category || "Tech",
    tags: blog.tags || [],
    authorName: blog.authorName || profile.name,
    authorRole: blog.authorRole || profile.subRole,
    authorAvatar: blog.authorAvatar || profile.photo,
    readTime:
      blog.readTime ||
      `${Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 180))} min read`,
    likes: existing ? existing.likes : blog.likes || 0,
    reactions: existing?.reactions,
    comments: existing?.comments || [],
    featured: blog.featured ?? false,
    published: blog.published ?? true,
    status: blog.status || existing?.status || "published",
    publishAt: blog.publishAt || existing?.publishAt,
    views: existing?.views ?? blog.views ?? 0,
    claps: existing?.claps ?? blog.claps ?? 0,
    metaTitle: blog.metaTitle || existing?.metaTitle || blog.title,
    metaDescription: blog.metaDescription || existing?.metaDescription || blog.excerpt,
    createdAt: existing ? existing.createdAt : now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("blogs").upsert({
        id: fullBlog.id.includes("-") ? undefined : fullBlog.id,
        slug: fullBlog.slug,
        title: fullBlog.title,
        excerpt: fullBlog.excerpt,
        content: fullBlog.content,
        cover_image: fullBlog.coverImage,
        video_url: fullBlog.videoUrl,
        category: fullBlog.category,
        tags: fullBlog.tags,
        author_name: fullBlog.authorName,
        author_role: fullBlog.authorRole,
        author_avatar: fullBlog.authorAvatar,
        read_time: fullBlog.readTime,
        likes: fullBlog.likes,
        featured: fullBlog.featured,
        published: fullBlog.published,
      });
    } catch (err) {
      console.warn("Supabase upsert error:", err);
    }
  }

  // Update local cache
  const updated = existing
    ? currentBlogs.map((b) => (b.id === id ? fullBlog : b))
    : [fullBlog, ...currentBlogs];

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }

  triggerDataUpdate();
  return fullBlog;
};

export const deleteBlog = async (id: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("blogs").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete blog error:", err);
    }
  }

  const currentBlogs = await getBlogs();
  const updated = currentBlogs.filter((b) => b.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
};

export const likeBlogPost = async (id: string): Promise<number> => {
  const currentBlogs = await getBlogs();
  let newLikes = 0;
  const updated = currentBlogs.map((b) => {
    if (b.id === id) {
      newLikes = (b.likes || 0) + 1;
      return { ...b, likes: newLikes };
    }
    return b;
  });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("blogs").update({ likes: newLikes }).eq("id", id);
    } catch (err) {
      console.warn("Supabase like blog error:", err);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return newLikes;
};

export const reactToBlogPost = async (
  id: string,
  reaction: "like" | "love" | "insightful" | "celebrate"
): Promise<BlogPost["reactions"]> => {
  const currentBlogs = await getBlogs();
  let updatedReactions: BlogPost["reactions"] = { like: 0, love: 0, insightful: 0, celebrate: 0 };

  const updated = currentBlogs.map((b) => {
    if (b.id === id) {
      const current = b.reactions || { like: b.likes || 0, love: 0, insightful: 0, celebrate: 0 };
      const next = {
        ...current,
        [reaction]: (current[reaction] || 0) + 1,
      };
      updatedReactions = next;
      return {
        ...b,
        reactions: next,
        likes: (b.likes || 0) + 1,
      };
    }
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updatedReactions;
};

export const addCommentToBlogPost = async (
  id: string,
  comment: { name: string; text: string }
): Promise<BlogComment[]> => {
  const currentBlogs = await getBlogs();
  const newComment: BlogComment = {
    id: `comment-${Date.now()}`,
    name: comment.name.trim() || "Visitor",
    text: comment.text.trim(),
    createdAt: new Date().toISOString(),
  };

  let updatedComments: BlogComment[] = [];

  const updated = currentBlogs.map((b) => {
    if (b.id === id) {
      const existing = b.comments || [];
      updatedComments = [...existing, newComment];
      return {
        ...b,
        comments: updatedComments,
      };
    }
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updatedComments;
};

export const incrementBlogViews = async (id: string): Promise<number> => {
  const currentBlogs = await getBlogs();
  let newViews = 1;
  const updated = currentBlogs.map((b) => {
    if (b.id === id) {
      newViews = (b.views || 0) + 1;
      return { ...b, views: newViews };
    }
    return b;
  });

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("blogs").update({ views: newViews }).eq("id", id);
    } catch (err) {
      console.warn("Supabase view increment error:", err);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return newViews;
};

export const clapForBlogPost = async (id: string): Promise<number> => {
  const currentBlogs = await getBlogs();
  let newClaps = 1;
  const updated = currentBlogs.map((b) => {
    if (b.id === id) {
      newClaps = (b.claps || 0) + 1;
      return { ...b, claps: newClaps };
    }
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return newClaps;
};

export const toggleCommentApproval = async (
  blogId: string,
  commentId: string
): Promise<BlogComment[]> => {
  const currentBlogs = await getBlogs();
  let updatedComments: BlogComment[] = [];
  const updated = currentBlogs.map((b) => {
    if (b.id === blogId) {
      const existing = b.comments || [];
      updatedComments = existing.map((c) =>
        c.id === commentId ? { ...c, approved: c.approved === false ? true : false } : c
      );
      return { ...b, comments: updatedComments };
    }
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updatedComments;
};

// ==========================================
// DIRECT MESSAGES (Visitor to Farhad)
// ==========================================
export const getDirectMessages = async (): Promise<DirectMessage[]> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return [];
};

export const sendDirectMessage = async (msg: {
  name: string;
  email: string;
  message: string;
  topic?: string;
}): Promise<DirectMessage> => {
  const messages = await getDirectMessages();
  const newMsg: DirectMessage = {
    id: `msg-${Date.now()}`,
    name: msg.name.trim(),
    email: msg.email.trim(),
    message: msg.message.trim(),
    topic: msg.topic?.trim() || "General Inquiry",
    createdAt: new Date().toISOString(),
    read: false,
  };

  const updated = [newMsg, ...messages];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return newMsg;
};

export const markMessageRead = async (id: string): Promise<DirectMessage[]> => {
  const messages = await getDirectMessages();
  const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updated;
};

export const markMessageReplied = async (id: string): Promise<DirectMessage[]> => {
  const messages = await getDirectMessages();
  const updated = messages.map((m) => (m.id === id ? { ...m, read: true, replied: true } : m));
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updated;
};

export const deleteDirectMessage = async (id: string): Promise<DirectMessage[]> => {
  const messages = await getDirectMessages();
  const updated = messages.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updated;
};

// ==========================================
// 2. PROJECTS API
// ==========================================
export const getProjects = async (): Promise<DynamicProject[]> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects));
  }
  return defaultProjects;
};

export const saveProject = async (project: DynamicProject): Promise<DynamicProject[]> => {
  const list = await getProjects();
  const id = project.slug;
  const exists = list.some((p) => p.slug === id);
  const updated = exists
    ? list.map((p) => (p.slug === id ? { ...project } : p))
    : [project, ...list];

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updated;
};

export const deleteProject = async (slug: string): Promise<DynamicProject[]> => {
  const list = await getProjects();
  const updated = list.filter((p) => p.slug !== slug);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
  }
  triggerDataUpdate();
  return updated;
};

// ==========================================
// 3. SKILLS API
// ==========================================
export const getSkillGroups = async () => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(defaultSkillGroups));
  }
  return defaultSkillGroups;
};

export const saveSkillGroups = async (groups: typeof defaultSkillGroups) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(groups));
  }
  triggerDataUpdate();
  return groups;
};

// ==========================================
// 4. EXPERIENCE API
// ==========================================
export const getExperiences = async (): Promise<typeof defaultExperience> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(defaultExperience));
  }
  return defaultExperience;
};

export const saveExperience = async (list: typeof defaultExperience) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(list));
  }
  triggerDataUpdate();
  return list;
};

// ==========================================
// 5. EDUCATION API
// ==========================================
export const getEducations = async (): Promise<typeof defaultEducation> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.EDUCATION);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(defaultEducation));
  }
  return defaultEducation;
};

export const saveEducation = async (list: typeof defaultEducation) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(list));
  }
  triggerDataUpdate();
  return list;
};

// ==========================================
// 6. SERVICES API
// ==========================================
export const getServices = async (): Promise<typeof defaultServices> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
  }
  return defaultServices;
};

export const saveServices = async (list: typeof defaultServices) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
  }
  triggerDataUpdate();
  return list;
};

// ==========================================
// 7. TESTIMONIALS / RECOMMENDATIONS API
// ==========================================
export const getTestimonials = async (): Promise<DynamicTestimonial[]> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    const initial = defaultTestimonials.map((t, idx) => ({
      id: `testi-${idx + 1}`,
      name: t.name,
      role: t.role,
      quote: t.quote,
      rating: 5,
    }));
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(initial));
    return initial;
  }
  return defaultTestimonials.map((t, idx) => ({
    id: `testi-${idx + 1}`,
    name: t.name,
    role: t.role,
    quote: t.quote,
    rating: 5,
  }));
};

export const saveTestimonials = async (list: DynamicTestimonial[]): Promise<DynamicTestimonial[]> => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(list));
    triggerDataUpdate();
  }
  return list;
};

export const saveTestimonial = async (item: DynamicTestimonial): Promise<DynamicTestimonial[]> => {
  const current = await getTestimonials();
  const id = item.id || `testi-${Date.now()}`;
  const exists = current.some((t) => (t.id ? t.id === id : t.name === item.name));
  const updated = exists
    ? current.map((t) => (t.id === id || (!t.id && t.name === item.name) ? { ...item, id } : t))
    : [{ ...item, id }, ...current];
  return saveTestimonials(updated);
};

export const deleteTestimonial = async (id: string): Promise<DynamicTestimonial[]> => {
  const current = await getTestimonials();
  const updated = current.filter((t) => t.id !== id && t.name !== id);
  return saveTestimonials(updated);
};

// ==========================================
// 8. CERTIFICATES / HONORS API
// ==========================================
export const getCertificates = async (): Promise<DynamicCertificate[]> => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    const initial = defaultCertificates.map((c, idx) => ({
      id: `cert-${idx + 1}`,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      icon: c.icon,
    }));
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(initial));
    return initial;
  }
  return defaultCertificates.map((c, idx) => ({
    id: `cert-${idx + 1}`,
    title: c.title,
    issuer: c.issuer,
    date: c.date,
    icon: c.icon,
  }));
};

export const saveCertificates = async (list: DynamicCertificate[]): Promise<DynamicCertificate[]> => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));
    triggerDataUpdate();
  }
  return list;
};

export const saveCertificate = async (item: DynamicCertificate): Promise<DynamicCertificate[]> => {
  const current = await getCertificates();
  const id = item.id || `cert-${Date.now()}`;
  const exists = current.some((c) => (c.id ? c.id === id : c.title === item.title));
  const updated = exists
    ? current.map((c) => (c.id === id || (!c.id && c.title === item.title) ? { ...item, id } : c))
    : [{ ...item, id }, ...current];
  return saveCertificates(updated);
};

export const deleteCertificate = async (id: string): Promise<DynamicCertificate[]> => {
  const current = await getCertificates();
  const updated = current.filter((c) => c.id !== id && c.title !== id);
  return saveCertificates(updated);
};

// ==========================================
// GUESTBOOK / ENDORSEMENTS
// ==========================================
export interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  message: string;
  avatarColor: string;
  createdAt: string;
  verified?: boolean;
}

const defaultGuestbookEntries: GuestbookEntry[] = [
  {
    id: "gb-1",
    name: "Dr. A. Rahman",
    role: "Faculty Advisor, CSE Department",
    message: "Farhad demonstrates exceptional passion for software engineering, system design, and algorithmic problem solving. Keep up the high standard!",
    avatarColor: "#06b6d4",
    createdAt: "2026-03-10",
    verified: true,
  },
  {
    id: "gb-2",
    name: "Tanvir Ahmed",
    role: "Hackathon Teammate @ SUST Carnival",
    message: "Working with Farhad on competitive coding and full-stack projects is always inspiring. Clean modular code and solid execution under pressure!",
    avatarColor: "#8b5cf6",
    createdAt: "2026-04-18",
    verified: true,
  },
  {
    id: "gb-3",
    name: "Sarah Jenkins",
    role: "Open Source Contributor",
    message: "Reviewed Farhad's Next.js and TypeScript repositories — remarkably clean component boundaries and documentation.",
    avatarColor: "#10b981",
    createdAt: "2026-06-02",
    verified: true,
  },
];

const GUESTBOOK_STORAGE_KEY = "farhad_portfolio_guestbook";

export const getGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  if (typeof window === "undefined") return defaultGuestbookEntries;
  try {
    const raw = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(defaultGuestbookEntries));
      return defaultGuestbookEntries;
    }
    return JSON.parse(raw);
  } catch {
    return defaultGuestbookEntries;
  }
};

export const addGuestbookEntry = async (entry: Omit<GuestbookEntry, "id" | "createdAt">): Promise<GuestbookEntry[]> => {
  const current = await getGuestbookEntries();
  const newEntry: GuestbookEntry = {
    ...entry,
    id: `gb-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    verified: false,
  };
  const updated = [newEntry, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updated));
    triggerDataUpdate();
  }
  return updated;
};

export const deleteGuestbookEntry = async (id: string): Promise<GuestbookEntry[]> => {
  const current = await getGuestbookEntries();
  const updated = current.filter((e) => e.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updated));
    triggerDataUpdate();
  }
  return updated;
};

// ==========================================
// 10. HOME SECTIONS CONFIGURATION API
// ==========================================
let memoryHomeSectionsCache: HomeSectionsConfig | null = null;

export const getHomeSectionsConfig = (): HomeSectionsConfig => {
  if (typeof window === "undefined") return DEFAULT_HOME_SECTIONS_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOME_SECTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged: HomeSectionsConfig = {
        ...DEFAULT_HOME_SECTIONS_CONFIG,
        ...parsed,
        hero: { ...DEFAULT_HOME_SECTIONS_CONFIG.hero, ...(parsed.hero || {}) },
        about: { ...DEFAULT_HOME_SECTIONS_CONFIG.about, ...(parsed.about || {}) },
      };
      // Keep sections list synced with default sections if any are missing
      const existingIds = new Set(merged.sections.map((s) => s.id));
      for (const defSec of DEFAULT_HOME_SECTIONS_CONFIG.sections) {
        if (!existingIds.has(defSec.id)) {
          merged.sections.push(defSec);
        }
      }
      memoryHomeSectionsCache = merged;
      return merged;
    }
  } catch (e) {
    console.error("Failed to parse home sections config:", e);
  }
  return memoryHomeSectionsCache || DEFAULT_HOME_SECTIONS_CONFIG;
};

export const saveHomeSectionsConfig = (config: HomeSectionsConfig): HomeSectionsConfig => {
  if (typeof window !== "undefined") {
    memoryHomeSectionsCache = config;
    localStorage.setItem(STORAGE_KEYS.HOME_SECTIONS, JSON.stringify(config));
    triggerDataUpdate();
  }
  return config;
};

export const resetHomeSectionsConfig = (): HomeSectionsConfig => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.HOME_SECTIONS);
    memoryHomeSectionsCache = DEFAULT_HOME_SECTIONS_CONFIG;
    triggerDataUpdate();
  }
  return DEFAULT_HOME_SECTIONS_CONFIG;
};

// ==========================================
// 11. ACHIEVEMENT POPUPS API
// ==========================================
let memoryAchievementsCache: AchievementItem[] | null = null;

export const getAchievements = async (): Promise<AchievementItem[]> => {
  if (typeof window === "undefined") return DEFAULT_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryAchievementsCache = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load achievements from storage:", e);
  }
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
  memoryAchievementsCache = DEFAULT_ACHIEVEMENTS;
  return DEFAULT_ACHIEVEMENTS;
};

export const saveAchievements = async (items: AchievementItem[]): Promise<AchievementItem[]> => {
  if (typeof window !== "undefined") {
    memoryAchievementsCache = items;
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(items));
    triggerDataUpdate();
  }
  return items;
};

export const saveAchievement = async (item: AchievementItem): Promise<AchievementItem[]> => {
  const current = await getAchievements();
  let finalImage = item.image;
  if (finalImage && finalImage.startsWith("data:image/")) {
    finalImage = await ensureCompactImage(finalImage, 600, 600, 0.85);
  }

  const id = item.id || `ach-${Date.now()}`;
  const processedItem: AchievementItem = { ...item, id, image: finalImage };
  const exists = current.some((a) => a.id === id);
  const updated = exists
    ? current.map((a) => (a.id === id ? processedItem : a))
    : [...current, processedItem];

  return saveAchievements(updated);
};

export const deleteAchievement = async (id: string): Promise<AchievementItem[]> => {
  const current = await getAchievements();
  const updated = current.filter((a) => a.id !== id);
  return saveAchievements(updated);
};

export const reorderAchievements = async (items: AchievementItem[]): Promise<AchievementItem[]> => {
  const reindexed = items.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
  return saveAchievements(reindexed);
};

let memoryAchievementSettingsCache: AchievementSettings | null = null;

export const getAchievementSettings = (): AchievementSettings => {
  if (typeof window === "undefined") return DEFAULT_ACHIEVEMENT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENT_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...DEFAULT_ACHIEVEMENT_SETTINGS, ...parsed };
      memoryAchievementSettingsCache = merged;
      return merged;
    }
  } catch (e) {
    console.error("Failed to parse achievement settings:", e);
  }
  return memoryAchievementSettingsCache || DEFAULT_ACHIEVEMENT_SETTINGS;
};

export const saveAchievementSettings = (settings: AchievementSettings): AchievementSettings => {
  if (typeof window !== "undefined") {
    memoryAchievementSettingsCache = settings;
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENT_SETTINGS, JSON.stringify(settings));
    triggerDataUpdate();
  }
  return settings;
};

// ==========================================
// RESET ALL TO DEFAULTS
// ==========================================
export const resetPortfolioData = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(initialBlogs));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(defaultSkillGroups));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(defaultExperience));
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(defaultEducation));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
    localStorage.removeItem(STORAGE_KEYS.SPOTLIGHT);
    localStorage.removeItem(STORAGE_KEYS.SPOTLIGHT_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.HOME_SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENT_SETTINGS);
    localStorage.removeItem(GUESTBOOK_STORAGE_KEY);
    memoryHomeSectionsCache = null;
    memoryAchievementsCache = null;
    memoryAchievementSettingsCache = null;
    triggerDataUpdate();
  }
};
