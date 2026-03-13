"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, X, Check } from "lucide-react";

interface Course { id: string; title: string; category: string; }

interface Props {
  studentId: string;
  studentName: string;
  allCourses: Course[];
  enrolledCourseIds: string[];
}

const categoryColors: Record<string, string> = {
  EDUCATION:    "text-blue-600",
  PROFESSIONAL: "text-purple-600",
  WELLNESS:     "text-green-600",
  FINANCIAL:    "text-yellow-600",
};

export function EnrollCoursesModal({ studentId, studentName, allCourses, enrolledCourseIds }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const unenrolled = allCourses.filter((c) => !enrolledCourseIds.includes(c.id));

  function toggleCourse(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function handleEnroll() {
    if (!selected.length) return;
    setLoading(true);
    try {
      await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selected[0], studentIds: [studentId] }),
      });
      // Enroll in each selected course
      await Promise.all(
        selected.map((courseId) =>
          fetch("/api/admin/enrollments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId, studentIds: [studentId] }),
          })
        )
      );
      setOpen(false);
      setSelected([]);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs h-7 gap-1"
        disabled={unenrolled.length === 0}
        title={unenrolled.length === 0 ? "Enrolled in all courses" : "Enroll in courses"}
      >
        <BookOpen className="h-3 w-3" /> Enroll
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Enroll {studentName}</h2>
          <button onClick={() => setOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Select courses to enroll this student in.</p>

        <div className="space-y-1 max-h-64 overflow-y-auto border rounded-lg p-1">
          {unenrolled.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Already enrolled in all available courses.
            </p>
          ) : (
            unenrolled.map((c) => {
              const isSelected = selected.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCourse(c.id)}
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted text-left transition-colors"
                >
                  <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${isSelected ? "bg-[#E07B39] border-[#E07B39]" : "border-muted-foreground/30"}`}>
                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className={`text-xs font-medium ${categoryColors[c.category]}`}>
                      {c.category.charAt(0) + c.category.slice(1).toLowerCase()}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {selected.length > 0 && (
          <p className="text-xs text-muted-foreground">{selected.length} course{selected.length !== 1 ? "s" : ""} selected</p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleEnroll}
            disabled={selected.length === 0 || loading}
            className="bg-black text-white hover:bg-black/80"
          >
            {loading ? "Enrolling…" : "Enroll"}
          </Button>
        </div>
      </div>
    </div>
  );
}
