import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, AlertTriangle, BookOpen, ChevronRight } from "lucide-react";

export default async function StaffDashboard() {
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
              course: {
                include: {
                  modules: { include: { lessons: true } },
                },
              },
            },
          },
          progress: true,
          wellnessLogs: {
            orderBy: { date: "desc" },
            take: 1,
          },
          streak: true,
        },
      },
    },
  });

  const flaggedCount = assignments.filter(
    (a) => a.student.wellnessLogs[0]?.flagged
  ).length;

  const inactiveCount = assignments.filter((a) => {
    const last = a.student.streak?.lastActiveDate;
    if (!last) return true;
    const daysSince = Math.floor(
      (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince >= 7;
  }).length;

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {firstName}</h1>
        <p className="text-muted-foreground mt-1">
          You have {assignments.length} assigned student{assignments.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-black/5">
              <Users className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{assignments.length}</p>
              <p className="text-sm text-muted-foreground">Assigned Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{flaggedCount}</p>
              <p className="text-sm text-muted-foreground">Wellness Flags</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2 rounded-md bg-yellow-50">
              <BookOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{inactiveCount}</p>
              <p className="text-sm text-muted-foreground">Inactive 7+ Days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Students</h2>
          <Link href="/staff/students" className="text-sm text-[#E07B39] font-medium hover:underline">
            View all
          </Link>
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
              const isInactive = daysSince === null || daysSince >= 7;
              const isFlagged = student.wellnessLogs[0]?.flagged;

              return (
                <Link key={student.id} href={`/staff/students/${student.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center gap-4 py-4">
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
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
                          <span className="text-xs text-muted-foreground shrink-0">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {student.studentProfile?.university ?? "No university set"} ·{" "}
                          {student.enrollments.length} course{student.enrollments.length !== 1 ? "s" : ""}
                          {lastActive
                            ? ` · Active ${daysSince === 0 ? "today" : `${daysSince}d ago`}`
                            : " · Never active"}
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
    </div>
  );
}
