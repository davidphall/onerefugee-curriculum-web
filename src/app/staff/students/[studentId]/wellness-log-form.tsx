"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function WellnessLogForm({ studentId, staffId }: { studentId: string; staffId: string }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [flagged, setFlagged] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, notes, flagged }),
      });
      setNotes("");
      setFlagged(false);
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Add Log
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mt-3 space-y-3 border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">New Wellness Log</p>
        <button type="button" onClick={() => setOpen(false)}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this check-in..."
        rows={3}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="flagged"
          checked={flagged}
          onChange={(e) => setFlagged(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="flagged" className="text-sm text-muted-foreground">
          Flag for follow-up
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading} className="bg-black text-white hover:bg-black/80">
          {loading ? "Saving…" : "Save Log"}
        </Button>
      </div>
    </form>
  );
}
