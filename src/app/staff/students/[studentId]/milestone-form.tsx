"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const milestoneTypes = ["INTERNSHIP", "GRADUATION", "CITIZENSHIP", "EMPLOYMENT", "OTHER"];

export function MilestoneForm({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("EMPLOYMENT");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, type, notes, date }),
      });
      setNotes("");
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Add
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full mt-3 space-y-3 border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">New Milestone</p>
        <button type="button" onClick={() => setOpen(false)}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {milestoneTypes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)..."
        rows={2}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading} className="bg-black text-white hover:bg-black/80">
          {loading ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
