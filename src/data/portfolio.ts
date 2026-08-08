/**
 * ── EDIT ME ───────────────────────────────────────────────────────────────
 * Every piece of personal content lives in this single file.
 * Change a value here and it updates everywhere on the site.
 * ──────────────────────────────────────────────────────────────────────────
 */
import profileImg from "@/assets/profile.jpg";
import keenkeeper from "@/assets/keenkeeper.png";
import digitools from "@/assets/digitools.png";
import issues from "@/assets/issues.png";
import jobtracker from "@/assets/jobtracker.png";
import drivefleet from "@/assets/drivefleet.png";
import suncart from "@/assets/suncart.png";
import arthub from "@/assets/arthub.png";
import hackathon from "@/assets/hackathon.jpg";
import flyrank from "@/assets/flyrank.jpg";
import fixitnow from "@/assets/fixitnow.png";

export const profile = {
  name: "Md. Farhadul Islam",
  shortName: "Farhadul",
  initials: "FI",
  role: "Computer Science & Engineering Student",
  subRole: "Frontend Developer // React & Next.js",
  tagline: "Building digital experiences with code, creativity & technology.",
  intro:
    "CSE undergraduate at BAIUST building modern, performant and accessible web products. I turn ideas into shipped interfaces — clean code, real deployments, measurable results.",
  photo: profileImg,
  location: "Comilla, Bangladesh",
  email: "mi0223937@gmail.com",
  phone: "+880 1945-321285",
  whatsapp: "https://wa.me/8801945321285",
  resume:
    "https://drive.google.com/file/d/1yXszuLE-KaRa-pYCgbIsyGJhnJt7N93s/view?usp=drive_link",
  resumeFile: "/Farhad_Resume.pdf",
  github: "https://github.com/Farhadmu",
  githubUser: "Farhadmu",
  linkedin: "https://www.linkedin.com/in/md-farhadul-islam-025438373/",
  facebook: "https://www.facebook.com/share/18bRg6kEKS/",
  blog: "https://farhad-blog.vercel.app",
  university: "Bangladesh Army International University of Science and Technology (BAIUST)",
  /**
   * Contact form delivery — https://formspree.io (free tier).
   * 1. Sign up at formspree.io → "+ New Form" → copy the form ID from the
   *    endpoint it gives you (looks like https://formspree.io/f/abcdwxyz).
   * 2. Paste just the ID ("abcdwxyz") below, replacing "YOUR_FORM_ID".
   * 3. In the Formspree dashboard → your form → Settings, you can turn on
   *    "Send confirmation to submitter" for a free auto-reply — no code needed.
   * Until you set this, the form falls back to opening the visitor's email app.
   */
  formspreeId: "YOUR_FORM_ID",
  /**
   * Your deployed site's URL, no trailing slash — used for the canonical
   * link tag and og:url. Update once you know your final Vercel domain
   * (e.g. "https://farhadul.vercel.app" or a custom domain).
   */
  siteUrl: "https://farhad-portfolio.vercel.app",
};

export const stats = [
  { value: "10+", label: "Projects Shipped" },
  { value: "6th", label: "SUST CSE Carnival '26" },
  { value: "35+", label: "Technologies" },
  { value: "Top 300", label: "EJP · Programming Hero" },
];

export const aboutCards = [
  {
    icon: "brain",
    title: "Problem Solving",
    body: "Daily DSA practice in C++ — decomposing hard problems into clean, provable steps.",
  },
  {
    icon: "code",
    title: "Software Development",
    body: "Readable architecture, typed contracts and code that survives its second month.",
  },
  {
    icon: "layout",
    title: "Web Development",
    body: "React, Next.js App Router, Tailwind — fast, accessible, responsive interfaces.",
  },
  {
    icon: "sparkles",
    title: "AI / Machine Learning",
    body: "AI-assisted engineering workflows and AI-driven product features.",
  },
  {
    icon: "database",
    title: "Database",
    body: "MongoDB, Firebase and PostgreSQL — schema design, indexing, aggregation.",
  },
  {
    icon: "cpu",
    title: "Computer Science",
    body: "Data structures, algorithms, OS and networks — the fundamentals under the frameworks.",
  },
];

export const aboutFocus = [
  "Exploring Next.js & modern React patterns",
  "Practicing Competitive Programming with C++",
  "Strengthening Advanced JavaScript, React & DSA",
  "Goal: Become a Full Stack Developer",
  "Daily driving Garuda Linux as primary OS",
];

export type Level = "Advanced" | "Intermediate" | "Learning";

export const skillGroups: {
  category: string;
  icon: string;
  accent: "cyan" | "violet" | "lime" | "amber" | "pink";
  skills: { name: string; level: Level; value: number; note: string; logo: string }[];
}[] = [
  {
    category: "Programming Languages",
    icon: "terminal",
    accent: "pink",
    skills: [
      { name: "JavaScript ES6+", level: "Advanced", value: 88, note: "Async, closures, modules, DOM mastery.", logo: "javascript" },
      { name: "TypeScript", level: "Intermediate", value: 70, note: "Typed props, generics, safer refactors.", logo: "typescript" },
      { name: "C++", level: "Intermediate", value: 72, note: "Competitive programming & STL.", logo: "cplusplus" },
      { name: "C", level: "Intermediate", value: 65, note: "Memory, pointers, low-level fundamentals.", logo: "c" },
    ],
  },
  {
    category: "Frontend",
    icon: "layout",
    accent: "cyan",
    skills: [
      { name: "React.js", level: "Advanced", value: 90, note: "Hooks, context, composition patterns.", logo: "react" },
      { name: "Next.js", level: "Intermediate", value: 75, note: "App Router, server components, routing.", logo: "nextdotjs" },
      { name: "Tailwind CSS", level: "Advanced", value: 92, note: "Design-token driven utility styling.", logo: "tailwindcss" },
      { name: "HTML5 & CSS3", level: "Advanced", value: 94, note: "Semantics, grid, flex, animation.", logo: "html5" },
      { name: "Framer Motion", level: "Intermediate", value: 74, note: "Layout, gesture and scroll animation.", logo: "framer" },
      { name: "DaisyUI", level: "Intermediate", value: 70, note: "Themed component system on Tailwind.", logo: "daisyui" },
    ],
  },
  {
    category: "Backend",
    icon: "server",
    accent: "lime",
    skills: [
      { name: "Node.js", level: "Intermediate", value: 72, note: "REST APIs, middleware, env config.", logo: "nodedotjs" },
      { name: "Express.js", level: "Intermediate", value: 72, note: "Routing, controllers, error handling.", logo: "express" },
      { name: "JWT Auth", level: "Intermediate", value: 70, note: "HTTPOnly cookies, protected routes.", logo: "jsonwebtokens" },
      { name: "Stripe Checkout", level: "Intermediate", value: 66, note: "One-time & subscription payments.", logo: "stripe" },
    ],
  },
  {
    category: "Database",
    icon: "database",
    accent: "violet",
    skills: [
      { name: "MongoDB", level: "Intermediate", value: 76, note: "$regex search, $in filters, Atlas.", logo: "mongodb" },
      { name: "Firebase", level: "Intermediate", value: 74, note: "Auth, Google OAuth, hosting.", logo: "firebase" },
      { name: "PostgreSQL", level: "Learning", value: 45, note: "Relational modelling & SQL joins.", logo: "postgresql" },
    ],
  },
  {
    category: "Tools & Technologies",
    icon: "wrench",
    accent: "amber",
    skills: [
      { name: "Git & GitHub", level: "Advanced", value: 88, note: "Branching, PR flow, GitHub Pages.", logo: "github" },
      { name: "VS Code", level: "Advanced", value: 92, note: "Extensions, debugging, snippets.", logo: "vscodium" },
      { name: "Linux (Garuda)", level: "Intermediate", value: 74, note: "Daily driver, shell, tooling.", logo: "linux" },
      { name: "Vercel & Netlify", level: "Intermediate", value: 80, note: "CI deploys, env vars, domains.", logo: "vercel" },
      { name: "Figma", level: "Intermediate", value: 66, note: "Design handoff to pixel-accurate UI.", logo: "figma" },
      { name: "TanStack Query", level: "Learning", value: 50, note: "Server-state caching & mutations.", logo: "reactquery" },
    ],
  },
  {
    category: "Core CS",
    icon: "cpu",
    accent: "cyan",
    skills: [
      { name: "Data Structures", level: "Intermediate", value: 70, note: "Arrays, trees, graphs, hashing.", logo: "leetcode" },
      { name: "Algorithms", level: "Intermediate", value: 68, note: "Greedy, DP, graph traversal.", logo: "codeforces" },
      { name: "OOP", level: "Intermediate", value: 75, note: "Encapsulation, inheritance, design.", logo: "cplusplus" },
      { name: "System Design", level: "Learning", value: 45, note: "Scalability, caching, architecture.", logo: "apachekafka" },
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  tech: string[];
  stack: string[];
  features?: string[];
  challenges?: string;
  live?: string;
  github?: string;
  github2?: { label: string; url: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "fixitnow",
    title: "FixItNow",
    tagline: "Home Service Marketplace",
    description:
      "A full-stack home service marketplace connecting customers with vetted technicians — browse services, book a time slot, pay via Stripe and track every job start to finish across customer, technician and admin dashboards.",
    image: fixitnow,
    tech: ["Next.js 14", "TypeScript", "Tailwind", "Stripe", "TanStack Query"],
    stack: [
      "Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form",
      "Zod", "TanStack Query", "React Context (Auth)", "Next.js Middleware",
      "Stripe Checkout", "Recharts", "sonner",
    ],
    features: [
      "Role-based dashboards — dedicated Customer, Technician and Admin flows with JWT + middleware route protection",
      "Booking flow — service + date/time + address, with a visual status stepper (Requested → Accepted → Paid → In Progress → Completed)",
      "Stripe Checkout payments — full redirect flow with dedicated success/cancel pages and a payment history table",
      "Technician tools — weekly calendar-grid availability scheduler, services CRUD and an earnings-trend chart",
      "Admin tools — platform stats, bookings-by-status chart, user management with ban/unban, and category CRUD",
    ],
    challenges:
      "Storing the JWT in a cookie so both client components and Next.js middleware could read it for role-based route protection, and driving the booking-status stepper and action buttons off a single state machine shared across all three roles.",
    live: "https://fixitnow-frontend-wki2.onrender.com/",
    github: "https://github.com/Farhadmu/fixitnow-frontend",
    featured: true,
  },
  {
    slug: "arthub",
    title: "ArtHub",
    tagline: "Online Art Marketplace",
    description:
      "A full-stack digital platform connecting art lovers and collectors with talented artists. Browse, discover and purchase original artworks with Stripe payments, role-based dashboards, analytics and purchase-gated engagement.",
    image: arthub,
    tech: ["Next.js 14", "React", "Tailwind", "Stripe", "MongoDB"],
    stack: [
      "Next.js 14", "React", "Tailwind CSS", "Framer Motion", "Axios", "Recharts",
      "react-hot-toast", "Swiper", "imgBB API", "Stripe Checkout", "JWT + Google OAuth",
      "MongoDB", "Express.js", "Node.js",
    ],
    features: [
      "Auth & Roles — Email/password + Google OAuth, JWT sessions, 3 roles with dedicated dashboards",
      "Artwork Discovery — hero carousel, featured artworks, top artists, search/filter/sort/pagination",
      "Stripe Payments — one-time purchases plus Free / Pro / Premium subscription tiers",
      "Dashboards — user gallery, artist CRUD with imgBB upload, admin analytics charts",
    ],
    challenges:
      "Role-based access control across three dashboards, Stripe subscription tiers, purchase-gated comments and responsive Recharts analytics.",
    live: "https://arthub-client-olive.vercel.app/",
    github: "https://github.com/Farhadmu/Arthub-client",
    github2: { label: "Backend", url: "https://github.com/Farhadmu/Arthub-server" },
    featured: true,
  },
  {
    slug: "drivefleet",
    title: "DriveFleet",
    tagline: "Premium Car Rental Platform",
    description:
      "A full-stack car rental platform with Firebase + JWT auth, smart booking, full CRUD car listings and MongoDB-powered search & filter — wrapped in a sleek dark UI.",
    image: drivefleet,
    tech: ["React 18", "Node.js", "Express", "MongoDB"],
    stack: [
      "React 18", "React Router v6", "Tailwind CSS", "Firebase Auth", "Axios",
      "React Hot Toast", "SweetAlert2", "Node.js", "Express.js", "MongoDB Atlas",
      "JWT + Cookies", "CORS",
    ],
    features: [
      "Secure auth — Firebase email/password & Google OAuth, JWT in HTTPOnly cookies",
      "Full car listing CRUD backed by MongoDB with confirmation modals",
      "Smart booking with driver preference, notes, history and cancellation",
      "Search & filter using MongoDB $regex and $in operators",
    ],
    live: "https://drivefleet-client-kappa.vercel.app/",
  },
  {
    slug: "keenkeeper",
    title: "KeenKeeper",
    tagline: "Relationship Management App",
    description:
      "Stay connected with the people who matter most — track interactions, set contact goals and get auto-calculated On-Track / Almost Due / Overdue status in one clean dashboard.",
    image: keenkeeper,
    tech: ["Next.js 15", "React 19", "Tailwind", "Recharts"],
    stack: ["Next.js 15", "React 19", "Tailwind CSS", "DaisyUI", "Recharts", "Netlify"],
    challenges:
      "Dynamic routing with the Next.js App Router, an auto-calculating status system from interaction history, and fully responsive Recharts.",
    live: "https://venerable-paletas-ee7f00.netlify.app/",
    github: "https://github.com/Farhadmu/keen-keeper-main",
  },
  {
    slug: "suncart",
    title: "SunCart",
    tagline: "Summer Essentials Store",
    description:
      "A summer e-commerce SPA — 16 curated products across 9 categories with Firebase auth, Google sign-in, an animated Swiper hero, search, filter, sort and protected routes.",
    image: suncart,
    tech: ["React 18", "Tailwind", "DaisyUI", "Firebase"],
    stack: [
      "React 18", "Vite 5", "react-router-dom v6", "Tailwind CSS 3", "DaisyUI 4",
      "Firebase 10", "Swiper 11", "react-hot-toast", "animate.css",
    ],
    features: [
      "16 curated summer products across 9 categories",
      "Firebase auth with Google sign-in and forgot-password flow",
      "Protected product detail routes with redirect-back after sign-in",
    ],
    live: "https://sun-cart-summer-essentials-store-six.vercel.app/",
  },
  {
    slug: "digitools",
    title: "DigiTools",
    tagline: "Digital Tools Marketplace",
    description:
      "A modern, responsive marketplace for premium digital tools. Browse curated products, manage the cart and enjoy a smooth experience built for creators and developers.",
    image: digitools,
    tech: ["React.js", "Tailwind", "DaisyUI"],
    stack: ["React.js", "Tailwind CSS", "DaisyUI", "React-Toastify", "Netlify"],
    challenges:
      "Building a full cart system, a responsive product grid and smooth UI interactions without heavy dependencies.",
    live: "https://marvelous-nougat-5c5bf6.netlify.app/",
    github: "https://github.com/Farhadmu/DIgiTools-",
  },
  {
    slug: "issues-tracker",
    title: "GitHub Issues Tracker",
    tagline: "REST API + Vanilla JS",
    description:
      "A responsive GitHub issues tracker that fetches real repository issues — filter open/closed, view priority labels and browse in a clean card interface.",
    image: issues,
    tech: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
    stack: ["HTML5", "CSS3", "Vanilla JS", "GitHub REST API", "GitHub Pages"],
    challenges:
      "GitHub REST API pagination and rate limits, graceful async handling and full responsiveness without a CSS framework.",
    live: "https://farhadmu.github.io/B-13-assignment-5/",
    github: "https://github.com/Farhadmu/B-13-assignment-5",
  },
  {
    slug: "job-tracker",
    title: "Job Application Tracker",
    tagline: "DOM & Event Delegation",
    description:
      "A practical DOM manipulation project for tracking job applications — filter by status, manage interviews and rejections with clean event handling and delegation.",
    image: jobtracker,
    tech: ["JavaScript", "HTML5", "CSS3", "DOM"],
    stack: ["HTML5", "CSS3", "Vanilla JS ES6+", "DOM API", "GitHub Pages"],
    challenges:
      "Efficient event delegation for dynamic cards and managing filter state without any framework.",
    live: "https://farhadmu.github.io/B-13-assignment.A-4/",
    github: "https://github.com/Farhadmu/B-13-assignment.A-4",
  },
];

export const experience = [
  {
    title: "SUST CSE Carnival 2026 — Hackathon",
    org: "Team Zero_Bug_zone · bKash presented",
    period: "Jul 11–12, 2026",
    status: "completed" as const,
    image: hackathon,
    tags: ["Hackathon", "Team Project", "24-Hour Onsite"],
    body: "Cleared the preliminary round among 700+ registered teams to reach the top 50, survived a 24-hour onsite hackathon to advance into the final 15, and placed 6th overall after the final presentation round.",
    highlight: "6th place out of 700+ teams — prelims → top 50 → final 15",
    extra:
      'Built "Super Agent Liquidity Risk Intelligence" — an AI-driven platform for analyzing and monitoring liquidity risk, developed and deployed inside the 24-hour window.',
    live: "https://super-agent-liquidity-risk-intelligence-mdrk.onrender.com",
    github:
      "https://github.com/Farhadmu/Super-Agent-Liquidity-Risk-Intelligence-platform",
  },
  {
    title: "Front-End AI Engineering Intern",
    org: "FlyRank AI · Remote",
    period: "Jul 1 – Nov 10, 2026",
    status: "active" as const,
    image: flyrank,
    tags: ["Internship", "Remote", "AI Engineering"],
    body: "Self-paced remote internship focused on front-end AI-assisted engineering: building responsive, mobile-optimized websites and ecommerce-style pages with clean Tailwind execution, then using AI tools to generate, debug and QA for responsiveness and accessibility.",
    extra:
      "Shopify/Shopline-style product cards, collections, detail sections, trust blocks and CTAs — verified personally for accessibility and pixel-accurate details.",
  },
];

export const education = [
  {
    year: "2026 — Present",
    title: "B.Sc. in Computer Science & Engineering",
    org: "Bangladesh Army International University of Science and Technology (BAIUST)",
    body: "Studying core CS — data structures, algorithms, web development and software engineering — alongside competitive programming and real-world projects.",
    tags: ["Data Structures", "Algorithms", "Software Engineering"],
    status: "active" as const,
    kind: "Academic",
  },
  {
    year: "2026 — Running",
    title: "Level 2 — AI-Driven Software Engineer Bootcamp",
    org: "Programming Hero — Batch 7",
    body: "Advanced backend-focused bootcamp covering system design, advanced Node.js, databases, DevOps, AI integration and scalable architecture patterns.",
    tags: ["System Design", "Advanced Node.js", "PostgreSQL", "Docker", "AI Integration", "DevOps"],
    status: "active" as const,
    kind: "Training",
  },
  {
    year: "2025 — Completed",
    title: "Level 1 — AI-Complete Web Development",
    org: "Programming Hero — Batch 13",
    body: "Intensive full-stack bootcamp covering HTML, CSS, JavaScript, React, Node.js, MongoDB and modern tooling. Built 10+ real-world projects.",
    tags: ["React", "Node.js", "MongoDB", "Firebase", "Tailwind"],
    highlight: "Ranked in the Top 300 of 5000+ students — earned EJP and SCIC placement",
    status: "done" as const,
    kind: "Training",
  },
  {
    year: "2022 — Completed",
    title: "Higher Secondary Certificate (HSC)",
    org: "Ispahani Public School and College, Comilla",
    body: "Science group with a focus on Mathematics, Physics and Chemistry — building a strong analytical foundation for computer science.",
    tags: ["Mathematics", "Physics", "Chemistry"],
    status: "done" as const,
    kind: "Academic",
  },
  {
    year: "2020 — Completed",
    title: "Secondary School Certificate (SSC)",
    org: "Comilla Cantonment Boys High School",
    body: "Science group with strong foundations in mathematics and science; a disciplined environment that shaped a steady work ethic and early curiosity for problem-solving.",
    tags: ["Science"],
    status: "done" as const,
    kind: "Academic",
  },
];

export const services = [
  {
    icon: "layout",
    title: "Web Development",
    body: "End-to-end websites and web apps — from first wireframe to a deployed, monitored production URL.",
  },
  {
    icon: "sparkles",
    title: "Frontend Development",
    body: "React & Next.js interfaces that are fast, accessible and pixel-accurate on every screen size.",
  },
  {
    icon: "server",
    title: "Backend Development",
    body: "REST APIs with Node, Express and MongoDB — auth, validation, and clean data contracts.",
  },
  {
    icon: "code",
    title: "Software Development",
    body: "Maintainable, typed, well-structured codebases that a team can keep shipping from.",
  },
  {
    icon: "palette",
    title: "UI/UX Implementation",
    body: "Figma to code with faithful spacing, motion and states — design systems, not one-off screens.",
  },
  {
    icon: "brain",
    title: "Problem Solving",
    body: "Algorithmic thinking applied to product problems: fewer moving parts, better performance.",
  },
];

export const githubStats = [
  { label: "Public Repos", value: "24+", icon: "folder" },
  { label: "Contributions", value: "600+", icon: "activity" },
  { label: "Longest Streak", value: "38 days", icon: "flame" },
  { label: "Top Language", value: "JavaScript", icon: "code" },
];

export const languageBars = [
  { name: "JavaScript", pct: 42, accent: "amber" as const },
  { name: "TypeScript", pct: 18, accent: "cyan" as const },
  { name: "CSS / Tailwind", pct: 16, accent: "violet" as const },
  { name: "C / C++", pct: 15, accent: "pink" as const },
  { name: "HTML", pct: 9, accent: "lime" as const },
];

export const navSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "experience", label: "Hackathon" },
  { id: "contact", label: "Contact" },
];

/**
 * ── Live Activity ────────────────────────────────────────────────────────
 * "Currently building" roadmap + latest posts from the blog.
 */
export const currentlyBuilding = [
  {
    title: "Deepening Next.js App Router patterns",
    note: "Server components, parallel routes and streaming for FixItNow-style apps.",
    status: "active" as const,
  },
  {
    title: "AI-Driven Software Engineer Bootcamp — Level 2",
    note: "System design, advanced Node.js and DevOps with Programming Hero, Batch 7.",
    status: "active" as const,
  },
  {
    title: "Daily DSA in C++",
    note: "Steady competitive-programming practice — arrays, graphs and dynamic programming.",
    status: "active" as const,
  },
];

export const blogPosts = [
  {
    title: "Storing JWTs in cookies for Next.js middleware auth",
    excerpt:
      "How I wired role-based route protection so both client components and middleware.ts can read the same session.",
    date: "2026",
    url: profile.blog,
  },
  {
    title: "A booking-status state machine that drives the whole UI",
    excerpt:
      "Using one status enum to power action buttons, progress steppers and dashboards across three user roles.",
    date: "2026",
    url: profile.blog,
  },
  {
    title: "Lazy-loading a Three.js hero without a layout jump",
    excerpt: "Falling back to a pure-CSS orb while the WebGL scene streams in on wide screens.",
    date: "2026",
    url: profile.blog,
  },
];

/**
 * ── Credibility ──────────────────────────────────────────────────────────
 * Testimonials and certificates. Edit freely — these are placeholders,
 * swap in real quotes / credential links as they come in.
 */
export const testimonials = [
  {
    name: "Team Zero_Bug_zone",
    role: "SUST CSE Carnival 2026",
    quote:
      "Farhad carried the frontend under a 24-hour clock without losing composure — clean UI, on time, every round.",
  },
  {
    name: "Programming Hero — Batch 13",
    role: "Mentor Feedback",
    quote:
      "Consistently one of the most complete project submissions in the batch — thoughtful structure, not just working code.",
  },
  {
    name: "FlyRank AI",
    role: "Internship Supervisor",
    quote:
      "Picks up ambiguous design specs and ships pixel-accurate, responsive pages with minimal back-and-forth.",
  },
];

export const certificates = [
  {
    title: "AI-Complete Web Development — Level 1",
    issuer: "Programming Hero, Batch 13",
    date: "2025",
    icon: "award",
  },
  {
    title: "AI-Driven Software Engineer — Level 2 (in progress)",
    issuer: "Programming Hero, Batch 7",
    date: "2026",
    icon: "award",
  },
  {
    title: "SUST CSE Carnival 2026 — 6th Place",
    issuer: "Shahjalal University of Science & Technology",
    date: "2026",
    icon: "trophy",
  },
  {
    title: "Front-End AI Engineering Internship",
    issuer: "FlyRank AI",
    date: "2026",
    icon: "badge",
  },
];
