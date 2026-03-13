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

// Enroll student(s) in a course
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentIds, courseId } = await req.json();
  if (!courseId || !studentIds?.length)
    return NextResponse.json({ error: "courseId and studentIds required" }, { status: 400 });

  const ids: string[] = studentIds;

  // Upsert enrollments — safe to call if already enrolled
  await prisma.$transaction(
    ids.map((studentId) =>
      prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId, courseId } },
        create: { studentId, courseId },
        update: {},
      })
    )
  );

  return NextResponse.json({ success: true, count: ids.length });
}

// Unenroll a student from a course
export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { studentId, courseId } = await req.json();
  if (!studentId || !courseId)
    return NextResponse.json({ error: "studentId and courseId required" }, { status: 400 });

  await prisma.enrollment.delete({
    where: { studentId_courseId: { studentId, courseId } },
  });

  return NextResponse.json({ success: true });
}
