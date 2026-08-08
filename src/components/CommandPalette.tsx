import { useEffect, useState } from "react";
import { Download, FileText, Home, Mail, Rss } from "lucide-react";
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
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="glass mono fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[11px] text-muted-foreground shadow-[var(--shadow-depth)] transition-colors hover:border-primary/40 hover:text-primary sm:flex"
      >
        Quick nav
        <kbd className="mono rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px]">
          ⌘K
        </kbd>
      </button>

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

          <CommandGroup heading="Links">
            <CommandItem onSelect={() => openExternal(profile.github)}>
              <GithubIcon className="size-4" />
              <span>GitHub Profile</span>
              <CommandShortcut>{profile.githubUser}</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.linkedin)}>
              <LinkedinIcon className="size-4" />
              <span>LinkedIn</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.blog)}>
              <Rss />
              <span>Blog</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.resume)}>
              <FileText />
              <span>View Resume</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.resumeFile)}>
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
