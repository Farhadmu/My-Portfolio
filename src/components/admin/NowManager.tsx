import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Hammer,
  GraduationCap,
  BookOpen,
  MapPin,
  Headphones,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  getNowData,
  saveNowData,
  type NowData,
  type NowBuildingItem,
  type NowLearningItem,
  type NowReadingItem,
  DEFAULT_NOW_DATA,
} from "@/lib/supabase";
import { toast } from "sonner";

export function NowManager() {
  const [data, setData] = useState<NowData>(DEFAULT_NOW_DATA);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNowData().then(setData);
  }, []);

  const handleUpdateTimestamp = () => {
    const updated = { ...data, updatedAt: new Date().toISOString() };
    setData(updated);
    saveNowData(updated).then(() => {
      toast.success("Timestamp refreshed to now! Live badge updated.");
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveNowData(data);
      toast.success("Now page and section saved successfully!");
    } catch {
      toast.error("Failed to save now data.");
    } finally {
      setSaving(false);
    }
  };

  // Building item helpers
  const addBuildingItem = () => {
    const newItem: NowBuildingItem = {
      id: `b-${Date.now()}`,
      title: "New Project / Sprint",
      note: "Details of what is being engineered...",
      status: "active",
    };
    setData({ ...data, building: [...data.building, newItem] });
  };

  const removeBuildingItem = (id: string) => {
    setData({ ...data, building: data.building.filter((b) => b.id !== id) });
  };

  // Learning item helpers
  const addLearningItem = () => {
    const newItem: NowLearningItem = {
      id: `l-${Date.now()}`,
      title: "New Topic / Technology",
      note: "Exploring deep concepts...",
      tag: "Deep Dive",
    };
    setData({ ...data, learning: [...data.learning, newItem] });
  };

  const removeLearningItem = (id: string) => {
    setData({ ...data, learning: data.learning.filter((l) => l.id !== id) });
  };

  // Reading item helpers
  const addReadingItem = () => {
    const newItem: NowReadingItem = {
      id: `r-${Date.now()}`,
      title: "New Book / Research Paper",
      author: "Author Name",
      note: "Notes & insights from the book...",
    };
    setData({ ...data, reading: [...data.reading, newItem] });
  };

  const removeReadingItem = (id: string) => {
    setData({ ...data, reading: data.reading.filter((r) => r.id !== id) });
  };

  const formattedDistance = (() => {
    try {
      if (!data.updatedAt) return "recently";
      return formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true });
    } catch {
      return "recently";
    }
  })();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">"Now" Page &amp; Home Memo Editor</h3>
            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-mono font-bold">
              Updated {formattedDistance}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Edit what you are building, learning, and reading right now. Renders on both Home section and /now.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUpdateTimestamp}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
          >
            <RefreshCw className="size-3.5" />
            <span>Set Updated to Right Now</span>
          </button>

          <a
            href="/now"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            <ExternalLink className="size-3.5" />
            <span>View Live /now</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Mindset & Meta Settings */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Current Focus &amp; Location
          </h4>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Primary Focus Statement (Highlighted in yellow memo)
            </label>
            <textarea
              rows={2}
              value={data.currentFocus}
              onChange={(e) => setData({ ...data, currentFocus: e.target.value })}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              placeholder="E.g. Refining systems architecture, competitive programming speed..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Location &amp; Campus
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                placeholder="Comilla, Bangladesh (BAIUST Campus)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Listening To (Music / Podcasts)
              </label>
              <input
                type="text"
                value={data.listeningTo || ""}
                onChange={(e) => setData({ ...data, listeningTo: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                placeholder="Khruangbin & Lo-fi Chillhop..."
              />
            </div>
          </div>
        </div>

        {/* 1. Building Items */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Hammer className="size-4" /> Currently Building ({data.building.length})
            </h4>
            <button
              type="button"
              onClick={addBuildingItem}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
            >
              <Plus className="size-3" /> Add Project
            </button>
          </div>

          <div className="space-y-3">
            {data.building.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...data.building];
                      updated[idx].title = e.target.value;
                      setData({ ...data, building: updated });
                    }}
                    placeholder="Project Title"
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                  <select
                    value={item.status || "active"}
                    onChange={(e) => {
                      const updated = [...data.building];
                      updated[idx].status = e.target.value as any;
                      setData({ ...data, building: updated });
                    }}
                    className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-mono font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="polishing">Polishing</option>
                    <option value="shipping">Shipping</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeBuildingItem(item.id)}
                    className="grid size-7 place-items-center rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.note}
                  onChange={(e) => {
                    const updated = [...data.building];
                    updated[idx].note = e.target.value;
                    setData({ ...data, building: updated });
                  }}
                  placeholder="Notes about what is being engineered..."
                  className="w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Learning Items */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <GraduationCap className="size-4" /> Diving Deep Into ({data.learning.length})
            </h4>
            <button
              type="button"
              onClick={addLearningItem}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20"
            >
              <Plus className="size-3" /> Add Topic
            </button>
          </div>

          <div className="space-y-3">
            {data.learning.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...data.learning];
                      updated[idx].title = e.target.value;
                      setData({ ...data, learning: updated });
                    }}
                    placeholder="Topic / Technology"
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.tag || ""}
                    onChange={(e) => {
                      const updated = [...data.learning];
                      updated[idx].tag = e.target.value;
                      setData({ ...data, learning: updated });
                    }}
                    placeholder="Tag (e.g. Systems)"
                    className="w-32 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeLearningItem(item.id)}
                    className="grid size-7 place-items-center rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.note}
                  onChange={(e) => {
                    const updated = [...data.learning];
                    updated[idx].note = e.target.value;
                    setData({ ...data, learning: updated });
                  }}
                  placeholder="Notes about concepts being explored..."
                  className="w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Reading Items */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <BookOpen className="size-4" /> Reading &amp; Researching ({data.reading.length})
            </h4>
            <button
              type="button"
              onClick={addReadingItem}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-500/20"
            >
              <Plus className="size-3" /> Add Book
            </button>
          </div>

          <div className="space-y-3">
            {data.reading.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/70 bg-secondary/20 p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...data.reading];
                      updated[idx].title = e.target.value;
                      setData({ ...data, reading: updated });
                    }}
                    placeholder="Book / Paper Title"
                    className="flex-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.author}
                    onChange={(e) => {
                      const updated = [...data.reading];
                      updated[idx].author = e.target.value;
                      setData({ ...data, reading: updated });
                    }}
                    placeholder="Author"
                    className="w-36 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeReadingItem(item.id)}
                    className="grid size-7 place-items-center rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={item.note}
                  onChange={(e) => {
                    const updated = [...data.reading];
                    updated[idx].note = e.target.value;
                    setData({ ...data, reading: updated });
                  }}
                  placeholder="Notes, key takeaway or chapter progress..."
                  className="w-full rounded-lg border border-border bg-secondary/30 px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="size-4" />
          <span>{saving ? "Saving..." : "Save Now Page & Home Memo"}</span>
        </button>
      </form>
    </div>
  );
}
