import { useState, useEffect, type FormEvent } from "react";
import {
  MessageSquareHeart,
  Plus,
  Send,
  X,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
  Quote,
  ShieldCheck,
} from "lucide-react";
import {
  getGuestbookEntries,
  addGuestbookEntry,
  type GuestbookEntry,
} from "@/lib/supabase";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { sound } from "@/lib/sound";
import { toast } from "sonner";

const AVATAR_COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getGuestbookEntries().then(setEntries);
    const handleUpdate = () => getGuestbookEntries().then(setEntries);
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Please provide both your name and message.");
      return;
    }

    setIsSubmitting(true);
    sound.click();

    try {
      const updated = await addGuestbookEntry({
        name: name.trim(),
        role: role.trim() || "Peer / Visitor",
        message: message.trim(),
        avatarColor: selectedColor,
      });

      setEntries(updated);
      setName("");
      setRole("");
      setMessage("");
      setIsOpen(false);
      sound.success();
      toast.success("Thank you! Your endorsement has been posted to the guestbook.");
    } catch {
      toast.error("Unable to submit entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="guestbook">
      <SectionHeading
        eyebrow="COMMUNITY & ENDORSEMENTS"
        title="Visitor & Recruiter Guestbook"
        desc="A public wall of messages, endorsements, and well-wishes from mentors, colleagues, recruiters, and fellow engineers."
      />

      {/* Header Action Bar */}
      <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <MessageSquareHeart className="size-5" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Leave a Message or Endorsement
            </h3>
            <p className="text-xs text-muted-foreground">
              Connect with Farhad or leave feedback on his engineering work.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.pop();
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105"
        >
          <Plus className="size-4" />
          <span>Sign Guestbook</span>
        </button>
      </Reveal>

      {/* Endorsements Masonry Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 0.04}>
            <div className="panel group relative flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/75 p-5 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/95 hover:shadow-xl">
              <div>
                {/* User Info Header */}
                <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid size-9 place-items-center rounded-xl text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: item.avatarColor || "#06b6d4" }}
                    >
                      {item.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {item.name}
                        </h4>
                        {item.verified && (
                          <BadgeCheck className="size-3.5 text-primary shrink-0" title="Verified Collaborator" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <span className="mono text-[10px] text-muted-foreground">
                    {item.createdAt}
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground italic">
                  "{item.message}"
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/30">
                <span className="mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  Public Endorsement
                </span>
                <Quote className="size-3 text-muted-foreground/40" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Sign Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                sound.click();
                setIsOpen(false);
              }}
              className="absolute right-4 top-4 rounded-xl border border-border bg-secondary/80 p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <Sparkles className="size-3.5" />
              <span>Community Guestbook</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Sign Farhad's Guestbook
            </h3>
            <p className="text-xs text-muted-foreground mt-1 mb-5">
              Share an endorsement, feedback on his work, or say hello.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Your Role / Company / Affiliation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Tech Lead @ Acme Corp or Peer @ BAIUST"
                  className="w-full rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Avatar Color
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`size-6 rounded-full transition-transform ${
                        selectedColor === c ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Message / Endorsement *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your note or recommendation here..."
                  className="w-full rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  <span>{isSubmitting ? "Posting..." : "Post Message"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}
