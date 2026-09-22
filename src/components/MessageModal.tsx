import { useState, useEffect, type FormEvent } from "react";
import {
  X,
  Send,
  Loader2,
  Check,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import { sendDirectMessage } from "@/lib/supabase";
import { sound } from "@/lib/sound";
import { toast } from "sonner";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const intentPills = [
  "Software Engineering Role",
  "Full-Stack Contract",
  "Architecture Review",
  "General Inquiry",
];

export function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [selectedIntent, setSelectedIntent] = useState("Software Engineering Role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.error("Please provide both your email and a message brief.");
      return;
    }

    setStatus("sending");
    sound.click();

    try {
      // 1. Deliver directly into Farhad's Admin Dashboard
      await sendDirectMessage({
        name: name.trim() || "Visitor",
        email: email.trim(),
        message: message.trim(),
        topic: selectedIntent,
      });

      // 2. Optional Formspree fallback if ID configured
      if (profile.formspreeId && profile.formspreeId !== "YOUR_FORM_ID") {
        try {
          const fd = new FormData();
          fd.append("name", name.trim() || "Visitor");
          fd.append("email", email.trim());
          fd.append("message", `[${selectedIntent}] ${message.trim()}`);
          await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
        } catch (err) {
          console.warn("Formspree forward warning:", err);
        }
      }

      setStatus("sent");
      sound.success();
      toast.success("Message dispatched! Delivered directly to Farhad's dashboard.");

      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Failed to transmit message. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const scrollToContactSection = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        const input = el.querySelector('input[name="name"]') as HTMLInputElement;
        input?.focus();
      }
    }, 150);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.click();
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Direct Engineering Line
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" /> Send Farhad a Message
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Transmits directly to Farhad's live admin dashboard with sub-4hr response time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="rounded-xl p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Inquiry Topic Selection */}
          <div>
            <span className="mono mb-2 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              Inquiry Topic
            </span>
            <div className="flex flex-wrap gap-1.5">
              {intentPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => {
                    sound.click();
                    setSelectedIntent(pill);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedIntent === pill
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/70 bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Email Fields */}
          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <div>
              <label className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Your Name / Organization
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera · Tech Corp"
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                Contact Email <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Project / Role Brief */}
          <div>
            <label className="mono mb-1.5 block text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
              Project / Role Brief <span className="text-primary">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share details about the role, project scope, tech stack, or problem to solve..."
              className="w-full resize-none rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-1 focus:ring-primary/40 leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] hover:brightness-110 disabled:opacity-75 disabled:hover:scale-100"
            style={{ background: "var(--gradient-brand)" }}
          >
            {status === "sending" && <Loader2 className="size-4 animate-spin" />}
            {status === "sent" && <Check className="size-4 text-emerald-300" />}
            {status === "error" && <AlertCircle className="size-4" />}
            {status === "idle" && <Send className="size-4" />}
            {status === "sending" && "Dispatching to Dashboard..."}
            {status === "sent" && "Delivered to Farhad's Dashboard!"}
            {status === "error" && "Delivery Failed — Please Try Again"}
            {status === "idle" && "Transmit Message"}
          </button>

          {/* Footer Notice & Section Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground mono">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Saves instantly into Farhad's Admin Portal
            </span>
            <button
              type="button"
              onClick={scrollToContactSection}
              className="text-primary hover:underline"
            >
              Or open on-page contact section &darr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
