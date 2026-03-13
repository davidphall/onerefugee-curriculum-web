"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const statusColors: Record<string, string> = {
  PUBLISHED: "text-green-700 border-green-300 bg-green-50",
  DRAFT:     "text-gray-600 border-gray-300 bg-gray-50",
  ARCHIVED:  "text-red-600 border-red-300 bg-red-50",
};

export function CourseStatusSelect({ courseId, currentStatus }: { courseId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`text-sm rounded-md border px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${statusColors[status]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
      ))}
    </select>
  );
}
