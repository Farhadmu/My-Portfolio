import { useEffect, useState } from "react";
import { Download, FileText, Home, Mail, Rss, Lock } from "lucide-react";
import { navSections, profile } from "@/data/portfolio";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { useHomeSectionsConfig } from "@/hooks/usePortfolioData";
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
  const homeSections = useHomeSectionsConfig();

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

  // Dedupe nav sections and filter out disabled ones
  const enabledIds = new Set(
    homeSections.sections.filter((s) => s.enabled).map((s) => s.id)
  );

  const uniqueSections = navSections
    .filter((s, i) => navSections.findIndex((x) => x.id === s.id) === i)
    .filter((s) => enabledIds.has(s.id));

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open command palette"
          className="flex items-center gap-2 rounded-md border-2 border-slate-900 bg-white px-3 py-1.5 font-mono text-[11px] font-bold text-slate-800 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a]"
        >
          <span>⌘ Quick Nav</span>
          <kbd className="rounded border border-slate-900 bg-[#fef08a] px-1.5 py-0.5 text-[10px] text-slate-900 font-bold">
            ⌘K
          </kbd>
        </button>

        <a
          href="/admin"
          aria-label="Admin CMS Login"
          title="Admin CMS Login (/admin)"
          className="flex size-8 items-center justify-center rounded-md border-2 border-slate-900 bg-white text-slate-800 shadow-[2px_2px_0px_#0f172a] transition-all hover:-translate-y-0.5 hover:bg-slate-50"
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
                window.dispatchEvent(new CustomEvent("open_resume_modal"));
              }}
            >
              <Download />
              <span>View Interactive CV</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Connect & Social">
            <CommandItem onSelect={() => openExternal(profile.github)}>
              <GithubIcon className="size-4" />
              <span>GitHub Profile</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(profile.linkedin)}>
              <LinkedinIcon className="size-4" />
              <span>LinkedIn</span>
            </CommandItem>
            <CommandItem onSelect={() => openExternal(`mailto:${profile.email}`)}>
              <Mail />
              <span>Send an Email</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
