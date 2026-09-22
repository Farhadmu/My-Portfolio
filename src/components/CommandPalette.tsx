import { useEffect, useState } from "react";
import { Download, FileText, Home, Mail, Rss, Lock } from "lucide-react";
import { navSections, profile } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const openExternal = (url?: string) => {
    setOpen(false);
    if (url) window.open(url, "_blank", "noreferrer");
  };

  // Dedupe nav sections (Experience & Hackathon share an id) for the palette list.
  const uniqueSections = navSections.filter(
    (s, i) => navSections.findIndex((x) => x.id === s.id) === i,
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
          className="glass mono flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-[11px] text-muted-foreground shadow-[var(--shadow-depth)] transition-all hover:border-primary/40 hover:text-primary hover:scale-105"
        >
          <span>Quick nav</span>
          <kbd className="mono rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        <a
          href="/admin"
          aria-label="Admin CMS Login"
          title="Admin CMS Login (/admin)"
          className="glass mono flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground shadow-[var(--shadow-depth)] transition-all hover:border-primary/40 hover:text-primary hover:scale-105"
        >
          <Lock className="size-3.5" />
        </a>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a section, or open a link…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {uniqueSections.map((s) => (
              <CommandItem key={s.id} onSelect={() => go(s.id)}>
                <Home />
                <span>{s.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Links & Pages">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.location.href = "/blog";
              }}
            >
              <Rss />
              <span>Tech Blog & Feed</span>
              <CommandShortcut>/blog</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.location.href = "/admin";
              }}
            >
              <FileText />
              <span>Admin CMS Portal</span>
              <CommandShortcut>/admin</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.dispatchEvent(new CustomEvent("open_message_modal"));
              }}
            >
              <Mail />
              <span>Send Direct Message (To Farhad's Dashboard)</span>
              <CommandShortcut>Msg</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.dispatchEvent(new CustomEvent("open_resume_modal"));
              }}
            >
              <FileText />
              <span>Interactive Resume Preview (In-Site)</span>
              <CommandShortcut>Resume</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                go("guestbook");
              }}
            >
              <FileText />
              <span>Community Guestbook & Endorsements</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.github)}>
              <GithubIcon className="size-4" />
              <span>GitHub Profile</span>
              <CommandShortcut>{profile.githubUser}</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.linkedin)}>
              <LinkedinIcon className="size-4" />
              <span>LinkedIn Profile</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.resume)}>
              <Download />
              <span>Download Resume (PDF)</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(`mailto:${profile.email}`)}>
              <Mail />
              <span>Email {profile.shortName}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
