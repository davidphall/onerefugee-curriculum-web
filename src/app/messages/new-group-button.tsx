"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserOption { id: string; name: string; email: string; }

export function NewGroupButton({ currentUserId }: { currentUserId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    fetch("/api/messages/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.filter((u: UserOption) => u.id !== currentUserId)));
  }, [open, currentUserId]);

  function toggleUser(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function handleCreate() {
    if (!name || selected.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, memberIds: selected }),
      });
      const group = await res.json();
      setOpen(false);
      router.push(`/messages/groups/${group.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-muted-foreground hover:text-foreground">
        <Plus className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">New Group</h2>
          <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Group name..."
          className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Add members</p>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filtered.map((u) => {
              const isSelected = selected.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => toggleUser(u.id)}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted text-left"
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isSelected ? "bg-[#E07B39] text-white" : "bg-black text-white"}`}>
                    {isSelected ? <Check className="h-3.5 w-3.5" /> : u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {selected.length > 0 && (
          <p className="text-xs text-muted-foreground">{selected.length} member{selected.length !== 1 ? "s" : ""} selected</p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleCreate} disabled={!name || selected.length === 0 || loading}
            className="bg-black text-white hover:bg-black/80">
            {loading ? "Creating…" : "Create Group"}
          </Button>
        </div>
      </div>
    </div>
  );
}
