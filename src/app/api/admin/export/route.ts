import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => {
        const val = row[h];
        const str = val === null || val === undefined ? "" : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(",")
    ),
  ];
  return lines.join("\n");
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let csv = "";
  let filename = "export";

  if (type === "progress") {
    filename = "student-progress";
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: true,
        enrollments: {
          include: { course: { include: { modules: { include: { lessons: true } } } } },
        },
        progress: true,
        points: { select: { amount: true } },
        streak: true,
      },
    });

    const rows = students.map((s) => {
      const allLessons = s.enrollments.flatMap((e) =>
        e.course.modules.flatMap((m) => m.lessons)
      );
      const completedCount = s.progress.length;
      const totalPoints = s.points.reduce((sum, p) => sum + p.amount, 0);
      return {
        name: s.name,
        email: s.email,
        university: s.studentProfile?.university ?? "",
        major: s.studentProfile?.major ?? "",
        country_of_origin: s.studentProfile?.countryOfOrigin ?? "",
        intake_date: s.studentProfile?.intakeDate?.toISOString().split("T")[0] ?? "",
        courses_enrolled: s.enrollments.length,
        total_lessons: allLessons.length,
        lessons_completed: completedCount,
        completion_pct: allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0,
        total_points: totalPoints,
        current_streak: s.streak?.currentStreak ?? 0,
        longest_streak: s.streak?.longestStreak ?? 0,
      };
    });
    csv = toCSV(rows);
  } else if (type === "milestones") {
    filename = "milestones";
    const milestones = await prisma.milestone.findMany({
      include: { student: { select: { name: true, email: true } } },
      orderBy: { date: "desc" },
    });
    const rows = milestones.map((m) => ({
      student_name: m.student.name,
      student_email: m.student.email,
      type: m.type,
      date: m.date.toISOString().split("T")[0],
      notes: m.notes ?? "",
    }));
    csv = toCSV(rows);
  } else if (type === "enrollments") {
    filename = "enrollments";
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: { select: { name: true, email: true } },
        course: { select: { title: true, category: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
    const rows = enrollments.map((e) => ({
      student_name: e.student.name,
      student_email: e.student.email,
      course_title: e.course.title,
      category: e.course.category,
      enrolled_at: e.enrolledAt.toISOString().split("T")[0],
      completed_at: e.completedAt?.toISOString().split("T")[0] ?? "",
    }));
    csv = toCSV(rows);
  } else {
    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
