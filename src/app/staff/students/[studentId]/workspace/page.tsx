import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { WorkspaceClient } from "@/app/student/workspace/workspace-client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function StaffStudentWorkspacePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const staff = await getCurrentUser();
  if (!staff || staff.role === "STUDENT") redirect("/student");

  const assignment =
    staff.role === "ADMIN"
      ? true
      : await prisma.staffAssignment.findUnique({
          where: { staffId_studentId: { staffId: staff.id, studentId } },
        });

  if (!assignment) notFound();

  const [student, workspace] = await Promise.all([
    prisma.user.findUnique({ where: { id: studentId }, select: { name: true } }),
    prisma.scholarWorkspace.findUnique({ where: { studentId } }),
  ]);

  if (!student) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/staff/students/${studentId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to {student.name}
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{student.name}&apos;s Workspace</h1>
        <p className="text-muted-foreground mt-1">Changes save automatically.</p>
      </div>
      <WorkspaceClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workspace={(workspace ?? { studentId }) as any}
        studentId={studentId}
      />
    </div>
  );
}
