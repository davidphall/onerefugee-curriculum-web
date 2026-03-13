"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserMinus } from "lucide-react";

interface Props {
  studentId: string;
  courseId: string;
  studentName: string;
}

export function UnenrollButton({ studentId, courseId, studentName }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUnenroll() {
    if (!confirm(`Remove ${studentName} from this course?`)) return;
    setLoading(true);
    try {
      await fetch("/api/admin/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, courseId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUnenroll}
      disabled={loading}
      className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40 shrink-0"
      title={`Remove ${studentName}`}
    >
      <UserMinus className="h-4 w-4" />
    </button>
  );
}
