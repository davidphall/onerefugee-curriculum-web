"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Check, Search } from "lucide-react";

interface Student { id: string; name: string; email: string; }

interface Props {
  courseId: string;
  unenrolledStudents: Student[];
}

export function EnrollStudentsButton({ courseId, unenrolledStudents }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function toggleStudent(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function selectAll() {
    setSelected(filtered.map((s) => s.id));
  }

  function clearAll() {
    setSelected([]);
  }

  async function handleEnroll() {
    if (!selected.length) return;
    setLoading(true);
    try {
      await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentIds: selected }),
      });
      setOpen(false);
      setSelected([]);
      setSearch("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const filtered = unenrolledStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-xs"
        disabled={unenrolledStudents.length === 0}
      >
        <UserPlus className="h-3.5 w-3.5" />
        {unenrolledStudents.length === 0 ? "All enrolled" : "Enroll Students"}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Enroll Students</h2>
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Select all / clear */}
        <div className="flex items-center gap-3 text-xs">
          <button onClick={selectAll} className="text-[#E07B39] font-medium hover:underline">
            Select all ({filtered.length})
          </button>
          {selected.length > 0 && (
            <button onClick={clearAll} className="text-muted-foreground hover:underline">
              Clear
            </button>
          )}
          {selected.length > 0 && (
            <span className="ml-auto text-muted-foreground">{selected.length} selected</span>
          )}
        </div>

        {/* Student list */}
        <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No unenrolled students found.</p>
          ) : (
            filtered.map((s) => {
              const isSelected = selected.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleStudent(s.id)}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted text-left transition-colors"
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${isSelected ? "bg-[#E07B39] text-white" : "bg-black text-white"}`}>
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleEnroll}
            disabled={selected.length === 0 || loading}
            className="bg-black text-white hover:bg-black/80"
          >
            {loading ? "Enrolling…" : `Enroll ${selected.length > 0 ? selected.length : ""} Student${selected.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
