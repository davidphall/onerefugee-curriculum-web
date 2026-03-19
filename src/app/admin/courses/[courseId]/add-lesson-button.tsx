"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const lessonTypes = ["READING", "VIDEO", "QUIZ", "DOCUMENT"];

export function AddLessonButton({ moduleId, currentOrder }: { moduleId: string; currentOrder: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("READING");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lesson", moduleId, title, lessonType: type,
          content: content || null, videoUrl: videoUrl || null,
          order: currentOrder + 1,
        }),
      });
      setOpen(false); setTitle(""); setContent(""); setVideoUrl(""); setType("READING");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs h-7 gap-1">
        <Plus className="h-3 w-3" /> Add Lesson
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Add Lesson</h2>
          <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Lesson title..." className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring">
              {lessonTypes.map((t) => (
                <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Embed URL <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube, Canva, Google Slides, Loom, etc." className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring" />
            <p className="text-xs text-muted-foreground">For Canva: use the presentation&apos;s view URL. For YouTube: use the embed URL (youtube.com/embed/...).</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Content <span className="text-muted-foreground font-normal">(Markdown supported)</span></label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              rows={6} placeholder="Lesson content... (supports **bold**, # headings, - lists, [links](url), ![images](url))"
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-black/80">
              {loading ? "Adding…" : "Add Lesson"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
