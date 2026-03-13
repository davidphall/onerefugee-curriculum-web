import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { JobTrackerClient } from "@/app/student/workspace/applications/job-tracker-client";

export default async function StaffStudentApplicationsPage({
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

  const [student, applications] = await Promise.all([
    prisma.user.findUnique({ where: { id: studentId }, select: { name: true } }),
    prisma.jobApplication.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!student) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{student.name}&apos;s Job Applications</h1>
        <p className="text-muted-foreground mt-1">
          Viewing as staff — you can add and update applications on their behalf.
        </p>
      </div>
      <JobTrackerClient
        initialApplications={applications}
        studentId={studentId}
      />
    </div>
  );
}
