import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  ExternalLink,
  RotateCcw,
  Zap,
  CheckCircle2,
  Code2,
  Briefcase,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { profile, projects, skillGroups, stats, education } from "@/data/portfolio";
import { sound } from "@/lib/sound";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  links?: { label: string; url?: string; action?: () => void }[];
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What tech stack does Farhad specialize in?",
  "Tell me about his top full-stack projects",
  "Is he available for hire or internships?",
  "What did he achieve at SUST CSE Carnival?",
  "How can I contact Farhad directly?",
];

export function AskFarhadAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I'm **Farhad AI**, Farhadul's portfolio assistant. You can ask me anything about his technical stack, projects, university background at BAIUST, or work availability.`,
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleOpen = () => {
    sound.pop();
    setIsOpen(true);
  };

  const handleClose = () => {
    sound.click();
    setIsOpen(false);
  };

  // Intelligent local semantic answer engine
  const generateAIResponse = (query: string): { text: string; links?: { label: string; url?: string; action?: () => void }[] } => {
    const q = query.toLowerCase();

    // Tech Stack & Skills
    if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("language") || q.includes("react") || q.includes("next")) {
      return {
        text: `Farhad's primary stack centers around modern **Frontend & Full-Stack Engineering**:\n\n- **Languages**: TypeScript, JavaScript (ESNext), C++ (Daily DSA), Python, SQL\n- **Frontend**: React 19, Next.js 15 (App Router), Tailwind CSS, Three.js / React Three Fiber, Framer Motion\n- **Backend & DB**: Node.js, Express, PostgreSQL, MongoDB, Supabase, Firebase, Redis\n- **DevOps & Tools**: Docker, Git, Linux (Garuda Linux daily driver), Postman, Vite`,
        links: [
          { label: "View Technical Skills Section", action: () => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }) },
        ],
      };
    }

    // Projects & Work
    if (q.includes("project") || q.includes("fixitnow") || q.includes("keenkeeper") || q.includes("portfolio") || q.includes("app")) {
      return {
        text: `Farhad has built **10+ production-grade web products**. Here are his top flagship builds:\n\n1. **FixItNow**: A full-stack Home Service Marketplace with dedicated role-based dashboards (Customer, Technician, Admin), JWT middleware protection, and Stripe Checkout payments.\n2. **KeenKeeper**: An encrypted personal knowledge vault with markdown editing, tag hierarchies, and instant cloud sync.\n3. **DriveFleet**: Intelligent vehicle fleet management platform with real-time operational status.\n4. **JobTracker**: Visual Kanban pipeline to streamline software engineering job applications.`,
        links: [
          { label: "Explore Projects Section", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
        ],
      };
    }

    // Availability / Hiring / Jobs
    if (q.includes("hire") || q.includes("job") || q.includes("intern") || q.includes("availab") || q.includes("rate") || q.includes("work with")) {
      return {
        text: `**Yes, Farhad is actively open to opportunities!**\n\n- **Roles**: Software Engineering Roles, Full-Stack / Frontend Developer positions, Contract Architectural Reviews, and Summer Internships.\n- **Location**: Based in Comilla/Dhaka, Bangladesh, with full capability for global Remote work across any timezone.\n- **Response Time**: Usually responds within a few hours via WhatsApp or Email.`,
        links: [
          { label: "Open Contact Form", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
          { label: "Chat on WhatsApp", url: profile.whatsapp },
        ],
      };
    }

    // Education & University
    if (q.includes("education") || q.includes("university") || q.includes("baiust") || q.includes("degree") || q.includes("student") || q.includes("study")) {
      return {
        text: `Farhad is currently pursuing his **B.Sc. in Computer Science & Engineering (CSE)** at **Bangladesh Army International University of Science and Technology (BAIUST)**.\n\nHis academic focus includes Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Computer Networks, and Operating Systems.`,
        links: [
          { label: "View Education Details", action: () => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" }) },
        ],
      };
    }

    // Hackathons & Achievements / SUST
    if (q.includes("sust") || q.includes("carnival") || q.includes("hackathon") || q.includes("award") || q.includes("achievement") || q.includes("contest") || q.includes("competitive")) {
      return {
        text: `Farhad has an active track record in competitive programming and hackathons:\n\n- **6th Place at SUST CSE Carnival '26**: Nationwide competitive programming and software engineering hackathon at Shahjalal University of Science & Technology.\n- **Top 300 Candidate**: Selected in Programming Hero's competitive Enterprise Java/JS Track.\n- **Daily DSA in C++**: Solves algorithmic problems with strict time and space complexity standards.`,
        links: [
          { label: "View Honors & Credibility", action: () => document.getElementById("credibility")?.scrollIntoView({ behavior: "smooth" }) },
        ],
      };
    }

    // Contact & Socials
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("whatsapp") || q.includes("linkedin") || q.includes("github")) {
      return {
        text: `You can reach Farhadul Islam directly via:\n\n- **Email**: \`${profile.email}\`\n- **Phone/WhatsApp**: \`${profile.phone}\`\n- **LinkedIn**: [LinkedIn Profile](${profile.linkedin})\n- **GitHub**: [github.com/${profile.githubUser}](${profile.github})\n- **Location**: ${profile.location}`,
        links: [
          { label: "Send an Email", url: `mailto:${profile.email}` },
          { label: "WhatsApp Direct", url: profile.whatsapp },
        ],
      };
    }

    // Resume / CV
    if (q.includes("resume") || q.includes("cv")) {
      return {
        text: `Farhad's verified resume is available in both interactive and downloadable PDF formats. It includes detailed project breakdowns, academic metrics, technical skills, and recommendations.`,
        links: [
          { label: "View / Download Resume (Google Drive)", url: profile.resume },
        ],
      };
    }

    // Bengali prompt detection
    if (/[\u0980-\u09FF]/.test(query)) {
      return {
        text: `ধন্যবাদ আপনার বার্তার জন্য! আমি ফারহাদুলের এআই পোর্টফোলিও অ্যাসিস্ট্যান্ট।\n\nফারহাদুল ইসলাম **BAIUST**-এর কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং (CSE) ডিপার্টমেন্টের ছাত্র এবং একজন দক্ষ **Frontend & Full-Stack Developer**।\n- টেক স্ট্যাক: React 19, Next.js 15, TypeScript, Node.js, C++ এবং PostgreSQL/MongoDB।\n- প্রজেক্ট: FixItNow, KeenKeeper, DriveFleet ইত্যাদি।\n- যোগাযোগ করতে সরাসরি কন্টাক্ট সেকশন অথবা WhatsApp ব্যবহার করতে পারেন!`,
        links: [
          { label: "কন্টাক্ট সেকশনে যান", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
          { label: "হোয়াটসঅ্যাপে চ্যাট করুন", url: profile.whatsapp },
        ],
      };
    }

    // Default intelligent fallback
    return {
      text: `Farhadul is a CSE student at BAIUST and a passionate Frontend & Full-Stack Developer specializing in **React 19, Next.js 15, TypeScript, and C++ problem solving**.\n\nHe has shipped 10+ projects including FixItNow and KeenKeeper, and took 6th place at SUST CSE Carnival 2026. What would you like to know more about?`,
      links: [
        { label: "See Projects", action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Contact Farhad", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    sound.click();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking & typing
    setTimeout(() => {
      const response = generateAIResponse(query);
      sound.success();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.text,
        links: response.links,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Floating Trigger Button — Vertically stacked directly above Quick nav with generous gap */}
      <div className="fixed bottom-[82px] right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open Ask Farhad AI Assistant"
          className="group relative flex items-center gap-2 rounded-full border border-primary/40 bg-zinc-950/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-primary hover:bg-card hover:shadow-primary/20"
        >
          {/* Pulsing radar dot */}
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <Bot className="size-4 text-primary group-hover:rotate-12 transition-transform" />
          <span>Ask Farhad AI</span>
          <span className="mono rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            v2.6
          </span>
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-2 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative flex flex-col w-full sm:w-[440px] h-[85vh] sm:h-[580px] rounded-3xl border border-border/80 bg-zinc-950/95 shadow-2xl backdrop-blur-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-zinc-900/80 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary/20 text-primary border border-primary/30">
                  <Bot className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-foreground">Ask Farhad AI</h3>
                    <span className="size-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="mono text-[10px] text-muted-foreground">
                    Online · Trained on Farhad's Portfolio & Experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    setMessages([
                      {
                        id: "welcome",
                        sender: "ai",
                        text: `Hello! I'm Farhad AI. How can I help you today with Farhad's engineering background or projects?`,
                        timestamp: "Just now",
                      },
                    ]);
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary text-xs">
                      <Bot className="size-3.5" />
                    </span>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-br-xs"
                        : "bg-secondary/60 text-foreground border border-border/60 rounded-bl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {/* Action & Deep Links */}
                    {m.links && m.links.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/40 pt-2">
                        {m.links.map((link, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              sound.pop();
                              if (link.action) {
                                link.action();
                                handleClose();
                              } else if (link.url) {
                                window.open(link.url, "_blank");
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ExternalLink className="size-2.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {m.sender === "user" && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-foreground text-xs">
                      <User className="size-3.5" />
                    </span>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary text-xs">
                    <Bot className="size-3.5" />
                  </span>
                  <div className="rounded-2xl rounded-bl-xs border border-border/60 bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
                    <span className="inline-flex gap-1 items-center">
                      <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="border-t border-border/40 bg-zinc-900/40 p-2 overflow-x-auto no-scrollbar flex gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="shrink-0 rounded-full border border-border/60 bg-secondary/60 px-2.5 py-1 text-[10px] text-muted-foreground hover:border-primary hover:text-foreground transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={onSubmit}
              className="border-t border-border/60 bg-zinc-950 p-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Farhad's skills, projects, stack..."
                className="flex-1 rounded-xl border border-border/80 bg-secondary/50 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all hover:bg-primary/90"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
