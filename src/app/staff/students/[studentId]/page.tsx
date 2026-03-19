import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  BookOpen,
  Flame,
  Star,
  GraduationCap,
  Globe,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Trophy,
} from "lucide-react";
import { WellnessLogForm } from "./wellness-log-form";
import { MilestoneForm } from "./milestone-form";

const milestoneLabels: Record<string, string> = {
  INTERNSHIP: "Internship",
  GRADUATION: "Graduation",
  CITIZENSHIP: "Citizenship",
  EMPLOYMENT: "Employment",
  OTHER: "Other",
};

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const staff = await getCurrentUser();
  if (!staff || staff.role === "STUDENT") redirect("/student");

  // Verify this student is assigned to this staff member (unless admin)
  const assignment =
    staff.role === "ADMIN"
      ? true
      : await prisma.staffAssignment.findUnique({
          where: {
            staffId_studentId: { staffId: staff.id, studentId },
          },
        });

  if (!assignment) notFound();

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      studentProfile: true,
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                include: { lessons: true, assignments: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      progress: true,
      submissions: { include: { assignment: true } },
      wellnessLogs: {
        orderBy: { date: "desc" },
        take: 10,
        include: { staff: { select: { name: true } } },
      },
      milestones: { orderBy: { date: "desc" } },
      streak: true,
      points: { select: { amount: true } },
      badges: { include: { badge: true } },
    },
  });

  if (!student) notFound();

  const totalPoints = student.points.reduce((sum, p) => sum + p.amount, 0);
  const completedSet = new Set(student.progress.map((p) => p.lessonId));
  const allLessons = student.enrollments.flatMap((e) =>
    e.course.modules.flatMap((m) => m.lessons)
  );
  const overallPct =
    allLessons.length > 0
      ? Math.round((completedSet.size / allLessons.length) * 100)
      : 0;

  const lastActive = student.streak?.lastActiveDate;
  const daysSince = lastActive
    ? Math.floor(
        (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/staff/students"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to students
        </Link>
        <Link
          href={`/staff/students/${studentId}/workspace`}
          className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
        >
          View Workspace
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold shrink-0">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{student.name}</h1>
          <p className="text-muted-foreground text-sm">{student.email}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {student.studentProfile?.university && (
              <Badge variant="outline" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                {student.studentProfile.university}
              </Badge>
            )}
            {student.studentProfile?.major && (
              <Badge variant="outline" className="text-xs">
                {student.studentProfile.major}
                {student.studentProfile.yearInSchool && ` · ${student.studentProfile.yearInSchool}`}
              </Badge>
            )}
            {student.studentProfile?.countryOfOrigin && (
              <Badge variant="outline" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {student.studentProfile.countryOfOrigin}
              </Badge>
            )}
            {student.studentProfile?.phone && (
              <Badge variant="outline" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                {student.studentProfile.phone}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="h-4 w-4 text-[#E07B39]" />} bg="bg-[#E07B39]/10" value={`${overallPct}%`} label="Overall Progress" />
        <StatCard icon={<Star className="h-4 w-4 text-yellow-500" />} bg="bg-yellow-50" value={totalPoints} label="Points" />
        <StatCard icon={<Flame className="h-4 w-4 text-orange-500" />} bg="bg-orange-50" value={student.streak?.currentStreak ?? 0} label="Streak" />
        <StatCard icon={<Trophy className="h-4 w-4 text-purple-500" />} bg="bg-purple-50" value={student.badges.length} label="Badges" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — courses + activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Course Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No courses enrolled.</p>
              ) : (
                student.enrollments.map(({ course, completedAt }) => {
                  const lessons = course.modules.flatMap((m) => m.lessons);
                  const done = lessons.filter((l) => completedSet.has(l.id)).length;
                  const pct = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
                  return (
                    <div key={course.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{course.title}</p>
                          {completedAt && (
                            <Badge className="bg-green-600 text-white border-0 text-xs">Complete</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{done}/{lessons.length}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Wellness log */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Wellness Log</CardTitle>
                <WellnessLogForm studentId={studentId} staffId={staff.id} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.wellnessLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No wellness logs yet.</p>
              ) : (
                student.wellnessLogs.map((log) => (
                  <div key={log.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()} · {log.staff.name}
                      </span>
                      {log.flagged && (
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Flagged
                        </Badge>
                      )}
                    </div>
                    {log.notes && <p className="text-sm">{log.notes}</p>}
                    <Separator />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right — milestones + recent activity */}
        <div className="space-y-6">
          {/* Milestones */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Milestones</CardTitle>
                <MilestoneForm studentId={studentId} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No milestones yet.</p>
              ) : (
                student.milestones.map((m) => (
                  <div key={m.id} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{milestoneLabels[m.type]}</p>
                      {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Activity summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last active</span>
                <span className="font-medium">
                  {daysSince === null
                    ? "Never"
                    : daysSince === 0
                    ? "Today"
                    : `${daysSince} days ago`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lessons done</span>
                <span className="font-medium">{completedSet.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assignments</span>
                <span className="font-medium">{student.submissions.length} submitted</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intake date</span>
                <span className="font-medium">
                  {student.studentProfile?.intakeDate
                    ? new Date(student.studentProfile.intakeDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, bg, value, label }: { icon: React.ReactNode; bg: string; value: string | number; label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 pt-5">
        <div className={`p-2 rounded-md ${bg}`}>{icon}</div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
