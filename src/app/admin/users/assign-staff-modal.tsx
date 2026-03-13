"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";

interface Props {
  studentId: string;
  studentName: string;
  staffList: { id: string; name: string }[];
  currentAssignments: { staffId: string; staffName: string }[];
}

export function AssignStaffModal({ studentId, studentName, staffList, currentAssignments }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAssign() {
    if (!selectedStaffId) return;
    setLoading(true);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, staffId: selectedStaffId }),
      });
      router.refresh();
      setSelectedStaffId("");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(staffId: string) {
    setLoading(true);
    try {
      await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, staffId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="text-xs h-7 gap-1">
        <UserPlus className="h-3 w-3" /> Assign
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Assign Staff to {studentName}</h2>
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {currentAssignments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current</p>
            {currentAssignments.map((a) => (
              <div key={a.staffId} className="flex items-center justify-between text-sm">
                <span>{a.staffName}</span>
                <button
                  onClick={() => handleRemove(a.staffId)}
                  className="text-xs text-red-500 hover:underline"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add Staff</p>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a staff member...</option>
            {staffList
              .filter((s) => !currentAssignments.find((a) => a.staffId === s.id))
              .map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAssign} disabled={!selectedStaffId || loading}
            className="bg-black text-white hover:bg-black/80">
            {loading ? "Saving…" : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
