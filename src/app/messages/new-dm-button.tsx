"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserOption { id: string; name: string; email: string; }

export function NewDMButton({ currentUserId }: { currentUserId: string }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    fetch("/api/messages/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.filter((u: UserOption) => u.id !== currentUserId)));
  }, [open, currentUserId]);

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
          <h2 className="font-semibold">New Message</h2>
          <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
          ) : (
            filtered.map((u) => (
              <button
                key={u.id}
                onClick={() => { setOpen(false); router.push(`/messages/${u.id}`); }}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted text-left"
              >
                <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
