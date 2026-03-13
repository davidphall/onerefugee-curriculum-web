"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteResourceButton({ resourceId, resourceTitle }: { resourceId: string; resourceTitle: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${resourceTitle}"?`)) return;
    setLoading(true);
    try {
      await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40 shrink-0 opacity-0 group-hover:opacity-100"
      title="Delete resource"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
