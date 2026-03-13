"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface Props {
  lessonId: string;
  courseId: string;
  completed: boolean;
  nextLessonId?: string;
}

export function MarkCompleteButton({
  lessonId,
  courseId,
  completed,
  nextLessonId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(completed);
  const router = useRouter();

  async function handleComplete() {
    if (done || loading) return;
    setLoading(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      setDone(true);
      router.refresh();
      if (nextLessonId) {
        setTimeout(() => {
          router.push(`/student/courses/${courseId}/lessons/${nextLessonId}`);
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" /> Completed
      </span>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-[#E07B39] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#c96a2e] transition-colors disabled:opacity-60"
    >
      {loading ? "Saving…" : "Mark Complete"}
    </button>
  );
}
