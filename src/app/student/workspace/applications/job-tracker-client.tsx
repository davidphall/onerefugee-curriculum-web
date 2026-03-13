"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STAGES = [
  { value: "APPLIED", label: "Applied", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "PHONE_SCREEN", label: "Phone Screen", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "INTERVIEW", label: "Interview", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "OFFER", label: "Offer", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-50 text-red-600 border-red-200" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "bg-gray-50 text-gray-500 border-gray-200" },
] as const;

type Stage = typeof STAGES[number]["value"];

interface Application {
  id: string;
  company: string;
  jobTitle: string;
  dateApplied: Date | string | null;
  stage: Stage;
  notes: string | null;
  url: string | null;
}

interface Props {
  initialApplications: Application[];
  studentId?: string;
  readOnly?: boolean;
}

const emptyForm = () => ({
  company: "", jobTitle: "", dateApplied: "", stage: "APPLIED" as Stage, notes: "", url: "",
});

export function JobTrackerClient({ initialApplications, studentId, readOnly = false }: Props) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  function stageInfo(stage: Stage) {
    return STAGES.find((s) => s.value === stage) ?? STAGES[0];
  }

  async function handleAdd() {
    if (!form.company.trim() || !form.jobTitle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/workspace/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(studentId ? { studentId } : {}),
          company: form.company,
          jobTitle: form.jobTitle,
          dateApplied: form.dateApplied || null,
          stage: form.stage,
          notes: form.notes || null,
          url: form.url || null,
        }),
      });
      const newApp = await res.json();
      setApplications([newApp, ...applications]);
      setForm(emptyForm());
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleStageChange(id: string, stage: Stage) {
    if (readOnly) return;
    setApplications(applications.map((a) => a.id === id ? { ...a, stage } : a));
    await fetch("/api/workspace/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stage }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this application?")) return;
    setApplications(applications.filter((a) => a.id !== id));
    await fetch("/api/workspace/applications", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div className="space-y-4">
      <Link href={studentId ? `/staff/students/${studentId}` : "/student/workspace"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to workspace
      </Link>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
        {!readOnly && (
          <Button onClick={() => setShowForm(!showForm)} className="bg-black text-white hover:bg-black/80 gap-1.5">
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-lg border bg-white p-5 space-y-4">
          <h3 className="font-medium text-sm">New Application</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Company *</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Adobe"
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Job Title *</label>
              <input
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="e.g. Marketing Intern"
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Date Applied</label>
              <input
                type="date"
                value={form.dateApplied}
                onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Stage</label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value as Stage })}
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Job Posting URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://…"
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any notes about this application…"
                rows={2}
                className="w-full text-sm rounded-md border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm()); }}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !form.company || !form.jobTitle} className="bg-black text-white hover:bg-black/80">
              {saving ? "Adding…" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {/* Applications table */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border text-center gap-2">
          <p className="font-medium">No applications yet</p>
          <p className="text-sm text-muted-foreground">Add your first application to start tracking.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Date Applied</th>
                <th className="text-left px-4 py-3 font-medium">Stage</th>
                <th className="text-left px-4 py-3 font-medium">Notes</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const stage = stageInfo(app.stage);
                return (
                  <tr key={app.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-1.5">
                        {app.company}
                        {app.url && (
                          <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.jobTitle}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {readOnly ? (
                        <span className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${stage.color}`}>
                          {stage.label}
                        </span>
                      ) : (
                        <select
                          value={app.stage}
                          onChange={(e) => handleStageChange(app.id, e.target.value as Stage)}
                          className={`text-xs font-medium border rounded-full px-2.5 py-0.5 focus:outline-none ${stage.color}`}
                        >
                          {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{app.notes ?? "—"}</td>
                    <td className="pr-3">
                      {!readOnly && (
                        <button onClick={() => handleDelete(app.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
