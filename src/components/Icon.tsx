import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  BadgeCheck,
  Brain,
  Code2,
  Cpu,
  Database,
  Flame,
  FolderGit2,
  LayoutDashboard,
  Palette,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Trophy,
  Wrench,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  brain: Brain,
  code: Code2,
  layout: LayoutDashboard,
  sparkles: Sparkles,
  database: Database,
  cpu: Cpu,
  terminal: Terminal,
  server: Server,
  wrench: Wrench,
  palette: Palette,
  folder: FolderGit2,
  activity: Activity,
  flame: Flame,
  award: Award,
  badge: BadgeCheck,
  trophy: Trophy,
  rocket: Rocket,
};

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  const C = MAP[name] ?? Sparkles;
  return <C className={className} />;
}
