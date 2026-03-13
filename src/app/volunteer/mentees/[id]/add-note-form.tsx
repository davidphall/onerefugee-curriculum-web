"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AddNoteForm({ connectionId }: { connectionId: string }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/volunteer/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId, body: body.trim() }),
      });
      setBody("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a private note about this mentee…"
        rows={3}
        className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !body.trim()} className="bg-black text-white hover:bg-black/80">
          {loading ? "Saving…" : "Add Note"}
        </Button>
      </div>
    </form>
  );
}
