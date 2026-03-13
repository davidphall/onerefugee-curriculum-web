import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

export default async function StudentsListPage() {
  const user = await getCurrentUser();
  if (!user || user.role === "STUDENT") redirect("/student");

  const assignments = await prisma.staffAssignment.findMany({
    where: { staffId: user.id },
    include: {
      student: {
        include: {
          studentProfile: true,
          enrollments: {
            include: {
              course: { include: { modules: { include: { lessons: true } } } },
            },
          },
          progress: true,
          wellnessLogs: { orderBy: { date: "desc" }, take: 1 },
          streak: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Students</h1>
        <p className="text-muted-foreground mt-1">
          {assignments.length} student{assignments.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            No students assigned yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(({ student }) => {
            const allLessons = student.enrollments.flatMap((e) =>
              e.course.modules.flatMap((m) => m.lessons)
            );
            const completedCount = allLessons.filter((l) =>
              student.progress.some((p) => p.lessonId === l.id)
            ).length;
            const pct =
              allLessons.length > 0
                ? Math.round((completedCount / allLessons.length) * 100)
                : 0;

            const lastActive = student.streak?.lastActiveDate;
            const daysSince = lastActive
              ? Math.floor(
                  (Date.now() - new Date(lastActive).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : null;
            const isFlagged = student.wellnessLogs[0]?.flagged;
            const isInactive = daysSince === null || daysSince >= 7;

            return (
              <Link key={student.id} href={`/staff/students/${student.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{student.name}</p>
                        {isFlagged && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                            Wellness Flag
                          </Badge>
                        )}
                        {isInactive && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground shrink-0">{pct}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.studentProfile?.university ?? "No university"} ·{" "}
                        {student.studentProfile?.major ?? "No major"} ·{" "}
                        {lastActive
                          ? daysSince === 0 ? "Active today" : `Active ${daysSince}d ago`
                          : "Never active"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
